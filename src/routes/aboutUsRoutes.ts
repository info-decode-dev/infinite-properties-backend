import express from "express";
import {
  getAboutUs,
  getPublicAboutUs,
  createOrUpdateAboutUs,
  deleteAboutUs,
} from "../controllers/aboutUsController";
import { authenticate } from "../middleware/auth";
import { uploadFields } from "../utils/upload";

const router = express.Router();

// Public route for website (no authentication)
router.get("/public", getPublicAboutUs);

// Admin routes (require authentication)
router
  .route("/")
  .get(authenticate, getAboutUs)
  .post(
    authenticate,
    uploadFields([
      { name: "images", maxCount: 20 },
      { name: "teamMemberImage_0", maxCount: 1 },
      { name: "teamMemberImage_1", maxCount: 1 },
      { name: "teamMemberImage_2", maxCount: 1 },
      { name: "teamMemberImage_3", maxCount: 1 },
      { name: "teamMemberImage_4", maxCount: 1 },
      { name: "teamMemberImage_5", maxCount: 1 },
      { name: "teamMemberImage_6", maxCount: 1 },
      { name: "teamMemberImage_7", maxCount: 1 },
      { name: "teamMemberImage_8", maxCount: 1 },
      { name: "teamMemberImage_9", maxCount: 1 },
    ]),
    createOrUpdateAboutUs
  )
  .put(
    authenticate,
    uploadFields([
      { name: "images", maxCount: 20 },
      { name: "teamMemberImage_0", maxCount: 1 },
      { name: "teamMemberImage_1", maxCount: 1 },
      { name: "teamMemberImage_2", maxCount: 1 },
      { name: "teamMemberImage_3", maxCount: 1 },
      { name: "teamMemberImage_4", maxCount: 1 },
      { name: "teamMemberImage_5", maxCount: 1 },
      { name: "teamMemberImage_6", maxCount: 1 },
      { name: "teamMemberImage_7", maxCount: 1 },
      { name: "teamMemberImage_8", maxCount: 1 },
      { name: "teamMemberImage_9", maxCount: 1 },
    ]),
    createOrUpdateAboutUs
  )
  .delete(authenticate, deleteAboutUs);

export default router;

