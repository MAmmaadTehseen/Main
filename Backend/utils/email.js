/**
 * Email Utility Functions
 * Handles sending emails using Gmail SMTP
 * Used for account creation and password reset notifications
 */

const nodemailer = require("nodemailer");

/**
 * CREATE EMAIL TRANSPORTER
 * Sets up Gmail SMTP connection using credentials from .env
 * Configured with timeouts and connection pooling for cloud deployment
 * Returns a reusable transporter object for sending emails
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // TLS port (more reliable than 465 on cloud)
    secure: false, // Use STARTTLS instead of SSL
    auth: {
      user: process.env.EMAIL_USER, // Gmail address from .env
      pass: process.env.EMAIL_PASS, // Gmail app password from .env (not regular password!)
    },
    // Connection pool settings for cloud reliability
    pool: {
      maxConnections: 1, // Reduce connections for Render
      maxMessages: 5,
      rateDelta: 2000, // Wait 2 seconds between emails
      rateLimit: 5, // Max 5 emails per rateDelta
    },
    // Extended timeout for cloud networks
    connectionTimeout: 30000, // 30 seconds (increased from default)
    socketTimeout: 30000, // 30 seconds for socket operations
  });
};

/**
 * SEND WELCOME EMAIL
 * Sends account creation email with credentials to new users
 * Email contains login link and temporary password
 * Includes retry logic for cloud deployment reliability
 *
 * @param {string} email - Recipient's email address
 * @param {string} name - User's full name
 * @param {string} password - Temporary password
 * @param {string} role - User's role (admin/advisor/student)
 * @throws {Error} If email fails to send after retries
 */
const sendWelcomeEmail = async (email, name, password, role) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;

  const mailOptions = {
    from: `"FYP COMPASS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to FYP COMPASS - Your Account Details",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1ABC9C; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .credentials { background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .credentials p { margin: 10px 0; }
          .label { color: #666; font-size: 14px; }
          .value { font-weight: bold; color: #1B4965; font-size: 16px; }
          .button { display: inline-block; background-color: #1ABC9C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FYP COMPASS</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${name}!</h2>
            <p>Your account has been created on FYP COMPASS. You have been registered as a <strong>${role}</strong>.</p>

            <div class="credentials">
              <p><span class="label">Email:</span><br><span class="value">${email}</span></p>
              <p><span class="label">Password:</span><br><span class="value">${password}</span></p>
            </div>

            <p style="text-align: center;">
              <a href="${loginUrl}" class="button" style="color: white;">Login to FYP COMPASS</a>
            </p>

            <div class="warning">
              <strong>Important:</strong> Please change your password after your first login for security purposes.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FYP COMPASS. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // Send email with retry logic (max 2 attempts)
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
      return; // Success, exit function
    } catch (error) {
      lastError = error;
      console.error(
        `❌ Welcome email attempt ${attempt} failed for ${email}:`,
        error.message
      );
      if (attempt < 2) {
        // Wait 3 seconds before retry
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  // If both attempts fail, log but don't crash
  console.error(
    `⚠️ Final failure: Could not send welcome email to ${email}`,
    lastError.message
  );
  // Don't throw - allow account creation even if email fails
};

/**
 * SEND PASSWORD RESET EMAIL
 * Sends password reset link to user
 * Link contains JWT token and expires in 1 hour
 * Includes retry logic for cloud deployment reliability
 *
 * @param {string} email - Recipient's email address
 * @param {string} resetToken - JWT token for password reset validation
 * @throws {Error} If email fails to send after retries
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  // Build password reset URL with token
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"FYP COMPASS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request - FYP COMPASS",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1ABC9C; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background-color: #1ABC9C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FYP COMPASS</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button" style="color: white;">Reset Password</a>
            </p>
            <p>This link will expire in <strong>1 hour</strong>.</p>
            <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #1ABC9C; word-break: break-all;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FYP COMPASS. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // Send email with retry logic (max 2 attempts)
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
      return; // Success, exit function
    } catch (error) {
      lastError = error;
      console.error(
        `❌ Password reset attempt ${attempt} failed for ${email}:`,
        error.message
      );
      if (attempt < 2) {
        // Wait 3 seconds before retry
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  // If both attempts fail, throw error (password reset is critical)
  throw new Error(
    `Failed to send password reset email to ${email} after 2 attempts: ${lastError.message}`
  );
};

module.exports = { sendPasswordResetEmail, sendWelcomeEmail };
