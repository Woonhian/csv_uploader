import React, { useState, useEffect } from "react";

type RowData = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

interface DataTableProps {
  uploadedData: RowData[];
}

const DataTable: React.FC<DataTableProps> = ({ uploadedData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<RowData[]>([]);
  const [paginatedData, setPaginatedData] = useState<RowData[]>([]);

  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  // Filter the data based on the search query
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = uploadedData.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowercasedQuery)
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  }, [searchQuery, uploadedData]);

  // Update paginated data when current page or filtered data changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * dataPerPage;
    const endIndex = startIndex + dataPerPage;
    setPaginatedData(filteredData.slice(startIndex, endIndex));
  }, [currentPage, filteredData]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
              Post ID
            </th>
            <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
              ID
            </th>
            <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
              Body
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                {row.postId}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                {row.id}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                {row.name}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                {row.email}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                {row.body}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-wrap justify-between items-center py-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
