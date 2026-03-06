import express from "express";
import {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
  getEnquiryStats,
} from "../controllers/enquiryController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validation";
import {
  createEnquiryValidator,
  updateEnquiryStatusValidator,
} from "../validators/enquiryValidator";

const router = express.Router();

// Public route - users can create enquiries without authentication
router.post("/", validate(createEnquiryValidator), createEnquiry);

// Admin routes - require authentication
router.get("/stats", authenticate, getEnquiryStats);
router.get("/", authenticate, getAllEnquiries);
router.get("/:id", authenticate, getEnquiryById);
router.put("/:id/status", authenticate, validate(updateEnquiryStatusValidator), updateEnquiryStatus);
router.delete("/:id", authenticate, deleteEnquiry);

export default router;

