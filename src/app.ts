import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/upload", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
