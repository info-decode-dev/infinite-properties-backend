import { body } from "express-validator";

export const createCollectionValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
];

export const createReelValidator = [
  body("link")
    .isURL()
    .withMessage("Link must be a valid URL")
    .trim(),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  body("description").optional().trim(),
  body("actionButtonLink")
    .trim()
    .notEmpty()
    .withMessage("Action button link is required")
    .custom((value) => {
      // Allow both URLs and relative paths
      if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
        return true;
      }
      throw new Error("Action button link must be a valid URL or relative path");
    }),
];

export const createFeaturedPropertyValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  body("description").optional().trim(),
  body("clientLogos")
    .optional()
    .isArray()
    .withMessage("Client logos must be an array"),
];

