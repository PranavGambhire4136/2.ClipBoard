import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Send, Upload, Key, Clipboard, Copy, File } from 'react-feather';

function AddString() {
        const [text, setText] = useState("");
    const [customCode, setCustomCode] = useState("");
    const [code, setCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [retrievedText, setRetrievedText] = useState("");
    const [showRetrieved, setShowRetrieved] = useState(false);

    const navigate = useNavigate();

    const handleSend = (e) => {
        e.preventDefault();
        console.log("checking handle send");
        if (!text.trim()) {
            toast.error("Please enter some text.");
            return;
        }
        const toastId = toast.loading("Generating code...");
                axios.post("https://two-clipboard.onrender.com/api/v1/uploadString", { string: text, recoveryString: customCode })
            .then(response => {
                setGeneratedCode(response.data.recoveryString);
                toast.success("Code generated successfully!");
                toast.dismiss(toastId);
            })
            .catch(error => {
                toast.error(error.response?.data?.message || "Failed to generate code.");
                toast.dismiss(toastId);
                console.log(error);
            });
    };

    const handleRetrieve = (e) => {
        e.preventDefault();
        if (!code.trim()) {
            toast.error("Please enter a recovery code.");
            return;
        }
        const toastId = toast.loading("Retrieving text...");
        axios.get("https://two-clipboard.onrender.com/api/v1/receiveString", { params: { RecoveryString: code } })
            .then(response => {
                setRetrievedText(response.data.string || "No text found for this code.");
                setShowRetrieved(true);
                toast.success("Text retrieved!");
                toast.dismiss(toastId);
            })
            .catch(error => {
                toast.error(error.response?.data?.message || "Failed to retrieve text.");
                console.log(error);
                toast.dismiss(toastId);
            });
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
                    <h1>OnlineClipboard</h1>
                    <p>Send text or files and receive a 4-digit code to retrieve them anywhere.</p>
                </header>

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 w-full max-w-md mx-auto flex flex-col items-center">
                    <h2><Send size={24} /> Send Text</h2>
                    <form onSubmit={handleSend} className="flex flex-col gap-4 w-full">
                                            <textarea
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[100px] resize-y"
                            placeholder="Paste your content here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            placeholder="Optional: Enter custom 4-digit code"
                            value={customCode}
                            onChange={(e) => setCustomCode(e.target.value)}
                            maxLength="4"
                        />
                        <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full">
                            <Upload size={18} /> Generate Code
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
                    <h2 className="text-2xl font-bold mb-4"><Key size={24} /> Retrieve Text</h2>
                    <form onSubmit={handleRetrieve} className="flex flex-col gap-4 w-full">
                        <input
                            type="text"
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
                            placeholder="Enter 4-digit code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength="4"
                            required
                        />
                        <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full">
                            <Clipboard size={18} /> Retrieve
                        </button>
                    </form>
                    {showRetrieved && (
                        <div className="bg-teal-50 rounded-lg p-4 mt-4 flex flex-col items-center w-full">
                            <div className="flex items-center justify-between w-full mb-2">
                                <h3 className="text-lg font-bold">Retrieved Content:</h3>
                                <button onClick={() => copyToClipboard(retrievedText)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-md flex items-center gap-2 transition-colors"><Copy size={16}/> Copy</button>
                            </div>
                            <div className="text-base font-mono bg-gray-100 rounded px-4 py-2 mt-2 text-center">{retrievedText}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
}

export default AddString;
