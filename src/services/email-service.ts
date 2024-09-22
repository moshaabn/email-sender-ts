import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  message: string
) => {
  const host = process.env.HOST;
  const email = process.env.EMAIL;
  const pass = process.env.PASS;
  console.log(host, process.env.Email_PORT, email, pass);

  if (!host || !email || !pass) {
    throw new Error("Missing email configuration in environment variables.");
  }

  const transporter = nodemailer.createTransport({
    host: host,
    secure: true, // True for 465, false for other ports
    auth: {
      user: email,
      pass: pass,
    },
  });

  const mailOptions = {
    from: email,
    to,
    subject,
    text: message,
  };

  try {
    // Attempt to send the email
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error("Email send error:", error);

    // Combine the custom error message with the original error
    throw new Error(`403: Email send error: ${error.message}`);
  }
};
