import { Request, Response, NextFunction } from "express";
import { isPayloadTooLargeError, isSyntaxErrorWithStatus } from "../types/error.types";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (isPayloadTooLargeError(err)) {
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

  if (isSyntaxErrorWithStatus(err) && err.status === 400) {
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
