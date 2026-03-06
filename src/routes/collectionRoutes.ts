import express from "express";
import {
  getAllCollections,
  getAllCollectionsPublic,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  getAllReels,
  getAllReelsPublic,
  getReelById,
  createReel,
  updateReel,
  deleteReel,
  getAllFeaturedProperties,
  createFeaturedProperty,
  updateFeaturedProperty,
  deleteFeaturedProperty,
} from "../controllers/collectionController";
import {
  getAllBuilders,
  getBuilderById,
  createBuilder,
  updateBuilder,
  deleteBuilder,
} from "../controllers/builderController";
import { authenticate } from "../middleware/auth";
import {
  createCollectionValidator,
  createReelValidator,
  createFeaturedPropertyValidator,
} from "../validators/collectionValidator";
import {
  createBuilderValidator,
  updateBuilderValidator,
} from "../validators/builderValidator";
import { uploadSingle, uploadFields } from "../utils/upload";
import { validate } from "../middleware/validation";

const router = express.Router();

// Public routes for website (no authentication required)
router.get("/collections/public", getAllCollectionsPublic);
router.get("/reels/public", getAllReelsPublic);

// Curated Collections
router
  .route("/collections")
  .get(authenticate, getAllCollections)
  .post(
    authenticate,
    uploadSingle("image"),
    validate(createCollectionValidator),
    createCollection
  );

router
  .route("/collections/:id")
  .get(authenticate, getCollectionById)
  .put(
    authenticate,
    uploadSingle("image"),
    validate(createCollectionValidator),
    updateCollection
  )
  .delete(authenticate, deleteCollection);

// Reels (admin routes)
router
  .route("/reels")
  .get(authenticate, getAllReels)
  .post(authenticate, validate(createReelValidator), createReel);

router
  .route("/reels/:id")
  .get(authenticate, getReelById)
  .put(authenticate, validate(createReelValidator), updateReel)
  .delete(authenticate, deleteReel);

// Featured Properties
router
  .route("/featured")
  .get(authenticate, getAllFeaturedProperties)
  .post(
    authenticate,
    uploadFields([
      { name: "gallery", maxCount: 5 },
      { name: "logos", maxCount: 10 },
    ]),
    validate(createFeaturedPropertyValidator),
    createFeaturedProperty
  );

router
  .route("/featured/:id")
  .put(
    authenticate,
    uploadFields([
      { name: "gallery", maxCount: 5 },
      { name: "logos", maxCount: 10 },
    ]),
    validate(createFeaturedPropertyValidator),
    updateFeaturedProperty
  )
  .delete(authenticate, deleteFeaturedProperty);

// Builders
router
  .route("/builders")
  .get(authenticate, getAllBuilders)
  .post(
    authenticate,
    uploadSingle("profilePicture"),
    validate(createBuilderValidator),
    createBuilder
  );

router
  .route("/builders/:id")
  .get(authenticate, getBuilderById)
  .put(
    authenticate,
    uploadSingle("profilePicture"),
    validate(updateBuilderValidator),
    updateBuilder
  )
  .delete(authenticate, deleteBuilder);

export default router;

