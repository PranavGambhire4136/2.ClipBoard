const express = require("express");
const { sendFile } = require("../controller/FileSend");
const { fileRecieve } = require("../controller/ReceiveFile");
const { sendString } = require("../controller/StringSend");
const { receiveString } = require("../controller/ReceiveString");
const router = express.Router();

router.post("/uploadFile", sendFile);
router.get("/receiveFile", fileRecieve);

router.post("/uploadString", sendString);
router.get("/receiveString", receiveString);

module.exports = router;