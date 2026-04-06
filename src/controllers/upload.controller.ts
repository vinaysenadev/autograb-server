import { Request, Response, NextFunction } from "express";
import { UploadBody } from "../types/upload.types";
import { validateUploadBody } from "../validators/upload.validator";

const badRequest = (res: Response, error: string) => {
  res.status(400).json({ success: false, error });
};

export const uploadLogbook = (req: Request<{}, {}, UploadBody>, res: Response, next: NextFunction) => {
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
