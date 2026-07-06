import { Resend } from "resend";
import twilio from "twilio";
const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);
// Send OTP via email using Resend
export async function sendEmailOTP(email, otp) {
  const result = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "GREENPEG IIoT — Your PIN Reset OTP",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2 style="color:#167A3E">GREENPEG IIoT Security</h2>
        <p>Your one-time PIN reset code is:</p>
        <div style="font-size:36px;font-weight:bold;
                    letter-spacing:8px;color:#167A3E;
                    text-align:center;padding:20px">
          ${otp}
        </div>
        <p style="color:#666">This code expires in 10 minutes.</p>
        <p style="color:#666">If you did not request this, ignore this email.</p>
      </div>
    `,
  });
  return result;
}

// Send OTP via SMS using Twilio
// export async function sendSMSOTP(phoneNumber, otp) {
//   await twilioClient.messages.create({
//     body: `GREENPEG IIoT: Your PIN reset code is ${otp}. Expires in 10 minutes.`,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: phoneNumber,
//   });
// }
