
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceid = process.env.SSID;
const client = require('twilio')(accountSid, authToken);

function sendotp(phone) {
    console.log(phone);
  client.verify.v2
    .services(serviceid)
    .verifications
    .create({ to: `+91${phone}`, channel: 'sms' })
    .then((verification) => console.log(verification.status));
}

function verifyotp(mobail, otp) {
  console.log(mobail + otp);
  return new Promise((resolve) => {
    client.verify.v2
      .services(serviceid)
      .verificationChecks.create({ to: `+91${mobail}`, code: otp })
      .then((verification_check) => {
        console.log(verification_check.status);
        resolve(verification_check);
      });
  });
}

module.exports = {
  sendotp,
  verifyotp
};