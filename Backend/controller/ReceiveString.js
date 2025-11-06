const String = require("../Model/Strings");

exports.receiveString = async (req, res) => {
    try {
        // console.log("from receiveString.js", req.query);
        const {RecoveryString} = req.query;
        // console.log(RecoveryString);
        if (!RecoveryString) {
            return res.status(400).json({ 
                success: false,
                message: "Please provide recovery string",
            })
        }

        const string = await String.findOne({recoveryString: RecoveryString});
        // console.log(string);
        
        if (!string) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid recovery string or String not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "String found",
            string: string.string
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Something went wrong",
        })
        console.log(error);
    }
}
