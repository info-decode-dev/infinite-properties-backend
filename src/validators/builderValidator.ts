import { body } from "express-validator";

export const createBuilderValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Builder name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Builder name must be between 2 and 200 characters"),
  
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  
  body("phone")
    .optional()
    .custom((value) => {
      if (!value || value.trim() === "") return true;
      // Remove +91 and spaces for validation
      const cleaned = value.replace(/^\+91\s*/, "").trim();
      // Indian phone number validation (10 digits)
      const phoneRegex = /^[6-9]\d{9}$/;
      return phoneRegex.test(cleaned);
    })
    .withMessage("Please provide a valid 10-digit Indian phone number"),
  
  body("website")
    .optional()
    .isURL()
    .withMessage("Please provide a valid website URL"),
  
  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description must not exceed 2000 characters"),
];

export const updateBuilderValidator = createBuilderValidator;
