const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");
const mime = require("mime-types");

async function uploadToCloud(file, folders) {
    const mimeType = mime.lookup(file.tempFilePath);

    let resourceType = "raw";
    if (mimeType && mimeType.startsWith("image/")) {
        resourceType = "image";
    } else if (mimeType && mimeType.startsWith("video/")) {
        resourceType = "video";
    }

    const options = {
        folder: `Home/${folders || "default"}`,
        resource_type: resourceType,
        invalidate: true,
    };

    console.log(`Uploading file: ${file.tempFilePath} as ${resourceType}`);

    try {
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (err) {
        throw new Error(`Cloudinary upload failed: ${err.message}`);
    }
}

exports.uploadFile = async (file, folders) => {
    try {
        const result = await uploadToCloud(file, folders);

        if (file.tempFilePath) {
            console.log("Deleting temporary file:", file.tempFilePath);
            await fs.rm(file.tempFilePath);
        }

        return result.secure_url;
    } catch (err) {
        console.error(`File upload failed: ${err.message}`);
        throw err;
    }
};
