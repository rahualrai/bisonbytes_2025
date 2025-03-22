import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({ path: './.env.local' }); // adjust path if needed

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

async function testTwilioCall() {
  try {
    const call = await client.calls.create({
      twiml: '<Response><Say>Hello maddafakar</Say></Response>',
      to: '+12023308360',  // replace with your phone number in +1234 format
      from: twilioPhone,
    });

    console.log(`Test call started, SID: ${call.sid}`);
  } catch (err) {
    console.error('Error testing Twilio:', err);
  }
}

testTwilioCall();
