require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const twilio = require('twilio');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = twilio(accountSid, authToken);

// Endpoint to send OTP
app.post('/api/send-otp', (req, res) => {
  const { phoneNumber } = req.body;
  console.log(phoneNumber);
  client.verify.v2.services(verifySid)
    .verifications.create({ to: "+212606060481", channel: 'sms' })
    .then(verification => {
      res.status(200).json({ status: verification.status });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
    res.send('api phone!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test', (req, res) => {
  res.send('test World!');
});