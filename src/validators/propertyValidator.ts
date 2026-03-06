import { body } from "express-validator";

export const createPropertyValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 10 })
    .withMessage("Title must be at least 10 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 50 })
    .withMessage("Description must be at least 50 characters"),
  body("actualPrice")
    .isNumeric()
    .withMessage("Actual price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Actual price must be positive"),
  body("offerPrice")
    .optional()
    .isNumeric()
    .withMessage("Offer price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Offer price must be positive"),
  body("location.exactLocation")
    .trim()
    .notEmpty()
    .withMessage("Exact location is required"),
  body("location.city").trim().notEmpty().withMessage("City is required"),
  body("location.state").trim().notEmpty().withMessage("State is required"),
  body("location.country").trim().notEmpty().withMessage("Country is required"),
  body("propertyType")
    .isIn(["Home", "Villa", "Flat", "Apartment", "Plot", "Commercial", "Farmhouse", "Bungalow", "Resort"])
    .withMessage("Invalid property type"),
  // BHK Type - required only for non-Plot properties
  body("bhkType")
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot" || !value || value === "" || value === "undefined") {
        return true; // Allow undefined/null/empty for Plot
      }
      const validTypes = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK", "Studio"];
      if (!validTypes.includes(value)) {
        throw new Error("Invalid BHK type");
      }
      return true;
    })
    .optional({ nullable: true, checkFalsy: true }),
  // Construction Status - required only for non-Plot properties
  body("constructionStatus")
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot" || !value || value === "" || value === "undefined") {
        return true; // Allow undefined/null/empty for Plot
      }
      const validStatuses = ["Ready to Move", "Under Construction", "Pre-Launch"];
      if (!validStatuses.includes(value)) {
        throw new Error("Invalid construction status");
      }
      return true;
    })
    .optional({ nullable: true, checkFalsy: true }),
  body("landArea")
    .isNumeric()
    .withMessage("Land area must be a number")
    .isFloat({ min: 0 })
    .withMessage("Land area must be positive"),
  body("landAreaUnit")
    .isIn(["cent", "acre"])
    .withMessage("Land area unit must be 'cent' or 'acre'"),
  // Built Up Area - required only for non-Plot properties
  body("builtUpArea")
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      // Allow undefined/null/empty for Plot properties
      if (propertyType === "Plot") {
        return true;
      }
      // For non-Plot properties, builtUpArea is required
      if (value === undefined || value === null || value === "" || value === "0" || value === 0) {
        throw new Error("Built up area is required for non-Plot properties");
      }
      // Validate it's a positive number
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        throw new Error("Built up area must be a positive number");
      }
      return true;
    }),
  body("furnishedStatus")
    .optional()
    .isIn(["Furnished", "Semi-Furnished", "Unfurnished"])
    .withMessage("Invalid furnished status"),
  body("negotiation")
    .optional()
    .isIn(["Negotiable", "Slightly Negotiable", "Not Negotiable"])
    .withMessage("Invalid negotiation status"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  // Developer Info - required only for non-Plot properties
  body("developerInfo.name")
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot" || !value || value === "" || value === "undefined" || (typeof value === "string" && value.trim() === "")) {
        return true; // Allow empty/undefined for Plot
      }
      if (!value || (typeof value === "string" && value.trim() === "")) {
        throw new Error("Developer name is required");
      }
      return true;
    })
    .optional({ nullable: true, checkFalsy: true }),
  // Plot-specific fields - required only for Plot properties
  body("landType")
    .custom((value, { req }) => {
      if (req.body.propertyType === "Plot") {
        if (!value) {
          throw new Error("Land type is required for Plot properties");
        }
        const validTypes = ["Residential Land", "Commercial Land", "Resort Land", "Agricultural Land", "Special Purpose Land"];
        if (!validTypes.includes(value)) {
          throw new Error("Invalid land type");
        }
      }
      return true;
    })
    .optional(),
  body("plotSize")
    .custom((value, { req }) => {
      if (req.body.propertyType === "Plot") {
        if (!value) {
          throw new Error("Plot size is required for Plot properties");
        }
        if (isNaN(value) || parseFloat(value) < 0) {
          throw new Error("Plot size must be a positive number");
        }
      }
      return true;
    })
    .optional(),
  body("plotSizeUnit")
    .custom((value, { req }) => {
      if (req.body.propertyType === "Plot") {
        if (!value) {
          throw new Error("Plot size unit is required for Plot properties");
        }
        const validUnits = ["Cent", "Acre", "Square Feet"];
        if (!validUnits.includes(value)) {
          throw new Error("Invalid plot size unit");
        }
      }
      return true;
    })
    .optional(),
  body("ownership")
    .custom((value, { req }) => {
      if (req.body.propertyType === "Plot") {
        if (!value) {
          throw new Error("Ownership is required for Plot properties");
        }
        const validOwnerships = ["Freehold", "Leasehold"];
        if (!validOwnerships.includes(value)) {
          throw new Error("Invalid ownership type");
        }
      }
      return true;
    })
    .optional(),
];

