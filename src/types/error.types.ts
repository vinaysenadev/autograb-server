export interface PayloadTooLargeError extends Error {
  type: string;
  limit: number;
  length?: number;
  received?: number;
  expected?: number;
}

export const isPayloadTooLargeError = (err: unknown): err is PayloadTooLargeError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    (err as Record<string, unknown>).type === "entity.too.large" &&
    "limit" in err &&
    typeof (err as Record<string, unknown>).limit === "number"
  );
};

export interface CustomSyntaxError extends SyntaxError {
  status: number;
  body: unknown;
}

export const isSyntaxErrorWithStatus = (err: unknown): err is CustomSyntaxError => {
  return (
    err instanceof SyntaxError &&
    "status" in err &&
    typeof (err as Record<string, unknown>).status === "number" &&
    "body" in err
  );
};
