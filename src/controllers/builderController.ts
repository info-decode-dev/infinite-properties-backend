import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../config/database";
import { asyncHandler, AppError } from "../middleware/errorHandler";

// Get all builders
export const getAllBuilders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { search, page = 1, limit = 50 } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [builders, total] = await Promise.all([
      prisma.builder.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.builder.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: builders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: builders,
    });
  }
);

// Get builder by ID
export const getBuilderById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const builder = await prisma.builder.findUnique({
      where: { id: req.params.id },
    });

    if (!builder) {
      throw new AppError("Builder not found", 404);
    }

    res.status(200).json({
      success: true,
      data: builder,
    });
  }
);

// Create builder
export const createBuilder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, email, phone, website, description } = req.body;

    // Handle profile picture upload
    let profilePicture: string | null = null;
    if (req.file) {
      profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    // Format phone number with +91 if provided
    let formattedPhone = phone;
    if (phone && phone.trim()) {
      // Remove any existing country code
      const cleanedPhone = phone.replace(/^\+91\s*/, "").trim();
      formattedPhone = `+91 ${cleanedPhone}`;
    }

    const builder = await prisma.builder.create({
      data: {
        name,
        email: email || null,
        phone: formattedPhone || null,
        website: website || null,
        description: description || null,
        profilePicture,
      },
    });

    res.status(201).json({
      success: true,
      message: "Builder created successfully",
      data: builder,
    });
  }
);

// Update builder
export const updateBuilder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const builder = await prisma.builder.findUnique({
      where: { id: req.params.id },
    });

    if (!builder) {
      throw new AppError("Builder not found", 404);
    }

    const { name, email, phone, website, description } = req.body;

    // Handle profile picture update
    let profilePicture = builder.profilePicture;
    if (req.file) {
      profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    // Format phone number with +91 if provided
    let formattedPhone = phone;
    if (phone && phone.trim()) {
      // Remove any existing country code
      const cleanedPhone = phone.replace(/^\+91\s*/, "").trim();
      formattedPhone = `+91 ${cleanedPhone}`;
    } else if (phone === "" || phone === null) {
      formattedPhone = null;
    }

    const updatedBuilder = await prisma.builder.update({
      where: { id: req.params.id },
      data: {
        name,
        email: email || null,
        phone: formattedPhone || null,
        website: website || null,
        description: description || null,
        profilePicture,
      },
    });

    res.status(200).json({
      success: true,
      message: "Builder updated successfully",
      data: updatedBuilder,
    });
  }
);

// Delete builder
export const deleteBuilder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const builder = await prisma.builder.findUnique({
      where: { id: req.params.id },
    });

    if (!builder) {
      throw new AppError("Builder not found", 404);
    }

    await prisma.builder.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Builder deleted successfully",
    });
  }
);
