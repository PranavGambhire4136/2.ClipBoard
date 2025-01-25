const String = require("../Model/Strings");
const { generateOTP } = require("./utility/generateOTP");

exports.sendString = async (req, res) => {
    try {
        const { string } = req.body;
        if (!string) {
            return res.status(400).json({ success: false, message: "Please provide string to send" });
        }

        console.log("from string.js: ",string);

        const recoveryString = generateOTP();
        
        console.log("from string.js: ",recoveryString);

        const stringData = await String.create({
            string: string,
            recoveryString: recoveryString,
        });

        if (!stringData) {
            return res.status(400).json({ success: false, message: "Something went wrong while sending string" });
        }

        return res.status(200).json({ success: true, message: "String sent successfully", recoveryString: recoveryString });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}