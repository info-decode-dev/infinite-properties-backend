import { Request, Response, NextFunction } from "express";

/**
 * Middleware to parse JSON strings from FormData before validation
 * This allows express-validator to work with nested objects sent as JSON strings
 */
export const parseFormData = (req: Request, res: Response, next: NextFunction) => {
  // Parse JSON strings if they exist
  if (typeof req.body.location === 'string') {
    try {
      req.body.location = JSON.parse(req.body.location);
    } catch (e) {
      // If parsing fails, keep as string (will be caught by validator)
    }
  }

  if (typeof req.body.developerInfo === 'string') {
    try {
      req.body.developerInfo = JSON.parse(req.body.developerInfo);
    } catch (e) {
      // If parsing fails, keep as string (will be caught by validator)
    }
  }

  if (typeof req.body.tags === 'string') {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (e) {
      // If parsing fails, keep as string (will be caught by validator)
    }
  }

  if (typeof req.body.amenities === 'string') {
    try {
      req.body.amenities = JSON.parse(req.body.amenities);
    } catch (e) {
      // If parsing fails, keep as string (will be caught by validator)
    }
  }

  if (typeof req.body.accessibility === 'string') {
    try {
      req.body.accessibility = JSON.parse(req.body.accessibility);
    } catch (e) {
      // If parsing fails, keep as string (will be caught by validator)
    }
  }

  if (typeof req.body.nearbyLandmarks === 'string') {
    try {
      req.body.nearbyLandmarks = JSON.parse(req.body.nearbyLandmarks);
    } catch (e) {
      // If parsing fails, keep as string (will be caught by validator)
    }
  }

  next();
};

