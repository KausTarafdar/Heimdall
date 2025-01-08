import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAlert(ip: string){
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.ALERT_EMAIL,
    subject: "Alert: Multiple Failed Requests Detected",
    text: `Threshold breached for IP: ${ip}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Alert email sent successfully.");
  } catch (error) {
    console.error("Failed to send alert email:", error);
  }
}
