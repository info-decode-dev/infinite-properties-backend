import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../config/database";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { geocodeLocation } from "../utils/geocode";
import { uploadToSupabase } from "../utils/supabaseStorage";
import { supabase } from "../config/supabase";

export const getAllProperties = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      search,
      city,
      state,
      bhkType,
      constructionStatus,
      page = 1,
      limit = 10,
    } = req.query;

    const where: any = {};

    // Text search
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Filters
    if (city) where.location = { ...where.location, city: city as string };
    if (state) where.location = { ...where.location, state: state as string };
    if (bhkType) where.bhkType = bhkType as string;
    if (constructionStatus) where.constructionStatus = constructionStatus as string;

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          location: true,
          developerInfo: true,
          amenities: true,
          accessibility: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.property.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: properties,
    });
  }
);

// Public endpoint for website (no authentication required)
export const getAllPropertiesPublic = asyncHandler(
  async (req: any, res: Response) => {
    const {
      search,
      city,
      state,
      bhkType,
      constructionStatus,
      collectionId,
      page = 1,
      limit = 10,
    } = req.query;

    const where: any = {};

    // Text search
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Filters
    if (city) where.location = { ...where.location, city: city as string };
    if (state) where.location = { ...where.location, state: state as string };
    if (bhkType) where.bhkType = bhkType as string;
    if (constructionStatus) where.constructionStatus = constructionStatus as string;
    
    // Filter by curated collection
    if (collectionId) {
      where.collections = {
        some: {
          curatedCollectionId: collectionId as string,
        },
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          location: true,
          developerInfo: true,
          amenities: true,
          accessibility: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.property.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: properties,
    });
  }
);

export const getPropertyById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        location: true,
        developerInfo: true,
        amenities: true,
        accessibility: true,
      },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  }
);

// Public endpoint for website (no authentication required)
export const getPropertyByIdPublic = asyncHandler(
  async (req: any, res: Response) => {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        location: true,
        developerInfo: true,
        amenities: true,
        accessibility: true,
      },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  }
);

