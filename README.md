# Urbanwood Website

A Next.js website for Urbanwood furniture company.

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

4. Set up the PostgreSQL database:

```bash
# Generate the database schema
npm run db:generate

# Push the schema to your PostgreSQL database
npm run db:push
```

5. (Optional) If migrating from MongoDB, run the migration script:

```bash
npm run migrate-to-postgres
```

6. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database

This project uses PostgreSQL with DrizzleORM for data storage. Key database operations:

- `npm run db:generate` - Generate the database schema
- `npm run db:push` - Push schema changes to the database
- `npm run db:migrate` - Generate and run migrations

## API Routes

The application provides several API endpoints for managing categories, items, and images:

- `/api/get-category` - Get all categories or by slug
- `/api/get-category/[id]` - Get category by ID
- `/api/get-category/items/[category]` - Get items for a specific category
- `/api/post-category` - Create a new category
- `/api/post-category-item` - Create a new category item
- `/api/update-category/[id]` - Update a category
- `/api/update-category-item/[id]` - Update a category item
- `/api/upload-image` - Upload an image

## Deployment

Deploy on Vercel:

1. Connect your GitHub repository to Vercel
2. Add the environment variables in the Vercel project settings
3. Deploy!