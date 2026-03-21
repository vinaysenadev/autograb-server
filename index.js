const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// upload api
app.post("/upload", (req, res, next) => {
  try {
    const { make, model, badge, fileContent } = req.body;

    if (!make || !model || !badge) {
      return res.status(400).json({
        success: false,
        error: "Vechile details missing.",
      });
    }

    if (!fileContent) {
      return res.status(400).json({
        success: false,
        error: "file not uploaded",
      });
    }

    if (typeof fileContent !== "string") {
      return res.status(400).json({
        success: false,
        error: "only txt files are accepted",
      });
    }

    return res.status(200).json({
      success: true,
      vehicle: { make, model, badge },
      logbook: fileContent,
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "not founc",
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
