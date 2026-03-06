import multer from "multer";
import path from "path";
import fs from "fs";
import { supabase } from "../config/supabase";

const uploadDir = process.env.UPLOAD_DIR || "./public/uploads";
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "104857600"); // 100MB default (increased for videos)

// Check if Supabase is configured
const useSupabaseStorage = !!supabase;

// Only create local directories if not using Supabase Storage
if (!useSupabaseStorage) {
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create subdirectories
  const subDirs = ["images", "videos", "logos", "profiles"];
  subDirs.forEach((dir) => {
    const dirPath = path.join(uploadDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

// Use memory storage for Supabase (files will be uploaded directly)
// Use disk storage for local file system
const storage = useSupabaseStorage
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        let uploadPath = uploadDir;
        
        if (file.fieldname === "images" || file.fieldname === "image" || file.fieldname.startsWith("teamMemberImage_")) {
          uploadPath = path.join(uploadDir, "images");
        } else if (file.fieldname === "video" || file.fieldname === "media" || (file.fieldname === "gallery" && file.mimetype.startsWith("video/"))) {
          uploadPath = path.join(uploadDir, "videos");
        } else if (file.fieldname === "gallery") {
          uploadPath = path.join(uploadDir, "images");
        } else if (file.fieldname === "logo" || file.fieldname === "logos") {
          uploadPath = path.join(uploadDir, "logos");
        } else if (file.fieldname === "profilePicture") {
          uploadPath = path.join(uploadDir, "profiles");
        }
        
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
      },
    });

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|mov|avi|wmv|flv|webm/;
  const ext = path.extname(file.originalname).toLowerCase();

  // Check if it's a video field
  if (file.fieldname === "video" || (file.fieldname === "media" && file.mimetype.startsWith("video/")) || (file.fieldname === "gallery" && file.mimetype.startsWith("video/"))) {
    if (allowedVideoTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  } else {
    // For all other fields (including gallery images), allow images
    if (allowedImageTypes.test(ext) || file.fieldname === "gallery") {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter,
});

export const uploadMultiple = (fieldName: string, maxCount: number = 10) => {
  return upload.array(fieldName, maxCount);
};

export const uploadSingle = (fieldName: string) => {
  return upload.single(fieldName);
};

export const uploadFields = (fields: multer.Field[]) => {
  return upload.fields(fields);
};

