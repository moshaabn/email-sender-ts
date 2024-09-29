import express, { Request, Response } from "express";
import { sendEmail } from "./services/email-service";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());
// Email sending endpoint
app.post("/send-email", async (req: Request, res: Response) => {
  req.body.to = process.env.RECEIVER;
  const { to, subject, name, email, phone, message } = req.body;
  console.log("Request Body:", req.body);

  if (!to || !subject || !name || !email || !phone || !message) {
    return res
      .status(400)
      .send({
        error:
          "Missing required fields: to, subject, name, email, phone, message",
      });
  }

  try {
    await sendEmail(to, subject, name, email, phone, message);
    res.status(200).send({ message: "Email sent successfully" });
  } catch (error: any) {
    // Check if the error contains '403' in the message
    if (error.message.startsWith("403")) {
      // Return 403 Forbidden if email sending failed
      res.status(403).send({ error: error.message });
    } else {
      console.log(error);
      // Handle other types of errors (e.g., internal server errors)
      res.status(500).send({ error: "Internal server error" });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
