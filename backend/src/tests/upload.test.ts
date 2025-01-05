import request from "supertest";
import * as fs from "fs";
import path from "path";
import app from "../index";

let server: any;

const validCsvPath = path.join(__dirname, "testfiles", "valid.csv");
const invalidCsvPath = path.join(__dirname, "testfiles", "invalid.csv");
const nonCsvPath = path.join(__dirname, "testfiles", "nonCsv.txt");

beforeAll((done) => {
  // Start the server for tests
  server = app.listen(5001, () => {
    console.log("Test server running on port 5001");
    done();
  });

  // Create the valid CSV file
  if (!fs.existsSync(validCsvPath)) {
    fs.writeFileSync(
      validCsvPath,
      "postId,id,name,email,body\n1,1,John Doe,john@example.com,Hello World"
    );
  }

  // Create the invalid CSV file
  if (!fs.existsSync(invalidCsvPath)) {
    fs.writeFileSync(invalidCsvPath, "wrongHeader1,wrongHeader2\n1,2");
  }

  // Create a non-CSV file
  if (!fs.existsSync(nonCsvPath)) {
    fs.writeFileSync(nonCsvPath, "This is a test file, not a CSV.");
  }
});

afterAll((done) => {
  // Cleanup test files
  if (fs.existsSync(validCsvPath)) {
    fs.unlinkSync(validCsvPath);
  }
  if (fs.existsSync(invalidCsvPath)) {
    fs.unlinkSync(invalidCsvPath);
  }
  if (fs.existsSync(nonCsvPath)) {
    fs.unlinkSync(nonCsvPath);
  }

  // Close the server after tests
  server.close(done);
});

describe("CSV Upload Endpoint", () => {
  it("should successfully upload a valid CSV file", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("file", validCsvPath);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "File uploaded and processed successfully."
    );
    expect(response.body.data).toEqual([
      {
        postId: "1",
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        body: "Hello World",
      },
    ]);
  });

  it("should return an error for invalid headers", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("file", invalidCsvPath);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Invalid CSV headers. Expected headers: postId, id, name, email, body."
    );
  });

  it("should return an error if no file is uploaded", async () => {
    const response = await request(app).post("/upload");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No file uploaded.");
  });

  it("should return an error if a non-CSV file is uploaded", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("file", nonCsvPath);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Invalid file type. Only CSV files are allowed."
    );
  });
});
