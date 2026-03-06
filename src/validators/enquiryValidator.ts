import { body } from "express-validator";

export const createEnquiryValidator = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("userEmail")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("userPhone")
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage("Please provide a valid phone number"),
  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Message must not exceed 1000 characters"),
  body("propertyId")
    .trim()
    .notEmpty()
    .withMessage("Property ID is required")
    .isString()
    .withMessage("Property ID must be a string"),
];

export const updateEnquiryStatusValidator = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "contacted", "closed"])
    .withMessage("Status must be one of: pending, contacted, closed"),
];

