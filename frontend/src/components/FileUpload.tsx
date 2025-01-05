import React, { useState } from "react";
import axios from "axios";

interface FileUploadProps {
  onUploadSuccess: (data: any[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (!file) {
      return;
    }

    if (file.type !== "text/csv") {
      alert("Invalid file type. Please upload a CSV file.");
      return;
    }

    setIsUploading(true); // Show loading state

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("File uploaded successfully!");
      onUploadSuccess(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check if it's an Axios error
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert("Failed to upload the file. Please try again.");
        }
      } else if (error instanceof Error) {
        // Generic JavaScript error
        alert(`Error: ${error.message}`);
      } else {
        // Unknown error
        alert("An unexpected error occurred.");
      }
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
        Upload CSV
      </h2>

      <label
        htmlFor="file-upload"
        className={`block w-full text-center py-2 px-4 rounded-lg cursor-pointer ${
          isUploading
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } transition`}
      >
        {isUploading ? "Uploading..." : "Upload File"}
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default FileUpload;
