import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../config/database";
import { asyncHandler, AppError } from "../middleware/errorHandler";

export const getAllTestimonials = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { search, page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { clientName: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: { propertyMedia: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.testimonial.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: testimonials.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: testimonials,
    });
  }
);

// Public endpoint for website (no authentication required)
export const getAllTestimonialsPublic = asyncHandler(
  async (req: any, res: Response) => {
    const { search, page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { clientName: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: { propertyMedia: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.testimonial.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: testimonials.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: testimonials,
    });
  }
);

export const getTestimonialById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: req.params.id },
      include: { propertyMedia: true },
    });

    if (!testimonial) {
      throw new AppError("Testimonial not found", 404);
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  }
);

export const createTestimonial = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const testimonialData: any = {
      title: req.body.title,
      description: req.body.description,
      clientName: req.body.clientName,
    };

    // Handle profile picture upload
    // When using uploadFields, req.files is an object, not an array
    if (req.files) {
      let profilePictureFile: Express.Multer.File | null = null;
      
      if (Array.isArray(req.files)) {
        // If it's an array (from upload.array)
        profilePictureFile = req.files.find(
          (f: Express.Multer.File) => f.fieldname === "profilePicture"
        ) || null;
      } else {
        // If it's an object (from uploadFields)
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (filesObj["profilePicture"] && filesObj["profilePicture"].length > 0) {
          profilePictureFile = filesObj["profilePicture"][0];
        }
      }
      
      if (profilePictureFile) {
        testimonialData.profilePicture = `/uploads/profiles/${profilePictureFile.filename}`;
      }
    }

    // Handle property media upload
    let mediaData = null;
    if (req.files) {
      let mediaFile: Express.Multer.File | null = null;
      
      if (Array.isArray(req.files)) {
        // If it's an array (from upload.array)
        mediaFile = req.files.find(
          (f: Express.Multer.File) => f.fieldname === "media"
        ) || null;
      } else {
        // If it's an object (from uploadFields)
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (filesObj["media"] && filesObj["media"].length > 0) {
          mediaFile = filesObj["media"][0];
        }
      }
      
      if (mediaFile) {
        const isVideo = mediaFile.mimetype.startsWith("video/");
        mediaData = {
          type: isVideo ? "video" : "image",
          url: `/uploads/${isVideo ? "videos" : "images"}/${mediaFile.filename}`,
        };
      }
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        ...testimonialData,
        propertyMedia: mediaData
          ? {
              create: mediaData,
            }
          : undefined,
      },
      include: { propertyMedia: true },
    });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  }
);

export const updateTestimonial = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    let testimonial = await prisma.testimonial.findUnique({
      where: { id: req.params.id },
      include: { propertyMedia: true },
    });

    if (!testimonial) {
      throw new AppError("Testimonial not found", 404);
    }

    const updateData: any = {
      title: req.body.title,
      description: req.body.description,
      clientName: req.body.clientName,
    };

    // Handle profile picture upload
    // When using uploadFields, req.files is an object, not an array
    if (req.files) {
      let profilePictureFile: Express.Multer.File | null = null;
      
      if (Array.isArray(req.files)) {
        // If it's an array (from upload.array)
        profilePictureFile = req.files.find(
          (f: Express.Multer.File) => f.fieldname === "profilePicture"
        ) || null;
      } else {
        // If it's an object (from uploadFields)
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (filesObj["profilePicture"] && filesObj["profilePicture"].length > 0) {
          profilePictureFile = filesObj["profilePicture"][0];
        }
      }
      
      if (profilePictureFile) {
        updateData.profilePicture = `/uploads/profiles/${profilePictureFile.filename}`;
      }
    }

    // Handle property media upload
    if (req.files) {
      let mediaFile: Express.Multer.File | null = null;
      
      if (Array.isArray(req.files)) {
        // If it's an array (from upload.array)
        mediaFile = req.files.find(
          (f: Express.Multer.File) => f.fieldname === "media"
        ) || null;
      } else {
        // If it's an object (from uploadFields)
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (filesObj["media"] && filesObj["media"].length > 0) {
          mediaFile = filesObj["media"][0];
        }
      }
      
      if (mediaFile) {
        const isVideo = mediaFile.mimetype.startsWith("video/");
        const mediaData = {
          type: isVideo ? "video" : "image",
          url: `/uploads/${isVideo ? "videos" : "images"}/${mediaFile.filename}`,
        };

        // Delete existing media if exists
        if (testimonial.propertyMedia) {
          await prisma.propertyMedia.delete({
            where: { id: testimonial.propertyMedia.id },
          });
        }

        // Create new media
        updateData.propertyMedia = {
          create: mediaData,
        };
      }
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: updateData,
      include: { propertyMedia: true },
    });

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    });
  }
);

export const deleteTestimonial = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: req.params.id },
    });

    if (!testimonial) {
      throw new AppError("Testimonial not found", 404);
    }

    await prisma.testimonial.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  }
);
