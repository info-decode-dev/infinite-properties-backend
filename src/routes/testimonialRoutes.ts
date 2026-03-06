import express from "express";
import {
  getAllTestimonials,
  getAllTestimonialsPublic,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController";
import { authenticate } from "../middleware/auth";
import {
  createTestimonialValidator,
  updateTestimonialValidator,
} from "../validators/testimonialValidator";
import { uploadFields } from "../utils/upload";
import { validate } from "../middleware/validation";

const router = express.Router();

// Public route for website (no authentication required)
router.get("/public", getAllTestimonialsPublic);

router
  .route("/")
  .get(authenticate, getAllTestimonials)
  .post(
    authenticate,
    uploadFields([
      { name: "profilePicture", maxCount: 1 },
      { name: "media", maxCount: 1 },
    ]),
    validate(createTestimonialValidator),
    createTestimonial
  );

router
  .route("/:id")
  .get(authenticate, getTestimonialById)
  .put(
    authenticate,
    uploadFields([
      { name: "profilePicture", maxCount: 1 },
      { name: "media", maxCount: 1 },
    ]),
    validate(updateTestimonialValidator),
    updateTestimonial
  )
  .delete(authenticate, deleteTestimonial);

export default router;

