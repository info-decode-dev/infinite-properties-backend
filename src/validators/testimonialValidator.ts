import { body } from "express-validator";

export const createTestimonialValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters"),
  body("clientName")
    .trim()
    .notEmpty()
    .withMessage("Client name is required"),
  body("description").optional().trim(),
];

export const updateTestimonialValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters"),
  body("clientName").optional().trim().notEmpty().withMessage("Client name cannot be empty"),
];

