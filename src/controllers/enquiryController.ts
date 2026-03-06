import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../config/database";
import { asyncHandler, AppError } from "../middleware/errorHandler";

// Create a new enquiry (public endpoint - no auth required)
export const createEnquiry = asyncHandler(
  async (req: Request, res: Response) => {
    const { userName, userEmail, userPhone, message, propertyId } = req.body;

    // Verify that the property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    // Create the enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        userName,
        userEmail,
        userPhone: userPhone || null,
        message: message || null,
        propertyId,
        status: "pending",
      },
      include: {
        property: {
          include: {
            location: true,
            developerInfo: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  }
);

export const getAllEnquiries = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      status,
      propertyId,
      search,
      startDate,
      endDate,
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const where: any = {};

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by property ID
    if (propertyId) {
      where.propertyId = propertyId;
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { userName: { contains: search as string, mode: "insensitive" } },
        { userEmail: { contains: search as string, mode: "insensitive" } },
        { userPhone: { contains: search as string, mode: "insensitive" } },
        { message: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const orderBy: Record<string, "asc" | "desc"> = {};
    const validSortFields = ["createdAt", "updatedAt", "userName", "userEmail", "status"];
    const sortField = validSortFields.includes(sortBy as string) ? (sortBy as string) : "createdAt";
    orderBy[sortField] = sortOrder === "asc" ? "asc" : "desc";

    // Get total count for pagination
    const total = await prisma.enquiry.count({ where });

    // Get enquiries with pagination
    const enquiries = await prisma.enquiry.findMany({
      where,
      include: {
        property: {
          include: {
            location: true,
            developerInfo: true,
          },
        },
      },
      orderBy,
      skip,
      take: limitNum,
    });

    res.status(200).json({
      success: true,
      data: enquiries,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  }
);

export const getEnquiryById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: req.params.id },
      include: {
        property: {
          include: {
            location: true,
            developerInfo: true,
            amenities: true,
          },
        },
      },
    });

    if (!enquiry) {
      throw new AppError("Enquiry not found", 404);
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  }
);

export const updateEnquiryStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { status } = req.body;

    if (!["pending", "contacted", "closed"].includes(status)) {
      throw new AppError("Invalid status", 400);
    }

    const enquiry = await prisma.enquiry.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        property: {
          include: {
            location: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  }
);

export const deleteEnquiry = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: req.params.id },
    });

    if (!enquiry) {
      throw new AppError("Enquiry not found", 404);
    }

    await prisma.enquiry.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  }
);

export const getEnquiryStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const total = await prisma.enquiry.count();
    const pending = await prisma.enquiry.count({ where: { status: "pending" } });
    const contacted = await prisma.enquiry.count({ where: { status: "contacted" } });
    const closed = await prisma.enquiry.count({ where: { status: "closed" } });

    // Enquiries by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentEnquiries = await prisma.enquiry.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Group by month
    const monthlyData: { [key: string]: number } = {};
    recentEnquiries.forEach((item) => {
      const month = new Date(item.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        contacted,
        closed,
        monthlyData,
      },
    });
  }
);

