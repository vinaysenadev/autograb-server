import { UploadBody } from "../types/upload.types";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const validateUploadBody = ({
  make,
  model,
  badge,
  fileContent,
}: UploadBody): string | null => {
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
