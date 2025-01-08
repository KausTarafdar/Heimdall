import dotenv from 'dotenv';
dotenv.config();

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/request-monitor'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },
  alert: {
    timeWindowMinutes: 10,
    maxAttempts: 5,
    adminEmail: process.env.ADMIN_EMAIL
  },
  server: {
    port: process.env.PORT || 3000
  }
};
