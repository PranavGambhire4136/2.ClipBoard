import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function AddFile() {
  const [sendFile, setSendFile] = useState({});
  const [recoveryString, setRecoveryString] = useState("");
  const [receivedFile, setReceivedFile] = useState(false);
  const [retrievedFileData, setRetrievedFileData] = useState({
    location: "",
    Type: "",
  });
  const [fileUploaded, setFileUploaded] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setSendFile((prev) => ({ ...prev, [name]: value }));
  };

  const fileChangeHandler = (e) => {
    setSendFile((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Uploading file...");
    axios
      .post("https://2-clip-board.vercel.app/api/v1/uploadFile", sendFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((response) => {
        setRecoveryString(response.data.data.recoveryString);
        setFileUploaded(true);
        toast.success(`File uploaded successfully! Recovery String: ${response.data.data.recoveryString}`);
        toast.dismiss(toastId);
      })
      .catch((error) => {
        console.log(error);
        toast.fail(error.response.data.message);
        toast.dismiss(toastId);
      });

  };

  const submitRecovery = (e) => {
    e.preventDefault();

    const toastId = toast.loading("Retrieving file...");

    axios
      .get("https://2-clip-board.vercel.app/api/v1/receiveFile", {
        params: {
          RecoveryString: recoveryString,
        },
      })
      .then((response) => {
        setRetrievedFileData(response.data.file);
        setReceivedFile(true);
        toast.dismiss(toastId);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        toast.dismiss(toastId);
      });


  };

  const handleDownload = async () => {

    if (retrievedFileData && retrievedFileData.location && retrievedFileData.filename) {

      if (!retrievedFileData.Type) {
        toast.error("Error: File type is missing");
        return;
      }

      try {
        const response = await fetch(retrievedFileData.location);

        if (!response.ok) {
          throw new Error("Failed to fetch the file");
        }

        const fileData = await response.blob();
        const fileType = retrievedFileData.Type.trim().toLowerCase();

        let newFileName = retrievedFileData.filename;
        if (!newFileName.toLowerCase().endsWith(`.${fileType}`)) {
          newFileName = `${newFileName}.${fileType}`;
        }

        const fileUrl = URL.createObjectURL(new Blob([fileData], { type: fileData.type }));

        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = newFileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(fileUrl);

        toast.success("File downloaded successfully!");
      } catch (error) {
        toast.error("Error: Unable to download the file.");
      }
    } else {
      toast.error("Error: File data is incomplete or missing.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 flex-col">
      {!receivedFile && (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <div className="text-gray-700 text-2xl font-bold mb-4">File Manager</div>

          {/* File Upload Form */}
          <form onSubmit={submitHandler} className="flex flex-col space-y-4">
            <div className="text-gray-700 text-lg font-semibold">Upload File</div>
            <div className="border border-gray-300 bg-amber-100 rounded-lg p-4">
              <input
                type="file"
                onChange={fileChangeHandler}
                className="w-full bg-transparent focus:outline-none"
                placeholder="Select File"
                required
              />
            </div>
            <div className="text-gray-700 text-lg font-semibold">Set Recovery Password (Optional)</div>
            <input
              type="text"
              placeholder="Enter Custom Recovery Password"
              name="recoveryString"
              value={sendFile.recoveryString}
              onChange={changeHandler}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-amber-300 focus:outline-none"
            />
            {fileUploaded && (
              <div className="text-gray-700 text-lg font-semibold">
                Recovery String: <span className="text-orange-500">{recoveryString}</span>
              </div>)}
            <button
              type="submit"
              className="bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition"
            >
              Upload File to Online Clipboard
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-gray-300 text-center relative">
            <span className="bg-white px-2 text-gray-500 text-sm absolute -top-2.5 left-1/2 transform -translate-x-1/2">
              OR
            </span>
          </div>

          {/* Retrieve File Form */}
          <form onSubmit={submitRecovery} className="flex flex-col space-y-4">
            <div className="text-gray-700 text-lg font-semibold">Retrieve File</div>
            <input
              type="text"
              placeholder="Enter Recovery String"
              value={recoveryString}
              onChange={(e) => setRecoveryString(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-amber-300 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition">
              Retrieve File from Online Clipboard
            </button>
          </form>
        </div>
      )}

      {receivedFile && (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-700 text-xl font-bold">Retrieved File</div>
            <button
              onClick={handleDownload}
              className="bg-amber-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-amber-600 transition"
            >
              Download
            </button>
          </div>
          <div
            className="border border-gray-300 rounded-lg p-4 text-gray-800 text-base font-medium bg-amber-100"
            style={{ whiteSpace: "pre-wrap" }}
          >
            Please Download Your File
          </div>
        </div>
      )}

      <br />
      <button
        onClick={() => navigate("/")}
        className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-900 transition"
      >
        Send Text
      </button>
    </div>
  );
}

export default AddFile;
