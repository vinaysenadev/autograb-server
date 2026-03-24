const express = require("express");
const cors = require("cors");

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const badRequest = (res, error) =>
  res.status(400).json({ success: false, error });

const validateUploadBody = ({ make, model, badge, fileContent }) => {
  if (
    !isNonEmptyString(make) ||
    !isNonEmptyString(model) ||
    !isNonEmptyString(badge)
  ) {
    return "Vehicle details missing.";
  }

  if (fileContent == null || fileContent === "") {
    return "File not uploaded.";
  }

  if (typeof fileContent !== "string") {
    return "Only txt files are accepted.";
  }

  if (Buffer.byteLength(fileContent, "utf8") > MAX_FILE_SIZE_BYTES) {
    return "File size exceeds the 5MB limit.";
  }

  return null;
};

const uploadLogbook = (req, res, next) => {
  try {
    const { make, model, badge, fileContent } = req.body;
    const validationError = validateUploadBody(req.body);

    if (validationError) {
      return badRequest(res, validationError);
    }

    return res.status(200).json({
      success: true,
      vehicle: { make: make.trim(), model: model.trim(), badge: badge.trim() },
      logbook: fileContent,
    });
  } catch (error) {
    next(error);
  }
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
  });
};

const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.too.large") {
    const limitMb = Math.round(err.limit / 1024 / 1024);
    const actualMb = (
      (err.length || err.received || err.expected || 0) /
      1024 /
      1024
    ).toFixed(2);

    return res.status(413).json({
      success: false,
      error: `File size of ${actualMb}MB exceeds the ${limitMb}MB limit`,
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON payload",
    });
  }

  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
};

app.post("/upload", uploadLogbook);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
