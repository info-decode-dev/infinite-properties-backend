# Infinite Properties Backend Server

Backend API server for Infinite Properties admin dashboard using **PostgreSQL** and **Prisma**.

## Why PostgreSQL?

- ✅ **Perfect Filtration**: Advanced indexing, full-text search, and complex query capabilities
- ✅ **Fast Loading**: Optimized query performance with proper indexing and query planning
- ✅ **Easy Access**: Type-safe Prisma ORM with excellent TypeScript support

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up PostgreSQL database:**
   - Install PostgreSQL if not already installed
   - Create a database: `CREATE DATABASE infinite_properties;`

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL connection string:
```
DATABASE_URL=postgresql://user:password@localhost:5432/infinite_properties?schema=public
```

4. **Run Prisma migrations:**
```bash
npx prisma migrate dev --name init
```

5. **Generate Prisma Client:**
```bash
npx prisma generate
```

6. **Start the development server:**
```bash
npm run dev
```

## Database Management

### View database in Prisma Studio:
```bash
npx prisma studio
```

### Create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

### Reset database (WARNING: Deletes all data):
```bash
npx prisma migrate reset
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new admin
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties (with search, filters, pagination)
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (with image uploads)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials/:id` - Get testimonial by ID
- `POST /api/testimonials` - Create testimonial (with profile picture & media)
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

### Collections
- Collections: `GET/POST/PUT/DELETE /api/collections/collections`
- Reels: `GET/POST/PUT/DELETE /api/collections/reels`
- Featured Properties: `GET/POST/PUT/DELETE /api/collections/featured`

### About Us
- `GET /api/about-us` - Get About Us content
- `POST/PUT /api/about-us` - Create/Update About Us
- `DELETE /api/about-us` - Delete About Us

## Features

### Database Features
- **Relational Data**: Proper foreign keys and relationships
- **Indexes**: Optimized for fast queries
- **Full-text Search**: PostgreSQL full-text search capabilities
- **Transactions**: ACID compliance for data integrity
- **Cascade Deletes**: Automatic cleanup of related data

### Performance Optimizations
- Database indexes on frequently queried fields
- Efficient joins with Prisma
- Pagination support
- Query optimization with Prisma's query engine

### Security
- JWT authentication
- Password hashing with bcrypt
- Input validation
- SQL injection protection (Prisma handles this)

## Authentication

All endpoints except `/api/auth/login` and `/api/auth/register` require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## File Uploads

Files are uploaded to `public/uploads/` directory with subdirectories:
- `images/` - Property images, collection images
- `videos/` - Video files
- `logos/` - Client logos
- `profiles/` - Profile pictures

## Build

```bash
npm run build
npm start
```

## Database Schema

The schema includes:
- Users (authentication)
- Properties (with Location, DeveloperInfo, Amenities)
- Testimonials (with PropertyMedia)
- CuratedCollections
- Reels
- FeaturedProperties (with Media)
- AboutUs (with Statistics, Achievements, TeamMembers, ContactInfo)

All relationships are properly defined with foreign keys and cascade deletes.
