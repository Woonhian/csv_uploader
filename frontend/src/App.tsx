import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";

const App: React.FC = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const handleUploadSuccess = (data: any[]) => {
    setUploadedData(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      {uploadedData.length > 0 && (
        <div className="w-full mt-8">
          <DataTable uploadedData={uploadedData} />
        </div>
      )}
    </div>
  );
};

export default App;
