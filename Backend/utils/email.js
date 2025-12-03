const nodemailer = require("nodemailer");

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send welcome email with credentials
const sendWelcomeEmail = async (email, name, password, role) => {
  const transporter = createTransporter();

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

  await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();

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

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail, sendWelcomeEmail };
