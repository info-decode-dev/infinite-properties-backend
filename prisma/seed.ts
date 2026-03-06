import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create default admin user if it doesn't exist
  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@infiniteproperties.com';
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  
  const existingUser = await prisma.user.findUnique({
    where: { email: defaultAdminEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);
    const adminUser = await prisma.user.create({
      data: {
        email: defaultAdminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      },
    });
    console.log('✅ Default admin user created!');
    console.log(`📧 Email: ${defaultAdminEmail}`);
    console.log(`🔑 Password: ${defaultAdminPassword}`);
    console.log('⚠️  Please change the password after first login!');
  } else {
    console.log('ℹ️  Admin user already exists. Skipping user creation...');
  }

  // Check if AboutUs already exists
  const existing = await prisma.aboutUs.findFirst();
  
  if (existing) {
    console.log('⚠️  AboutUs data already exists. Skipping seed...');
    console.log('💡 To reseed, delete the existing AboutUs data first.');
    return;
  }

  // Create sample About Us data
  const aboutUs = await prisma.aboutUs.create({
    data: {
      companyName: 'Infinite Properties',
      tagline: 'Your Dream Home Awaits - Building Tomorrow\'s Communities Today',
      mission: 'To provide exceptional real estate solutions that transform dreams into reality. We are committed to delivering innovative, sustainable, and affordable housing options while maintaining the highest standards of quality and customer service.',
      vision: 'To become the leading real estate developer recognized for excellence, innovation, and creating communities that enrich lives and contribute to sustainable urban development.',
      story: 'Founded in 2010, Infinite Properties began with a simple vision: to create homes that families can be proud of. What started as a small local developer has grown into a trusted name in real estate, with over 50 successful projects and thousands of happy homeowners. Our journey has been marked by innovation, integrity, and an unwavering commitment to quality. We believe that every family deserves a beautiful, well-designed home that fits their lifestyle and budget.',
      values: [
        'Integrity: We conduct business with honesty and transparency',
        'Excellence: We strive for the highest quality in everything we do',
        'Innovation: We embrace new technologies and sustainable practices',
        'Customer Focus: Our clients\' satisfaction is our top priority',
        'Sustainability: We build with the environment in mind',
        'Community: We create spaces that bring people together'
      ],
      images: [],
      statistics: {
        create: [
          {
            label: 'Projects Completed',
            value: '50+',
            icon: '🏗️',
            suffix: 'Projects',
          },
          {
            label: 'Happy Families',
            value: '5000+',
            icon: '🏠',
            suffix: 'Families',
          },
          {
            label: 'Years of Experience',
            value: '14',
            icon: '⭐',
            suffix: 'Years',
          },
          {
            label: 'Cities',
            value: '12',
            icon: '🌆',
            suffix: 'Cities',
          },
          // {
          //   label: 'Awards Won',
          //   value: '25+',
          //   icon: '🏆',
          //   suffix: 'Awards',
          // },
          // {
          //   label: 'Sq. Ft. Developed',
          //   value: '5M+',
          //   icon: '📐',
          //   suffix: 'Sq. Ft.',
          // },
        ],
      },
      achievements: {
        create: [
          {
            title: 'Best Developer Award',
            value: '2023',
            icon: '🏆',
            description: 'Recognized as the Best Real Estate Developer by the National Real Estate Council',
          },
          {
            title: 'Green Building Certification',
            value: 'LEED Gold',
            icon: '🌱',
            description: 'Achieved LEED Gold certification for sustainable building practices',
          },
          {
            title: 'Customer Satisfaction',
            value: '98%',
            icon: '😊',
            description: 'Maintained 98% customer satisfaction rate across all projects',
          },
          {
            title: 'On-Time Delivery',
            value: '95%',
            icon: '⏰',
            description: '95% of projects delivered on or before scheduled completion date',
          },
        ],
      },
      teamMembers: {
        create: [
          {
            name: 'John Smith',
            position: 'CEO & Founder',
            bio: 'With over 20 years of experience in real estate development, John leads Infinite Properties with a vision for sustainable and innovative housing solutions. He holds an MBA from Harvard Business School.',
            email: 'john.smith@infiniteproperties.com',
            image: null,
            socialLinks: {
              create: {
                linkedin: 'https://linkedin.com/in/johnsmith',
                twitter: 'https://twitter.com/johnsmith',
                facebook: 'https://facebook.com/johnsmith',
              },
            },
          },
          {
            name: 'Sarah Johnson',
            position: 'Chief Operating Officer',
            bio: 'Sarah brings 15 years of operational excellence to the team. She ensures smooth project execution and maintains the highest quality standards across all developments.',
            email: 'sarah.johnson@infiniteproperties.com',
            image: null,
            socialLinks: {
              create: {
                linkedin: 'https://linkedin.com/in/sarahjohnson',
                twitter: 'https://twitter.com/sarahjohnson',
                facebook: null,
              },
            },
          },
          {
            name: 'Michael Chen',
            position: 'Head of Architecture',
            bio: 'Michael is a renowned architect with expertise in sustainable design. He has won multiple awards for innovative residential designs that blend functionality with aesthetics.',
            email: 'michael.chen@infiniteproperties.com',
            image: null,
            socialLinks: {
              create: {
                linkedin: 'https://linkedin.com/in/michaelchen',
                twitter: null,
                facebook: 'https://facebook.com/michaelchen',
              },
            },
          },
          {
            name: 'Emily Rodriguez',
            position: 'Head of Sales & Marketing',
            bio: 'Emily leads our sales and marketing efforts with a focus on customer relationships. Her team has consistently exceeded sales targets while maintaining high customer satisfaction.',
            email: 'emily.rodriguez@infiniteproperties.com',
            image: null,
            socialLinks: {
              create: {
                linkedin: 'https://linkedin.com/in/emilyrodriguez',
                twitter: 'https://twitter.com/emilyrodriguez',
                facebook: 'https://facebook.com/emilyrodriguez',
              },
            },
          },
          {
            name: 'David Kumar',
            position: 'Head of Finance',
            bio: 'David manages the financial operations with expertise in real estate finance and investment. He ensures financial stability and growth for all projects.',
            email: 'david.kumar@infiniteproperties.com',
            image: null,
            socialLinks: {
              create: {
                linkedin: 'https://linkedin.com/in/davidkumar',
                twitter: null,
                facebook: null,
              },
            },
          },
        ],
      },
      contactInfo: {
        create: {
          address: '123 Real Estate Boulevard, Suite 500, Business District, City 12345, State, Country',
          phone: '+1 (555) 123-4567',
          email: 'info@infiniteproperties.com',
          website: 'https://www.infiniteproperties.com',
          socialMedia: {
            create: {
              facebook: 'https://facebook.com/infiniteproperties',
              twitter: 'https://twitter.com/infiniteproperties',
              instagram: 'https://instagram.com/infiniteproperties',
              linkedin: 'https://linkedin.com/company/infiniteproperties',
              youtube: 'https://youtube.com/@infiniteproperties',
            },
          },
        },
      },
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

  console.log('✅ About Us data seeded successfully!');
  console.log(`📊 Created: ${aboutUs.statistics.length} statistics`);
  console.log(`🏆 Created: ${aboutUs.achievements.length} achievements`);
  console.log(`👥 Created: ${aboutUs.teamMembers.length} team members`);
  console.log(`📞 Created: Contact information`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

