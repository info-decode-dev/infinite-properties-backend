import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../config/database";
import { asyncHandler, AppError } from "../middleware/errorHandler";

// Curated Collections
export const getAllCollections = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { search, page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (search) {
      where.title = { contains: search as string, mode: "insensitive" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [collections, total] = await Promise.all([
      prisma.curatedCollection.findMany({
        where,
        include: {
          _count: {
            select: {
              properties: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.curatedCollection.count({ where }),
    ]);

    // Map collections to include property count
    const collectionsWithCount = collections.map((collection) => ({
      ...collection,
      propertyCount: collection._count.properties,
    }));

    res.status(200).json({
      success: true,
      count: collections.length,
      total,
      data: collectionsWithCount,
    });
  }
);

// Public endpoint for website (no authentication required)
export const getAllCollectionsPublic = asyncHandler(
  async (req: any, res: Response) => {
    const { search, page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (search) {
      where.title = { contains: search as string, mode: "insensitive" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [collections, total] = await Promise.all([
      prisma.curatedCollection.findMany({
        where,
        include: {
          _count: {
            select: {
              properties: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.curatedCollection.count({ where }),
    ]);

    // Map collections to include property count
    const collectionsWithCount = collections.map((collection) => ({
      ...collection,
      propertyCount: collection._count.properties,
    }));

    res.status(200).json({
      success: true,
      count: collections.length,
      total,
      data: collectionsWithCount,
    });
  }
);

export const getCollectionById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const collection = await prisma.curatedCollection.findUnique({
      where: { id: req.params.id },
    });

    if (!collection) {
      throw new AppError("Collection not found", 404);
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  }
);

export const createCollection = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new AppError("Image is required", 400);
    }

    const collection = await prisma.curatedCollection.create({
      data: {
        title: req.body.title,
        image: `/uploads/images/${req.file.filename}`,
      },
    });

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      data: collection,
    });
  }
);

export const updateCollection = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    let collection = await prisma.curatedCollection.findUnique({
      where: { id: req.params.id },
    });

    if (!collection) {
      throw new AppError("Collection not found", 404);
    }

    const updateData: any = { title: req.body.title };
    if (req.file) {
      updateData.image = `/uploads/images/${req.file.filename}`;
    }

    collection = await prisma.curatedCollection.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      data: collection,
    });
  }
);

export const deleteCollection = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const collection = await prisma.curatedCollection.findUnique({
      where: { id: req.params.id },
    });

    if (!collection) {
      throw new AppError("Collection not found", 404);
    }

    await prisma.curatedCollection.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  }
);

// Reels
export const getAllReels = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search, page = 1, limit = 10 } = req.query;

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: "insensitive" } },
      { link: { contains: search as string, mode: "insensitive" } },
      { description: { contains: search as string, mode: "insensitive" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [reels, total] = await Promise.all([
    prisma.reel.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.reel.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    count: reels.length,
    total,
    data: reels,
  });
});

// Public endpoint for website (no authentication required)
export const getAllReelsPublic = asyncHandler(async (req: any, res: Response) => {
  const { search, page = 1, limit = 10 } = req.query;

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: "insensitive" } },
      { link: { contains: search as string, mode: "insensitive" } },
      { description: { contains: search as string, mode: "insensitive" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [reels, total] = await Promise.all([
    prisma.reel.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.reel.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    count: reels.length,
    total,
    data: reels,
  });
});

export const getReelById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reel = await prisma.reel.findUnique({
    where: { id: req.params.id },
  });

  if (!reel) {
    throw new AppError("Reel not found", 404);
  }

  res.status(200).json({
    success: true,
    data: reel,
  });
});

export const createReel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reel = await prisma.reel.create({
    data: {
      link: req.body.link,
      title: req.body.title,
      description: req.body.description,
      actionButtonLink: req.body.actionButtonLink,
    },
  });

  res.status(201).json({
    success: true,
    message: "Reel created successfully",
    data: reel,
  });
});

export const updateReel = asyncHandler(async (req: AuthRequest, res: Response) => {
  let reel = await prisma.reel.findUnique({
    where: { id: req.params.id },
  });

  if (!reel) {
    throw new AppError("Reel not found", 404);
  }

  reel = await prisma.reel.update({
    where: { id: req.params.id },
    data: {
      link: req.body.link,
      title: req.body.title,
      description: req.body.description,
      actionButtonLink: req.body.actionButtonLink,
    },
  });

  res.status(200).json({
    success: true,
    message: "Reel updated successfully",
    data: reel,
  });
});

export const deleteReel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reel = await prisma.reel.findUnique({
    where: { id: req.params.id },
  });

  if (!reel) {
    throw new AppError("Reel not found", 404);
  }

  await prisma.reel.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Reel deleted successfully",
  });
});

