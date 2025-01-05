import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

export type DataRow = {
  postId: string;
  id: string;
  name: string;
  email: string;
  body: string;
};

// Shared in-memory data store
export let uploadedData: DataRow[] = [];

router.post("/", upload.single("file"), (req: Request, res: Response): void => {
  const file = req.file;

  // If no file
  if (!file) {
    res.status(400).json({ error: "No file uploaded." });
    return;
  }

  // Validate file type
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (fileExtension !== ".csv") {
    fs.unlinkSync(file.path);
    res
      .status(400)
      .json({ error: "Invalid file type. Only CSV files are allowed." });
    return;
  }

  const filePath = path.resolve(file.path);
  const results: DataRow[] = [];
  const expectedHeaders = ["postId", "id", "name", "email", "body"];

  let headersValidated = false;

  fs.createReadStream(filePath)
    .pipe(
      csv({
        mapHeaders: ({ header }: { header: string }) =>
          header.trim().toLowerCase(), // Normalize headers
      })
    )
    .on("headers", (headers: string[]) => {
      const normalizedHeaders = headers.map((header) =>
        header.trim().replace(/^"|"$/g, "").toLowerCase()
      );
      const normalizedExpectedHeaders = expectedHeaders.map((header) =>
        header.trim().toLowerCase()
      );

      if (
        JSON.stringify(normalizedHeaders) !==
        JSON.stringify(normalizedExpectedHeaders)
      ) {
        fs.unlinkSync(filePath);
        return res.status(400).json({
          error:
            "Invalid CSV headers. Expected headers: postId, id, name, email, body.",
        });
      }
      headersValidated = true; // Mark headers as valid
    })
    .on("data", (data) => {
      if (headersValidated) {
        // Remove quotes and ensure values are strings
        const normalizedData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key.trim().replace(/^"|"$/g, "").toLowerCase(),
            String(value),
          ])
        );

        const mappedData: DataRow = {
          postId: normalizedData.postid,
          id: normalizedData.id,
          name: normalizedData.name,
          email: normalizedData.email,
          body: normalizedData.body,
        };

        results.push(mappedData);
      }
    })
    .on("end", () => {
      if (!headersValidated) return;
      fs.unlinkSync(filePath);
      uploadedData = results;
      res.status(200).json({
        message: "File uploaded and processed successfully.",
        data: results,
      });
    })
    .on("error", (error) => {
      res.status(500).json({
        error: "Error processing file.",
        details: error.message,
      });
    });
});

export default router;