export const updatePropertyValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 10 })
    .withMessage("Title must be at least 10 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ min: 50 })
    .withMessage("Description must be at least 50 characters"),
  body("actualPrice")
    .optional()
    .isNumeric()
    .withMessage("Actual price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Actual price must be positive"),
  body("propertyType")
    .optional()
    .isIn(["Home", "Villa", "Flat", "Apartment", "Plot", "Commercial", "Farmhouse", "Bungalow", "Resort"])
    .withMessage("Invalid property type"),
  // BHK Type - optional, but if provided and propertyType is not Plot, must be valid
  body("bhkType")
    .optional()
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot") {
        return true; // Allow undefined/null for Plot
      }
      if (value) {
        const validTypes = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK", "Studio"];
        if (!validTypes.includes(value)) {
          throw new Error("Invalid BHK type");
        }
      }
      return true;
    }),
  // Construction Status - optional, but if provided and propertyType is not Plot, must be valid
  body("constructionStatus")
    .optional()
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot") {
        return true; // Allow undefined/null for Plot
      }
      if (value) {
        const validStatuses = ["Ready to Move", "Under Construction", "Pre-Launch"];
        if (!validStatuses.includes(value)) {
          throw new Error("Invalid construction status");
        }
      }
      return true;
    }),
  // Built Up Area - optional, but if provided and propertyType is not Plot, must be valid
  body("builtUpArea")
    .optional()
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot") {
        return true; // Allow undefined/null for Plot
      }
      if (value !== undefined && value !== null && value !== "") {
        if (isNaN(value) || parseFloat(value) < 0) {
          throw new Error("Built up area must be a positive number");
        }
      }
      return true;
    }),
  // Developer Info - optional, but if provided and propertyType is not Plot, name must be valid
  body("developerInfo.name")
    .optional()
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot") {
        return true; // Allow empty/undefined for Plot
      }
      if (value !== undefined && value !== null && value !== "" && value.trim() === "") {
        throw new Error("Developer name cannot be empty");
      }
      return true;
    }),
  // Plot-specific fields - optional, but if propertyType is Plot, validate them
  body("landType")
    .optional()
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot" && value) {
        const validTypes = ["Residential Land", "Commercial Land", "Resort Land", "Agricultural Land", "Special Purpose Land"];
        if (!validTypes.includes(value)) {
          throw new Error("Invalid land type");
        }
      }
      return true;
    }),
  body("plotSize")
    .optional()
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot" && value !== undefined && value !== null && value !== "") {
        if (isNaN(value) || parseFloat(value) < 0) {
          throw new Error("Plot size must be a positive number");
        }
      }
      return true;
    }),
  body("plotSizeUnit")
    .optional()
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot" && value) {
        const validUnits = ["Cent", "Acre", "Square Feet"];
        if (!validUnits.includes(value)) {
          throw new Error("Invalid plot size unit");
        }
      }
      return true;
    }),
  body("ownership")
    .optional()
    .custom((value, { req }) => {
      const propertyType = req.body.propertyType;
      if (propertyType === "Plot" && value) {
        const validOwnerships = ["Freehold", "Leasehold"];
        if (!validOwnerships.includes(value)) {
          throw new Error("Invalid ownership type");
        }
      }
      return true;
    }),
];

