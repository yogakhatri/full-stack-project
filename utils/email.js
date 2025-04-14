import nodemailer from "nodemailer";
import "dotenv/config";

// Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendMailToUser(subject, email, emailBody) {
  // send mail with defined transport object
  const info = await transport.sendMail({
    from: "yogakhatri@gmail.com", // sender address
    to: email, // list of receivers
    subject, // Subject line
    text: emailBody, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
