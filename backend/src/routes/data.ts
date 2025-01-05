import express, { Request, Response } from "express";
import { uploadedData } from "./upload";

const router = express.Router();

// Search Endpoint
router.get("/", (req: Request, res: Response) => {
  const { search } = req.query;

  if (!uploadedData || !Array.isArray(uploadedData)) {
    res.status(500).json({ error: "No data available to search." });
    return;
  }

  if (!search) {
    res.status(400).json({ error: "Search query is required." });
    return;
  }

  const searchQuery = (search as string).toLowerCase();
  const results = uploadedData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery)
    )
  );

  res.status(200).json({ data: results });
});

// Pagination Endpoint
router.get("/all", (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  if (!uploadedData || !Array.isArray(uploadedData)) {
    res.status(500).json({ error: "No data available." });
    return;
  }

  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);

  if (
    isNaN(pageNumber) ||
    isNaN(pageSize) ||
    pageNumber <= 0 ||
    pageSize <= 0
  ) {
    res.status(400).json({ error: "Invalid pagination parameters." });
    return;
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = uploadedData.slice(startIndex, endIndex);

  res.status(200).json({
    page: pageNumber,
    limit: pageSize,
    total: uploadedData.length,
    data: paginatedData,
  });
});

export default router;
