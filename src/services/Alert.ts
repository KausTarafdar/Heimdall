import nodemailer from 'nodemailer';
import { config } from '../config';
import Bull from 'bull';

const transporter = nodemailer.createTransport(config.smtp);

export async function sendAlert(ip: string){
  const mailOptions = {
    from: config.email_credentials.from_email,
    to: config.email_credentials.to_email,
    subject: "Alert: Multiple Failed Requests Detected",
    text: `System alert from monitoring system in charge\n
    Threshold breached for IP: ${ip} over the course of the last 10 mins\n`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Alert email sent successfully.");
  } catch (error) {
    console.error("Failed to send alert email:", error);
  }
}

const emailQueue = new Bull('email')

emailQueue.process(async (job)=> {
  const mailOptions = {
    from: config.email_credentials.from_email,
    to: config.email_credentials.to_email,
    subject: "Alert: Multiple Failed Requests Detected",
    text: `System alert from monitoring system in charge\n
    Threshold breached for IP: ${job.data.ip} over the course of the last 10 mins\n`,
  };

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error)
  }
})

export default emailQueue