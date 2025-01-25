const File = require("../Model/File");
const {uploadFile} = require("../controller/utility/uploadCloudinary");
const { generateOTP } = require("./utility/generateOTP");
const mime = require("mime-types");

exports.sendFile = async (req, res) => {
    try {
        console.log("req.files: ",req.files);
        const filename = req.files?.filename;

        if (!filename ) {
            return res.status(400).json({
                success: false,
                message: "Please provide file to send",
            })
        }


        const fileLink = await uploadFile(filename, "ClipBoard");
        const recoveryString = generateOTP();

        if (!fileLink || !recoveryString) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong while sending file",
            })
        }

        console.log(fileLink);
        const FileExtension = mime.extension(filename.mimetype);
        console.log("FileExtension: ", FileExtension);
        
        const file = await File.create({
            filename: filename.name,
            RecoveryString: recoveryString,
            location: fileLink,
            Type: FileExtension,
        });

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong while creating file",
            })
        }

        await file.save();
        

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                fileLink: fileLink,
                recoveryString: recoveryString
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending file",
        })
    }
}