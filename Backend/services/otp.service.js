const crypto = require("crypto");

/**
 * Generate a 6-digit OTP code.
 */
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Send OTP via Twilio or return demo OTP in development mode.
 * @param {string} phone 10-digit phone number
 * @returns {Promise<{ otp: string, isDemo: boolean, message: string }>}
 */
async function sendOtpSms(phone) {
  const isDevMode = process.env.ENVIRONMENT === "development" || !process.env.TWILIO_ACCOUNT_SID;

  if (isDevMode) {
    const demoOtp = "123456";
    console.log(`[OTP Service - DEV MODE] Phone: ${phone} | Demo OTP: ${demoOtp}`);
    return {
      otp: demoOtp,
      isDemo: true,
      message: "OTP sent successfully (Development Demo Mode: Use 123456)",
    };
  }

  // Production Twilio Integration
  try {
    const twilio = require("twilio");
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const otp = generateOtp();

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    await client.messages.create({
      body: `Your Rapigo verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`[OTP Service - TWILIO] Sent SMS to ${formattedPhone}`);
    return {
      otp,
      isDemo: false,
      message: "OTP sent successfully via SMS",
    };
  } catch (error) {
    console.error("[OTP Service Error]", error.message);
    throw new Error(`Failed to send SMS OTP: ${error.message}`);
  }
}

module.exports = {
  generateOtp,
  sendOtpSms,
};
