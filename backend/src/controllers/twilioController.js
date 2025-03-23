// File: backend/src/controllers/twilioController.js
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const processGather = (req, res) => {
  const pressed = req.body.Digits;
  const twiml = new twilio.twiml.VoiceResponse();

  if (pressed === "1") {
    twiml.say(
      { voice: "Google.en-US-Wavenet-F" },
      "Connecting you to emergency medical services now."
    );
    twiml.dial("+12028077221");
  } else {
    twiml.say(
      { voice: "Google.en-US-Wavenet-F" },
      "No valid input received. Goodbye and stay safe."
    );
  }

  res.type("text/xml");
  res.send(twiml.toString());
};


export const callTwilio = async (location, vitals) => {
  try {
    if (!vitals || !vitals.heartRate || !vitals.oxygenSaturation || !vitals.temperature) {
      throw new Error("Invalid vitals data");
    }
    const call = await client.calls.create({
      twiml: `
        <Response>
          <Say voice="Google.en-US-Wavenet-F">
            This is an emergency alert from the health monitoring system. Please listen carefully.
            Patient location: ${location}.
            Heart rate: ${vitals.heartRate}.
            Oxygen saturation: ${vitals.oxygenSaturation}.
            Temperature: ${vitals.temperature}.
          </Say>
          <Gather numDigits="1" action="https://c3f8-138-238-254-98.ngrok-free.app/process-gather" method="POST" timeout="10">
            <Say voice="Google.en-US-Wavenet-F">
              If you would like to be immediately connected to emergency medical services, please press 1.
            </Say>
          </Gather>
          <Say voice="Google.en-US-Wavenet-F">
            No input received. The call will now end. Stay safe.
          </Say>
        </Response>`,
      to: "+12023308360",
      from: twilioPhone,
    });
    console.log("Twilio call initiated:", call.sid);
    return { success: true, sid: call.sid };
  } catch (error) {
    console.error("Error initiating Twilio call:", error);
    return { success: false, error: "Failed to start test call" };
  }
};

export default { callTwilio, processGather };