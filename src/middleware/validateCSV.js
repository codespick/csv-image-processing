const csv = require("csv-parser");
const { Readable } = require("stream");

const validateCSV = (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ error: "CSV file is required" });
  }

  const results = [];
  const stream = Readable.from(req?.file?.buffer);

  stream
    .pipe(csv())
    .on("data", (row) => {
      if (!row["S. No."] || !row["Product Name"] || !row["Input Image Urls"]) {
        stream.destroy(new Error("Invalid CSV format"));
        return;
      }
      results.push({
        serialNumber: parseInt(row["S. No."]),
        productName: row["Product Name"],
        inputImageUrls: row["Input Image Urls"]
          .split(",")
          .map((url) => url.trim()),
      });
    })
    .on("end", () => {
      req.parsedCSV = results;
      next();
    })
    .on("error", (error) => {
      res.status(400).json({ error: error.message });
    });
};

module.exports = validateCSV;
