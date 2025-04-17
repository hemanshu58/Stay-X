const otpGenerator = require("otp-generator");
const transporter = require("../utils/nodemailer");

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code for Verification",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send OTP email");
  }
};

const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
};

module.exports = { sendOTPEmail, generateOTP };
