# Email Timeout Fix for Render Deployment

## Problem

Getting `ETIMEDOUT` connection timeout errors when sending password reset/welcome emails on Render, while it works fine locally.

## Root Cause

- Render's network may have restrictions on direct SMTP connections to Gmail
- Default nodemailer settings use port 465 (SSL) which is less reliable on cloud platforms
- Socket and connection timeouts were too short for cloud networks

## Solutions Applied ✅

### 1. **Updated Transporter Configuration** (`Backend/utils/email.js`)

- Changed from `service: "gmail"` to explicit host/port configuration
- Using port 587 (STARTTLS) instead of 465 (SSL) - more reliable on cloud
- Added connection pooling with appropriate limits
- Extended timeout from defaults to **30 seconds** for both connection and socket

```javascript
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // TLS - more cloud-friendly
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: {
      maxConnections: 1, // Prevent connection saturation
      maxMessages: 5,
      rateDelta: 2000,
      rateLimit: 5,
    },
    connectionTimeout: 30000, // 30 seconds
    socketTimeout: 30000,
  });
};
```

### 2. **Added Retry Logic**

- Automatic retry with 3-second wait between attempts
- Welcome emails: 2 retry attempts (graceful failure, doesn't block signup)
- Password reset: 2 retry attempts (throws error if critical)
- Better error logging with visual indicators (✅, ❌, ⚠️)

## Verification Checklist

Before deploying, ensure:

### Gmail Account Setup

- [ ] Using **Gmail App Password**, NOT regular password

  - Go to: https://myaccount.google.com/apppasswords
  - Generate app password for "Mail" and "Windows"
  - Use only the 16-character code in `EMAIL_PASS`

- [ ] 2-Factor Authentication is ENABLED on Google Account

  - App passwords only work with 2FA enabled

- [ ] Less Secure App Access is NOT needed (we're using app passwords now)

### Environment Variables (`.env`)

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password-without-spaces
FRONTEND_URL=https://fyp-compass.vercel.app
```

### Render Configuration

- [ ] Redeploy after updating `.env` on Render dashboard
- [ ] Check deployment logs for connection messages

## Testing the Fix

### Local Test

```bash
npm test  # or manually trigger password reset
```

### Render Test

1. Deploy changes to Render
2. Test password reset on deployed app
3. Check Render logs for: "✅ Password reset email sent to..."

## If Still Not Working

### Option 1: Check Gmail Restrictions

```bash
# Test SMTP connectivity from Render
# This requires SSH access to container
telnet smtp.gmail.com 587
```

### Option 2: Use SendGrid Instead (Recommended for Production)

Gmail SMTP is unreliable on cloud platforms due to security restrictions.

**Alternative Email Service (SendGrid)**:

```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

Steps:

1. Sign up at https://sendgrid.com (free tier available)
2. Create API key
3. Add to Render environment: `SENDGRID_API_KEY=...`
4. Update transporter in `email.js`

### Option 3: Use Resend API

More modern email service with better defaults:

```bash
npm install resend
```

### Option 4: Disable Email (Temporary)

For development/testing:

```javascript
if (process.env.NODE_ENV === "development") {
  console.log("📧 Email would be sent to:", email);
  return; // Skip actual send
}
```

## Key Changes Summary

| Aspect         | Before       | After            |
| -------------- | ------------ | ---------------- |
| Port           | 465 (SSL)    | 587 (TLS)        |
| Timeout        | Default (5s) | 30s              |
| Retries        | None         | 2 attempts       |
| Pooling        | None         | Configured       |
| Error Handling | None         | Detailed logging |
| Fallback       | Crash        | Graceful fail    |

## Monitoring

Watch Render logs for:

- ✅ `✅ Password reset email sent to...` - SUCCESS
- ❌ `❌ Password reset attempt...` - Retry triggered
- ⚠️ `⚠️ Final failure...` - Max retries exceeded

## Questions?

If emails still timeout after these changes, email service provider limitations on your Render plan may be the issue. Contact Render support or switch to SendGrid/Resend for guaranteed delivery.
