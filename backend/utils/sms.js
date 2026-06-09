const twilio = require('twilio');

const smsReady = () =>
  !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);

const sendSms = async ({ to, message }) => {
  if (!smsReady()) {
    console.log(`[SMS-TEST] To: ${to} | Message: ${message}`);
    return;
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
};

module.exports = { sendSms, smsReady };
