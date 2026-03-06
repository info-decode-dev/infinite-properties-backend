import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../config/database";
import { asyncHandler, AppError } from "../middleware/errorHandler";

export const getAboutUs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const aboutUs = await prisma.aboutUs.findFirst({
    include: {
      statistics: true,
      achievements: true,
      teamMembers: {
        include: {
          socialLinks: true,
        },
      },
      contactInfo: {
        include: {
          socialMedia: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: aboutUs,
  });
});

// Public endpoint for website (no authentication required)
export const getPublicAboutUs = asyncHandler(async (req: any, res: Response) => {
  const aboutUs = await prisma.aboutUs.findFirst({
    include: {
      statistics: true,
      achievements: true,
      teamMembers: {
        include: {
          socialLinks: true,
        },
      },
      contactInfo: {
        include: {
          socialMedia: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: aboutUs,
  });
});

export const createOrUpdateAboutUs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    // Parse JSON strings from FormData with error handling
    let values: string[] = [];
    if (req.body.values) {
      try {
        values = typeof req.body.values === 'string' 
          ? JSON.parse(req.body.values) 
          : req.body.values;
      } catch (e) {
        values = [];
      }
    }

    let statistics: any[] = [];
    if (req.body.statistics) {
      try {
        statistics = typeof req.body.statistics === 'string'
          ? JSON.parse(req.body.statistics)
          : req.body.statistics;
      } catch (e) {
        statistics = [];
      }
    }

    let achievements: any[] = [];
    if (req.body.achievements) {
      try {
        achievements = typeof req.body.achievements === 'string'
          ? JSON.parse(req.body.achievements)
          : req.body.achievements;
      } catch (e) {
        achievements = [];
      }
    }

    let teamMembers: any[] = [];
    if (req.body.teamMembers) {
      try {
        teamMembers = typeof req.body.teamMembers === 'string'
          ? JSON.parse(req.body.teamMembers)
          : req.body.teamMembers;
      } catch (e) {
        teamMembers = [];
      }
    }

    let contactInfo: any = null;
    if (req.body.contactInfo) {
      try {
        const parsed = typeof req.body.contactInfo === 'string'
          ? JSON.parse(req.body.contactInfo)
          : req.body.contactInfo;
        // Only set contactInfo if it has at least one field with a value
        if (parsed && (
          parsed.address || 
          parsed.phone || 
          parsed.email || 
          parsed.website || 
          parsed.socialMedia
        )) {
          contactInfo = parsed;
        }
      } catch (e) {
        contactInfo = null;
      }
    }

    const {
      companyName,
      tagline,
      mission,
      vision,
      story,
    } = req.body;

    // Validate required field
    if (!companyName || companyName.trim() === '') {
      throw new AppError('Company name is required', 400);
    }

    // Convert empty strings to null for optional fields
    const processedTagline = tagline && tagline.trim() !== '' ? tagline.trim() : null;
    const processedMission = mission && mission.trim() !== '' ? mission.trim() : null;
    const processedVision = vision && vision.trim() !== '' ? vision.trim() : null;
    const processedStory = story && story.trim() !== '' ? story.trim() : null;

    // Handle images upload
    // When using uploadFields, req.files is an object, not an array
    let newImages: string[] = [];
    if (req.files) {
      let imageFiles: Express.Multer.File[] = [];
      
      if (Array.isArray(req.files)) {
        // If it's an array (from upload.array)
        imageFiles = req.files.filter(
          (f: Express.Multer.File) => f.fieldname === "images"
        );
      } else {
        // If it's an object (from uploadFields)
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (filesObj["images"]) {
          imageFiles = filesObj["images"];
        }
      }
      
      if (imageFiles.length > 0) {
        newImages = imageFiles.map((f) => `/uploads/images/${f.filename}`);
      }
    }

    // Handle team member image uploads
    const teamMemberImageMap: Record<number, string> = {};
    if (req.files) {
      // Handle both array and object formats
      if (Array.isArray(req.files)) {
        req.files.forEach((file: Express.Multer.File) => {
          if (file.fieldname.startsWith("teamMemberImage_")) {
            const index = parseInt(file.fieldname.split("_")[1]);
            if (!isNaN(index)) {
              teamMemberImageMap[index] = `/uploads/images/${file.filename}`;
            }
          }
        });
      } else {
        // Object format from uploadFields
        const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        Object.keys(filesObj).forEach((fieldname) => {
          if (fieldname.startsWith("teamMemberImage_")) {
            const index = parseInt(fieldname.split("_")[1]);
            if (!isNaN(index)) {
              const files = filesObj[fieldname];
              if (files && files.length > 0 && files[0]) {
                teamMemberImageMap[index] = `/uploads/images/${files[0].filename}`;
              }
            }
          }
        });
      }
    }

    // Handle existing images (images that should be kept)
    let existingImagesToKeep: string[] = [];
    if (req.body.existingImages) {
      try {
        existingImagesToKeep = typeof req.body.existingImages === 'string'
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
      } catch (e) {
        existingImagesToKeep = [];
      }
    }

    // Check if AboutUs already exists
    const existing = await prisma.aboutUs.findFirst();

    if (existing) {
      // Update existing - merge kept existing images with new images
      const images = [...existingImagesToKeep, ...newImages];

      // Delete existing relations
      await Promise.all([
        prisma.aboutUsStatistic.deleteMany({ where: { aboutUsId: existing.id } }),
        prisma.aboutUsAchievement.deleteMany({ where: { aboutUsId: existing.id } }),
        prisma.aboutUsTeamMember.deleteMany({ where: { aboutUsId: existing.id } }),
        prisma.aboutUsContactInfo.deleteMany({ where: { aboutUsId: existing.id } }),
      ]);

      const aboutUs = await prisma.aboutUs.update({
        where: { id: existing.id },
        data: {
          companyName: companyName.trim(),
          tagline: processedTagline,
          mission: processedMission,
          vision: processedVision,
          story: processedStory,
          values: Array.isArray(values) ? values : [],
          images,
          statistics: {
            create: Array.isArray(statistics)
              ? statistics.map((s: any) => ({
                  label: s.label,
                  value: s.value,
                  icon: s.icon,
                  suffix: s.suffix,
                  prefix: s.prefix,
                }))
              : [],
          },
          achievements: {
            create: Array.isArray(achievements)
              ? achievements.map((a: any) => ({
                  title: a.title,
                  value: a.value,
                  icon: a.icon,
                  description: a.description,
                }))
              : [],
          },
          teamMembers: {
            create: Array.isArray(teamMembers)
              ? teamMembers.map((tm: any, index: number) => ({
                  name: tm.name,
                  position: tm.position,
                  bio: tm.bio,
                  image: teamMemberImageMap[index] || tm.image || null,
                  email: tm.email,
                  socialLinks: tm.socialLinks
                    ? {
                        create: {
                          linkedin: tm.socialLinks.linkedin,
                          twitter: tm.socialLinks.twitter,
                          facebook: tm.socialLinks.facebook,
                        },
                      }
                    : undefined,
                }))
              : [],
          },
          contactInfo: contactInfo
            ? {
                create: {
                  address: contactInfo.address,
                  phone: contactInfo.phone,
                  email: contactInfo.email,
                  website: contactInfo.website,
                  socialMedia: contactInfo.socialMedia
                    ? {
                        create: {
                          facebook: contactInfo.socialMedia.facebook,
                          twitter: contactInfo.socialMedia.twitter,
                          instagram: contactInfo.socialMedia.instagram,
                          linkedin: contactInfo.socialMedia.linkedin,
                          youtube: contactInfo.socialMedia.youtube,
                        },
                      }
                    : undefined,
                },
              }
            : undefined,
        },
        include: {
          statistics: true,
          achievements: true,
          teamMembers: {
            include: {
              socialLinks: true,
            },
          },
          contactInfo: {
            include: {
              socialMedia: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "About Us updated successfully",
        data: aboutUs,
      });
    } else {
      // Create new
      const images = newImages; // For new records, only use newly uploaded images
      const aboutUs = await prisma.aboutUs.create({
        data: {
          companyName: companyName.trim(),
          tagline: processedTagline,
          mission: processedMission,
          vision: processedVision,
          story: processedStory,
          values: Array.isArray(values) ? values : [],
          images,
          statistics: {
            create: Array.isArray(statistics)
              ? statistics.map((s: any) => ({
                  label: s.label,
                  value: s.value,
                  icon: s.icon,
                  suffix: s.suffix,
                  prefix: s.prefix,
                }))
              : [],
          },
          achievements: {
            create: Array.isArray(achievements)
              ? achievements.map((a: any) => ({
                  title: a.title,
                  value: a.value,
                  icon: a.icon,
                  description: a.description,
                }))
              : [],
          },
          teamMembers: {
            create: Array.isArray(teamMembers)
              ? teamMembers.map((tm: any, index: number) => ({
                  name: tm.name,
                  position: tm.position,
                  bio: tm.bio,
                  image: teamMemberImageMap[index] || tm.image || null,
                  email: tm.email,
                  socialLinks: tm.socialLinks
                    ? {
                        create: {
                          linkedin: tm.socialLinks.linkedin,
                          twitter: tm.socialLinks.twitter,
                          facebook: tm.socialLinks.facebook,
                        },
                      }
                    : undefined,
                }))
              : [],
          },
          contactInfo: contactInfo
            ? {
                create: {
                  address: contactInfo.address,
                  phone: contactInfo.phone,
                  email: contactInfo.email,
                  website: contactInfo.website,
                  socialMedia: contactInfo.socialMedia
                    ? {
                        create: {
                          facebook: contactInfo.socialMedia.facebook,
                          twitter: contactInfo.socialMedia.twitter,
                          instagram: contactInfo.socialMedia.instagram,
                          linkedin: contactInfo.socialMedia.linkedin,
                          youtube: contactInfo.socialMedia.youtube,
                        },
                      }
                    : undefined,
                },
              }
            : undefined,
        },
        include: {
          statistics: true,
          achievements: true,
          teamMembers: {
            include: {
              socialLinks: true,
            },
          },
          contactInfo: {
            include: {
              socialMedia: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: "About Us created successfully",
        data: aboutUs,
      });
    }
  }
);

export const deleteAboutUs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const aboutUs = await prisma.aboutUs.findFirst();
    if (!aboutUs) {
      throw new AppError("About Us not found", 404);
    }

    await prisma.aboutUs.delete({
      where: { id: aboutUs.id },
    });

    res.status(200).json({
      success: true,
      message: "About Us deleted successfully",
    });
  }
);
