const File = require("../Model/File");

exports.fileRecieve = async (req, res) => {
    try {
        const {RecoveryString} = req.body;
        if (!RecoveryString) {
            return res.status(400).json({ 
                success: false,
                message: "Please provide recovery string",
            });
        }

        const file = await File.findOne({RecoveryString: RecoveryString});
        
        if (!file) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid recovery string or File not found ",
            });
        }
        const FileType = file.Type;
        file.RecoveryString = null;
        file.expiryAt = null;
        file._id = null;

        return res.status(200).json({
            success: true,
            message: "File found",
            file: file,
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Something went wrong",
        });
    }
}