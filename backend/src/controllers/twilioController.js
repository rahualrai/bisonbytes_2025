// File: backend/src/controllers/twilioController.js
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const processGather = (req, res) => {
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
  

const testTwilioCall = async (req, res) => {
  try {
    const call = await client.calls.create({
        twiml: `
          <Response>
            <Say voice="Google.en-US-Wavenet-F">
              This is an emergency alert from the health monitoring system. Please listen carefully.
              Patient name: Aaryan Panthi.
              Location: 426 Florida Ave NW, Washington, D C.
            </Say>
            <Gather numDigits="1" action="https://74b6-138-238-254-103.ngrok-free.app/process-gather" method="POST" timeout="10">
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
    console.log(`Test call started, SID: ${call.sid}`);      

    res.json({ message: "Test call started", sid: call.sid });
  } catch (err) {
    console.error("Error testing Twilio call:", err);
    res.status(500).json({ error: "Failed to start test call" });
  }
};

export default { testTwilioCall, processGather };
