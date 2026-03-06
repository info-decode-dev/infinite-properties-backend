import express from "express";
import {
  getAllProperties,
  getAllPropertiesPublic,
  getPropertyById,
  getPropertyByIdPublic,
  createProperty,
  updateProperty,
  deleteProperty,
  getDashboardStats,
} from "../controllers/propertyController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { parseFormData } from "../middleware/parseFormData";
import {
  createPropertyValidator,
  updatePropertyValidator,
} from "../validators/propertyValidator";
import { uploadMultiple } from "../utils/upload";

const router = express.Router();

// Public routes for website (no authentication required)
router.get("/public", getAllPropertiesPublic);
router.get("/public/:id", getPropertyByIdPublic);

// Admin routes (require authentication)
router.get("/stats/dashboard", authenticate, getDashboardStats);

router
  .route("/")
  .get(authenticate, getAllProperties)
  .post(
    authenticate,
    uploadMultiple("images", 10),
    parseFormData,
    validate(createPropertyValidator),
    createProperty
  );

router
  .route("/:id")
  .get(authenticate, getPropertyById)
  .put(
    authenticate,
    uploadMultiple("images", 10),
    parseFormData,
    validate(updatePropertyValidator),
    updateProperty
  )
  .delete(authenticate, deleteProperty);

export default router;

