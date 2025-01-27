const otpGenerator = require("otp-generator");

exports.generateOTP = () => {
    return otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}