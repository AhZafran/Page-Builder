# Supabase Setup Guide

This guide will help you set up Supabase for the Page Builder project.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create an account (if you haven't already)
2. Click "New Project"
3. Fill in your project details:
   - **Project Name**: page-builder (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Replace the placeholder values with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Run Database Migration

You have two options to create the database schema:

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click "New query"
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the migration

### Option B: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Step 5: Verify the Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see the `pages` table with these columns:
   - `id` (uuid, primary key)
   - `name` (text)
   - `slug` (text, nullable, unique)
   - `data` (jsonb)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

## Database Schema

The `pages` table stores all landing page data:

- **id**: Unique identifier for each page
- **name**: Display name of the page (e.g., "Homepage", "Product Launch")
- **slug**: URL-friendly identifier (e.g., "homepage", "product-launch")
- **data**: JSONB column containing the entire page layout (sections, blocks, styles)
- **created_at**: Timestamp when the page was created
- **updated_at**: Automatically updated timestamp when the page is modified

## Example Data Structure

Here's what the `data` column might look like:

```json
{
  "sections": [
    {
      "id": "section-1",
      "style": {
        "backgroundColor": "#ffffff",
        "padding": { "top": 32, "right": 16, "bottom": 32, "left": 16 }
      },
      "blocks": [
        {
          "id": "block-1",
          "type": "text",
          "content": "Welcome!",
          "style": { "fontSize": 32, "fontWeight": 700 }
        }
      ]
    }
  ]
}
```

## Next Steps

Once you've completed the setup:

1. Your application can now connect to Supabase
2. You can start saving and loading pages
3. Test the connection by creating a test page in your app

## Troubleshooting

**Connection Error**: Make sure your environment variables are correctly set in `.env.local` and restart your dev server.

**Migration Failed**: Check if you have the correct permissions and your database password is correct.

**CORS Issues**: The anon key should work for client-side requests. If you have issues, check your Supabase project's CORS settings.
