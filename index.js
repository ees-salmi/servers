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
app.get('/api/send-otp', (req, res) => {
  const { phoneNumber } = req.body;
  console.log(phoneNumber);
  client.verify.v2.services(verifySid)
    .verifications.create({ to: phoneNumber, channel: 'sms' })
    .then(verification => {
      res.status(200).json({ status: verification.status });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!!!!');
});

app.get('/test', (req, res) => {
  res.send('test World!');
});
app.get('/verify-otp', (req, res) => {
  const phoneNumber = req.query.phone;
  const otpCode = req.query.code;

  client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phoneNumber, code: otpCode })
      .then(verification_check => {
          if (verification_check.status === 'approved') {
              res.status(200).send('OTP verified successfully');
          } else {
              res.status(400).send('OTP verification failed');
          }
      })
      .catch(error => {
          res.status(500).send('Error verifying OTP');
      });
});
