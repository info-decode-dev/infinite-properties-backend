# Database Setup Guide - PostgreSQL with pgAdmin 4

## Step 1: Create Database in pgAdmin 4

1. **Open pgAdmin 4** and connect to your PostgreSQL server
   - If you haven't set a password, you might need to set one first
   - Default connection: `localhost:5432`

2. **Create a New Database:**
   - Right-click on "Databases" in the left panel
   - Select "Create" → "Database..."
   - In the "Database" field, enter: `infinite_properties`
   - Click "Save"

## Step 2: Get Your Connection Details

You'll need these details for the connection string:
- **Host**: Usually `localhost` or `127.0.0.1`
- **Port**: Usually `5432` (default PostgreSQL port)
- **Database**: `infinite_properties` (the one you just created)
- **Username**: Your PostgreSQL username (usually `postgres` by default)
- **Password**: Your PostgreSQL password

## Step 3: Create .env File

1. Navigate to the `server` folder
2. Copy the `.env.example` file (if it exists) or create a new `.env` file
3. Add your database connection string:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Replace with your actual credentials
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/infinite_properties?schema=public

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# File Upload
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Replace in DATABASE_URL:**
- `USERNAME` - Your PostgreSQL username (e.g., `postgres`)
- `PASSWORD` - Your PostgreSQL password
- `localhost` - Your host (if different, change it)
- `5432` - Your port (if different, change it)
- `infinite_properties` - Your database name

**Example:**
```
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/infinite_properties?schema=public
```

## Step 4: Test Connection (Optional)

You can test the connection in pgAdmin 4:
1. Right-click on the `infinite_properties` database
2. Select "Query Tool"
3. Run: `SELECT version();`
4. If it returns PostgreSQL version, connection is working!

## Step 5: Install Dependencies

```bash
cd server
npm install
```

## Step 6: Run Prisma Migrations

This will create all the tables in your database:

```bash
npx prisma migrate dev --name init
```

This command will:
- Create all tables based on the Prisma schema
- Set up relationships and indexes
- Generate the Prisma Client

## Step 7: Verify Database Setup

1. **In pgAdmin 4:**
   - Refresh the `infinite_properties` database
   - Expand "Schemas" → "public" → "Tables"
   - You should see all the tables created:
     - User
     - Property
     - Location
     - DeveloperInfo
     - PropertyAmenity
     - Testimonial
     - PropertyMedia
     - CuratedCollection
     - Reel
     - FeaturedProperty
     - FeaturedMedia
     - AboutUs
     - And related tables...

2. **Or use Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```
   This opens a visual database browser at `http://localhost:5555`

## Step 8: Start the Server

```bash
npm run dev
```

The server should start and connect to your database successfully!

## Troubleshooting

### Connection Error?
- Check if PostgreSQL service is running
- Verify username and password are correct
- Make sure the database `infinite_properties` exists
- Check if the port (5432) is correct

### Permission Error?
- Make sure your PostgreSQL user has CREATE privileges
- You might need to grant permissions in pgAdmin 4

### Migration Error?
- Make sure the database is empty (or drop and recreate it)
- Check that your DATABASE_URL is correct in .env
- Try: `npx prisma migrate reset` (WARNING: This deletes all data)

## Quick Commands Reference

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Open Prisma Studio (visual database browser)
npm run prisma:studio

# Reset database (deletes all data!)
npm run prisma:reset
```

## Next Steps

Once the database is set up:
1. Start the server: `npm run dev`
2. Test the API endpoints
3. Create your first admin user via `/api/auth/register`


