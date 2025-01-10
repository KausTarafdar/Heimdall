# Heimdall
## **Alerting System for Monitoring Failed POST Requests**
This project implements a scalable backend system that monitors failed POST requests to a specific endpoint (/api/submit) due to invalid headers or incorrect access tokens. It tracks the number of failed attempts from each IP address within a configurable time window and triggers email alerts using Google's SMTP server when a threshold is exceeded. Additionally, it logs metrics for further analysis and provides an API to fetch these metrics.
_____________________
## Features
- **Invalid Request Monitoring**: Identifies invalid POST requests caused by improper headers or incorrect access tokens.

- **IP Tracking**: Tracks failed requests by source IP within a configurable time window.

- **Email Alerts**: Sends email notifications when a threshold of failed attempts from the same IP is breached.

- **Metric Logging**: Stores details such as source IP, timestamp, and reason for failure.

- **Metrics API**: Exposes an endpoint to retrieve stored metrics.
_____________________
## Usage
### Endpoints
```**POST **/api/submit```

Simulates the monitored endpoint.

Triggers failure for invalid headers or incorrect access tokens.

```**GET **/api/metrics```

- Fetch metrics of failed requests.

Example Request
```**POST **/api/submit```

curl -X POST http://localhost:3000/api/submit -H "access-token": "access-provided"
```**GET **/api/metrics```

____________________
## Alerting Mechanism
Monitors the /api/submit endpoint for failed requests.
Tracks failed attempts by IP within the configured time window (TIME_WINDOW_MINUTES).
After inital alert, every 5 request within the window, alert triggered
Sends an alert email to the configured ADMIN_EMAIL if the number of failed attempts from an IP exceeds the threshold (ALERT_THRESHOLD).
_____________________
## Tech Stack
Backend Language: Node.js (TypeScript).
Framework: Express.js.
Database: MongoDB and Redis as Cache.
Email Alerts: Google SMTP server for notifications.
______________________
## Installation

- Clone the Repository:
```bash
git clone <repository-url>
cd <repository-directory>
```
- Install Dependencies:
```bash
npm install
```
- Set Environment Variables: Create a .env file in the root directory and configure the following:
```bash
PORT=

# MAIL DETAILS
ADMIN_EMAIL=
SMTP_USER=
SMTP_PASS=

# REDIS DETAILS
REDIS_PASSWORD=
REDIS_HOST=
REDIS_PORT=

# MONGODB CLOUD DETAILS
MONGODB_URI=
```
- Run the Server:
```bash
npm start:prod
```