import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  name: string,
  email: string,
  phone: string,
  message: string
) => {
  const host = process.env.HOST;
  const fromEmail = process.env.EMAIL;
  const pass = process.env.PASS;
  console.log(host, process.env.Email_PORT, email, pass);

  if (!host || !fromEmail || !pass) {
    throw new Error("Missing email configuration in environment variables.");
  }

  const transporter = nodemailer.createTransport({
    host: host,
    secure: true, // True for 465, false for other ports
    auth: {
      user: fromEmail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: fromEmail,
    to,
    subject,
    text: `
      A new message is sent from your form
      Subject: ${subject},
      Name: ${name},
      Email: ${email},
      Phone: ${phone},
      Message: ${message},
    `,
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