// Featured Properties
export const getAllFeaturedProperties = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { search, page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [featuredProperties, total] = await Promise.all([
      prisma.featuredProperty.findMany({
        where,
        include: { gallery: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.featuredProperty.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: featuredProperties.length,
      total,
      data: featuredProperties,
    });
  }
);

export const createFeaturedProperty = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const featuredData: any = {
      title: req.body.title,
      description: req.body.description,
      clientLogos: Array.isArray(req.body.clientLogos) ? req.body.clientLogos : [],
    };

    // Handle gallery upload (max 5 images/videos)
    const galleryData: any[] = [];
    if (req.files && Array.isArray(req.files)) {
      const galleryFiles = req.files.filter(
        (f: Express.Multer.File) => f.fieldname === "gallery"
      );
      if (galleryFiles.length > 5) {
        throw new AppError("Maximum 5 gallery items allowed", 400);
      }
      galleryFiles.forEach((file) => {
        const isVideo = file.mimetype.startsWith("video/");
        galleryData.push({
          type: isVideo ? "video" : "image",
          url: `/uploads/${isVideo ? "videos" : "images"}/${file.filename}`,
        });
      });
    }

    // Handle client logos
    if (req.files && Array.isArray(req.files)) {
      const logoFiles = req.files.filter(
        (f: Express.Multer.File) => f.fieldname === "logos"
      );
      if (logoFiles.length > 0) {
        featuredData.clientLogos = logoFiles.map(
          (f) => `/uploads/logos/${f.filename}`
        );
      }
    }

    const featuredProperty = await prisma.featuredProperty.create({
      data: {
        ...featuredData,
        gallery: galleryData.length > 0
          ? {
              create: galleryData,
            }
          : undefined,
      },
      include: { gallery: true },
    });

    res.status(201).json({
      success: true,
      message: "Featured property created successfully",
      data: featuredProperty,
    });
  }
);

export const updateFeaturedProperty = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    let featuredProperty = await prisma.featuredProperty.findUnique({
      where: { id: req.params.id },
      include: { gallery: true },
    });

    if (!featuredProperty) {
      throw new AppError("Featured property not found", 404);
    }

    const updateData: any = {
      title: req.body.title,
      description: req.body.description,
    };

    // Handle gallery upload (max 5 images/videos)
    // Parse existing gallery IDs to keep
    let existingGalleryIds: string[] = [];
    if (req.body.existingGallery) {
      try {
        existingGalleryIds = JSON.parse(req.body.existingGallery);
      } catch (e) {
        // If not valid JSON, treat as empty
        existingGalleryIds = [];
      }
    }

    // Delete gallery items not in existingGalleryIds
    if (featuredProperty.gallery && featuredProperty.gallery.length > 0) {
      const toDelete = featuredProperty.gallery.filter(
        (item) => !existingGalleryIds.includes(item.id)
      );
      for (const item of toDelete) {
        await prisma.featuredMedia.delete({
          where: { id: item.id },
        });
      }
    }

    // Add new gallery items
    if (req.files && Array.isArray(req.files)) {
      const galleryFiles = req.files.filter(
        (f: Express.Multer.File) => f.fieldname === "gallery"
      );
      if (galleryFiles.length > 5) {
        throw new AppError("Maximum 5 gallery items allowed", 400);
      }
      const currentGalleryCount = existingGalleryIds.length;
      if (currentGalleryCount + galleryFiles.length > 5) {
        throw new AppError("Total gallery items cannot exceed 5", 400);
      }
      const newGalleryData = galleryFiles.map((file) => {
        const isVideo = file.mimetype.startsWith("video/");
        return {
          type: isVideo ? "video" : "image",
          url: `/uploads/${isVideo ? "videos" : "images"}/${file.filename}`,
        };
      });
      if (newGalleryData.length > 0) {
        updateData.gallery = {
          create: newGalleryData,
        };
      }
    }

    // Handle client logos
    if (req.files && Array.isArray(req.files)) {
      const logoFiles = req.files.filter(
        (f: Express.Multer.File) => f.fieldname === "logos"
      );
      if (logoFiles.length > 0) {
        const newLogos = logoFiles.map((f) => `/uploads/logos/${f.filename}`);
        updateData.clientLogos = [...(featuredProperty.clientLogos || []), ...newLogos];
      }
    }

    const updatedFeaturedProperty = await prisma.featuredProperty.update({
      where: { id: req.params.id },
      data: updateData,
      include: { gallery: true },
    });

    res.status(200).json({
      success: true,
      message: "Featured property updated successfully",
      data: updatedFeaturedProperty,
    });
  }
);

export const deleteFeaturedProperty = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const featuredProperty = await prisma.featuredProperty.findUnique({
      where: { id: req.params.id },
    });

    if (!featuredProperty) {
      throw new AppError("Featured property not found", 404);
    }

    await prisma.featuredProperty.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Featured property deleted successfully",
    });
  }
);