export const createProperty = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Handle file uploads
    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      // If Supabase is configured, upload files to Supabase and get full URLs
      if (supabase) {
        for (const file of req.files) {
          const result = await uploadToSupabase(file, 'images');
          if (result.url) {
            images.push(result.url);
          } else {
            console.error('Failed to upload image to Supabase:', result.error);
          }
        }
      } else {
        // Local storage - use filename
        req.files.forEach((file: Express.Multer.File) => {
          images.push(`/uploads/images/${file.filename}`);
        });
      }
    }

    // Parse JSON strings from FormData if they exist
    let location = typeof req.body.location === 'string' 
      ? JSON.parse(req.body.location) 
      : req.body.location;
    
    let developerInfo = typeof req.body.developerInfo === 'string'
      ? JSON.parse(req.body.developerInfo)
      : req.body.developerInfo;
    
    let tags = typeof req.body.tags === 'string'
      ? JSON.parse(req.body.tags)
      : req.body.tags;
    
    let amenities = typeof req.body.amenities === 'string'
      ? JSON.parse(req.body.amenities)
      : req.body.amenities;

    const {
      title,
      description,
      actualPrice,
      offerPrice,
      bhkType,
      propertyType,
      constructionStatus,
      landArea,
      landAreaUnit,
      builtUpArea,
      furnishedStatus,
      negotiation,
      nearbyLandmarks,
      // Plot-specific fields
      landType,
      plotSize,
      plotSizeUnit,
      ownership,
    } = req.body;

    let accessibility = typeof req.body.accessibility === 'string'
      ? JSON.parse(req.body.accessibility)
      : req.body.accessibility;

    // Geocode address if coordinates are not provided
    let latitude = location.latitude ? parseFloat(location.latitude) : null;
    let longitude = location.longitude ? parseFloat(location.longitude) : null;

    // If coordinates are missing, try to geocode the address
    if (!latitude || !longitude) {
      console.log('Geocoding address for property:', location.exactLocation);
      const geocodeResult = await geocodeLocation({
        exactLocation: location.exactLocation,
        city: location.city,
        state: location.state,
        country: location.country,
        pincode: location.pincode,
      });

      if (geocodeResult.success && geocodeResult.latitude && geocodeResult.longitude) {
        latitude = geocodeResult.latitude;
        longitude = geocodeResult.longitude;
        console.log(`Geocoded coordinates: ${latitude}, ${longitude}`);
      } else {
        console.warn('Geocoding failed:', geocodeResult.error);
        // Continue without coordinates - they can be added manually later
      }
    }

    // Create location
    const locationData = await prisma.location.create({
      data: {
        exactLocation: location.exactLocation,
        city: location.city,
        state: location.state,
        country: location.country,
        pincode: location.pincode || null,
        latitude: latitude,
        longitude: longitude,
      },
    });

    // Create developer info (only for non-Plot properties)
    let developerData = null;
    if (propertyType !== "Plot" && developerInfo && developerInfo.name) {
      developerData = await prisma.developerInfo.create({
        data: {
          name: developerInfo.name,
          email: developerInfo.email || null,
          phone: developerInfo.phone || null,
          website: developerInfo.website || null,
          description: developerInfo.description || null,
        },
      });
    } else {
      // Create a placeholder developer info for Plot properties (required by schema)
      developerData = await prisma.developerInfo.create({
        data: {
          name: "N/A",
          email: null,
          phone: null,
          website: null,
          description: null,
        },
      });
    }

    // Parse collection IDs if provided
    let collectionIds: string[] = [];
    if (req.body.collectionIds) {
      collectionIds = typeof req.body.collectionIds === 'string' 
        ? JSON.parse(req.body.collectionIds) 
        : req.body.collectionIds;
    }

    // Create property
    const property = await prisma.property.create({
      data: {
        title,
        description,
        images,
        actualPrice: parseFloat(actualPrice),
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        bhkType: propertyType === "Plot" ? null : (bhkType || null),
        propertyType,
        constructionStatus: propertyType === "Plot" ? null : (constructionStatus || null),
        landArea: parseFloat(landArea),
        landAreaUnit: landAreaUnit,
        builtUpArea: propertyType === "Plot" ? null : (builtUpArea ? parseFloat(builtUpArea) : null),
        furnishedStatus: propertyType === "Plot" ? null : (furnishedStatus || null),
        negotiation: negotiation || null,
        nearbyLandmarks: Array.isArray(nearbyLandmarks) ? nearbyLandmarks : (typeof nearbyLandmarks === 'string' ? JSON.parse(nearbyLandmarks) : []),
        tags: propertyType === "Plot" ? [] : (Array.isArray(tags) ? tags : []),
        // Plot-specific fields
        landType: propertyType === "Plot" ? (landType || null) : null,
        plotSize: propertyType === "Plot" ? (plotSize ? parseFloat(plotSize) : null) : null,
        plotSizeUnit: propertyType === "Plot" ? (plotSizeUnit || null) : null,
        ownership: propertyType === "Plot" ? (ownership || null) : null,
        locationId: locationData.id,
        developerInfoId: developerData.id,
        amenities: {
          create: Array.isArray(amenities)
            ? amenities.map((a: any) => ({
                name: a.name,
                icon: a.icon,
              }))
            : [],
        },
        accessibility: Array.isArray(accessibility) && accessibility.length > 0
          ? {
              create: accessibility.map((a: any) => ({
                name: a.name,
                distance: parseFloat(a.distance),
                unit: a.unit,
              })),
            }
          : undefined,
        collections: Array.isArray(collectionIds) && collectionIds.length > 0
          ? {
              create: collectionIds.map((collectionId: string) => ({
                curatedCollectionId: collectionId,
              })),
            }
          : undefined,
      },
      include: {
        location: true,
        developerInfo: true,
        amenities: true,
        accessibility: true,
        collections: {
          include: {
            curatedCollection: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  }
);

export const updateProperty = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    let property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: { location: true, developerInfo: true, collections: true },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    // Handle image updates
    let images = property.images || [];
    
    // If existingImages is provided, use only those (user may have removed some)
    let existingImages: string[] = [];
    if (req.body.existingImages) {
      existingImages = typeof req.body.existingImages === 'string'
        ? JSON.parse(req.body.existingImages)
        : req.body.existingImages;
    }
    
    // Start with existing images that should be kept (if specified)
    if (existingImages.length > 0) {
      images = existingImages;
    }
    
    // Add new uploaded images
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImages: string[] = [];
      // If Supabase is configured, upload files to Supabase and get full URLs
      if (supabase) {
        for (const file of req.files) {
          const result = await uploadToSupabase(file, 'images');
          if (result.url) {
            newImages.push(result.url);
          } else {
            console.error('Failed to upload image to Supabase:', result.error);
          }
        }
      } else {
        // Local storage - use filename
        req.files.forEach((file: Express.Multer.File) => {
          newImages.push(`/uploads/images/${file.filename}`);
        });
      }
      images = [...images, ...newImages];
    }

    // Parse JSON strings from FormData if they exist
    let location = typeof req.body.location === 'string' 
      ? JSON.parse(req.body.location) 
      : req.body.location;
    
    let developerInfo = typeof req.body.developerInfo === 'string'
      ? JSON.parse(req.body.developerInfo)
      : req.body.developerInfo;
    
    let tags = typeof req.body.tags === 'string'
      ? JSON.parse(req.body.tags)
      : req.body.tags;
    
    let amenities = typeof req.body.amenities === 'string'
      ? JSON.parse(req.body.amenities)
      : req.body.amenities;

    let accessibility = typeof req.body.accessibility === 'string'
      ? JSON.parse(req.body.accessibility)
      : req.body.accessibility;

    const propertyType = req.body.propertyType || property.propertyType;
    
    const updateData: any = {
      title: req.body.title,
      description: req.body.description,
      actualPrice: req.body.actualPrice ? parseFloat(req.body.actualPrice) : undefined,
      offerPrice: req.body.offerPrice ? parseFloat(req.body.offerPrice) : undefined,
      propertyType: propertyType,
      landArea: req.body.landArea ? parseFloat(req.body.landArea) : undefined,
      landAreaUnit: req.body.landAreaUnit || undefined,
      negotiation: req.body.negotiation || undefined,
      nearbyLandmarks: req.body.nearbyLandmarks ? (Array.isArray(req.body.nearbyLandmarks) ? req.body.nearbyLandmarks : JSON.parse(req.body.nearbyLandmarks)) : undefined,
      images,
    };

    // Handle fields based on property type
    if (propertyType === "Plot") {
      updateData.bhkType = null;
      updateData.constructionStatus = null;
      updateData.builtUpArea = null;
      updateData.furnishedStatus = null;
      updateData.tags = [];
      updateData.landType = req.body.landType || null;
      updateData.plotSize = req.body.plotSize ? parseFloat(req.body.plotSize) : null;
      updateData.plotSizeUnit = req.body.plotSizeUnit || null;
      updateData.ownership = req.body.ownership || null;
    } else {
      updateData.bhkType = req.body.bhkType || undefined;
      updateData.constructionStatus = req.body.constructionStatus || undefined;
      updateData.builtUpArea = req.body.builtUpArea ? parseFloat(req.body.builtUpArea) : undefined;
      updateData.furnishedStatus = req.body.furnishedStatus || undefined;
      updateData.tags = tags || [];
      updateData.landType = null;
      updateData.plotSize = null;
      updateData.plotSizeUnit = null;
      updateData.ownership = null;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    // Update location if provided
    if (location) {
      // Geocode address if coordinates are not provided
      let latitude = location.latitude ? parseFloat(location.latitude) : null;
      let longitude = location.longitude ? parseFloat(location.longitude) : null;

      // If coordinates are missing, try to geocode the address
      if (!latitude || !longitude) {
        console.log('Geocoding address for property update:', location.exactLocation);
        const geocodeResult = await geocodeLocation({
          exactLocation: location.exactLocation,
          city: location.city,
          state: location.state,
          country: location.country,
          pincode: location.pincode,
        });

        if (geocodeResult.success && geocodeResult.latitude && geocodeResult.longitude) {
          latitude = geocodeResult.latitude;
          longitude = geocodeResult.longitude;
          console.log(`Geocoded coordinates: ${latitude}, ${longitude}`);
        } else {
          console.warn('Geocoding failed:', geocodeResult.error);
          // Continue without coordinates - they can be added manually later
        }
      }

      await prisma.location.update({
        where: { id: property.locationId },
        data: {
          exactLocation: location.exactLocation,
          city: location.city,
          state: location.state,
          country: location.country,
          pincode: location.pincode || null,
          latitude: latitude,
          longitude: longitude,
        },
      });
    }

    // Update developer info only for non-Plot properties
    if (developerInfo && propertyType !== "Plot") {
      await prisma.developerInfo.update({
        where: { id: property.developerInfoId },
        data: {
          name: developerInfo.name || "N/A",
          email: developerInfo.email || null,
          phone: developerInfo.phone || null,
          website: developerInfo.website || null,
          description: developerInfo.description || null,
        },
      });
    }

    // Update amenities if provided
    if (amenities && Array.isArray(amenities)) {
      await prisma.propertyAmenity.deleteMany({
        where: { propertyId: property.id },
      });
      await prisma.propertyAmenity.createMany({
        data: amenities.map((a: any) => ({
          propertyId: property.id,
          name: a.name,
          icon: a.icon,
        })),
      });
    }

    // Update accessibility if provided
    if (accessibility && Array.isArray(accessibility)) {
      await prisma.propertyAccessibility.deleteMany({
        where: { propertyId: property.id },
      });
      await prisma.propertyAccessibility.createMany({
        data: accessibility.map((a: any) => ({
          propertyId: property.id,
          name: a.name,
          distance: parseFloat(a.distance),
          unit: a.unit,
        })),
      });
    }

    // Handle collection updates
    let collectionIds: string[] = [];
    if (req.body.collectionIds) {
      collectionIds = typeof req.body.collectionIds === 'string' 
        ? JSON.parse(req.body.collectionIds) 
        : req.body.collectionIds;
    }

    // Delete existing collection relationships
    if (property.collections && property.collections.length > 0) {
      await prisma.propertyCollection.deleteMany({
        where: { propertyId: property.id },
      });
    }

    // Create new collection relationships if provided
    if (Array.isArray(collectionIds) && collectionIds.length > 0) {
      updateData.collections = {
        create: collectionIds.map((collectionId: string) => ({
          curatedCollectionId: collectionId,
        })),
      };
    }

    // Update property
    const updatedProperty = await prisma.property.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        location: true,
        developerInfo: true,
        amenities: true,
        accessibility: true,
        collections: {
          include: {
            curatedCollection: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  }
);

export const deleteProperty = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    // Cascade delete will handle location, developerInfo, and amenities
    await prisma.property.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  }
);

export const getDashboardStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const totalProperties = await prisma.property.count();
    
    // Properties created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newThisMonth = await prisma.property.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Featured properties (properties with "Featured" tag)
    const featured = await prisma.property.count({
      where: {
        tags: {
          has: "Featured",
        },
      },
    });

    // Total testimonials
    const testimonials = await prisma.testimonial.count();

    // Properties by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentProperties = await prisma.property.findMany({
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
    recentProperties.forEach((item) => {
      const month = new Date(item.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    // Properties by BHK type
    const bhkStats = await prisma.property.groupBy({
      by: ["bhkType"],
      _count: true,
    });

    // Properties by construction status
    const statusStats = await prisma.property.groupBy({
      by: ["constructionStatus"],
      _count: true,
    });

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        newThisMonth,
        featured,
        testimonials,
        monthlyData,
        bhkStats: bhkStats.map((item) => ({
          type: item.bhkType,
          count: item._count,
        })),
        statusStats: statusStats.map((item) => ({
          status: item.constructionStatus,
          count: item._count,
        })),
      },
    });
  }
);