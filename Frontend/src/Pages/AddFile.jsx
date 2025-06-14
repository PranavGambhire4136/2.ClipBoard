import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UploadCloud, File, Key, Download, Copy, Send, FileText } from 'react-feather';

function AddFile() {
    const [file, setFile] = useState(null);
    const [customCode, setCustomCode] = useState("");
    const [code, setCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [retrievedFileData, setRetrievedFileData] = useState(null);
    const fileInputRef = useRef(null);


    const handleFileSelect = (selectedFile) => {
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleDragDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove(styles.dragover);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }
        const formData = new FormData();
                formData.append('file', file);
        if (customCode) {
            formData.append('recoveryString', customCode);
        }

        const toastId = toast.loading("Uploading file...");
        axios.post("https://two-clipboard.onrender.com/api/v1/uploadFile", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(response => {
            setGeneratedCode(response.data.data.recoveryString);
            toast.success("File uploaded successfully!");
            toast.dismiss(toastId);
        })
        .catch(error => {
            toast.error(error.response?.data?.message || "Failed to upload file.");
            toast.dismiss(toastId);
        });
    };

    const handleRetrieve = (e) => {
        e.preventDefault();
        if (!code.trim()) {
            toast.error("Please enter a recovery code.");
            return;
        }
        const toastId = toast.loading("Retrieving file...");
        axios.get("https://two-clipboard.onrender.com/api/v1/receiveFile", { params: { RecoveryString: code } })
        .then(response => {
            setRetrievedFileData(response.data.file);
            toast.success("File ready for download!");
            toast.dismiss(toastId);
        })
        .catch(error => {
            toast.error(error.response?.data?.message || "Failed to retrieve file.");
            toast.dismiss(toastId);
        });
    };

    const handleDownload = async () => {
        if (!retrievedFileData?.location || !retrievedFileData?.filename) {
            toast.error("File data is missing.");
            return;
        }
        try {
            const response = await fetch(retrievedFileData.location);
            if (!response.ok) throw new Error('Network response was not ok.');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = retrievedFileData.filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Download started!");
        } catch (error) {
            toast.error("Failed to download the file.");
        }
    };
    
    const copyToClipboard = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => toast.success("Copied to clipboard!"))
            .catch(() => toast.error("Failed to copy."));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full flex-1">
            <div className="flex justify-center w-full">
                <div className="w-full max-w-md">
            <header className="text-center mb-6">
                <h1>Add a File</h1>
                <p>Upload your file and get a 4-digit code to share.</p>
            </header>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 w-full max-w-md mx-auto flex flex-col items-center">
                <h2><UploadCloud size={24} /> Upload File</h2>
                <form onSubmit={handleUpload} className="flex flex-col gap-4 w-full">
                    <div 
                        className="flex flex-col items-center justify-center border-2 border-dashed border-teal-500 rounded-lg p-6 cursor-pointer hover:bg-teal-50 transition-colors"
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add(styles.dragover); }}
                        onDragLeave={(e) => e.currentTarget.classList.remove(styles.dragover)}
                        onDrop={handleDragDrop}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            hidden
                        />
                        <File size={48} color="var(--primary-color)" />
                        <p>Drag & drop your file here or <span style={{color: 'var(--primary-color)', fontWeight: '600'}}>browse</span></p>
                    </div>
                                        {file && <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>}
                    <input
                        type="text"
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        placeholder="Optional: Enter custom 4-digit code"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        maxLength="4"
                    />
                    <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!file}>
                        <Send size={18} /> Generate Code
                    </button>
                </form>
                {generatedCode && (
                    <div className="bg-teal-50 rounded-lg p-4 mt-4 flex flex-col items-center w-full">
                        <div className="flex items-center justify-between w-full mb-2">
                            <h3 className="text-lg font-bold">Your Code:</h3>
                            <button onClick={() => copyToClipboard(generatedCode)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-md flex items-center gap-2 transition-colors"><Copy size={16}/> Copy</button>
                        </div>
                        <div className="text-2xl font-mono font-bold bg-gray-100 rounded px-4 py-2 mt-2 text-center tracking-widest">{generatedCode}</div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 w-full max-w-md mx-auto flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4"><Key size={24} /> Retrieve File</h2>
                <form onSubmit={handleRetrieve} className="flex flex-col gap-4 w-full">
                    <input
                        type="text"
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        placeholder="Enter 4-digit code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength="4"
                        required
                    />
                    <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Download size={18} /> Retrieve
                    </button>
                </form>
                {retrievedFileData && (
                    <div className="bg-teal-50 rounded-lg p-4 mt-4 flex flex-col items-center w-full">
                        <div className="flex flex-col items-center gap-2">
                            <FileText size={40} />
                            <p className="text-lg font-bold">{retrievedFileData.filename}</p>
                            <button onClick={handleDownload} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <Download size={18} /> Download File
                            </button>
                        </div>
                    </div>
                )}
            </div>


                </div>
            </div>
        </div>
    );
}

export default AddFile;
