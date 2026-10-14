# DKTE MBA Professional Clubs Association Website

A React + Vite starter that keeps the existing navy/white/gold visual direction and adds Supabase-backed public leadership and secure member administration.

## What is implemented in this delivery

- Responsive public landing page, clubs list, leadership directory, membership/rules/contact/privacy pages.
- Supabase email/password sign-in and password-reset email request.
- Admin route guard and database role check (`admin_roles`); database RLS is the real security boundary.
- Live dashboard metrics when Supabase is configured.
- Member list, search, add/edit form, photo preview/upload (JPG/PNG/WebP, 5 MB client-side cap), publish/draft and active/archive controls, delete confirmation.
- PostgreSQL schema, seed data, RLS policies, and image storage policies.
- Environment example and Vercel SPA rewrite.

## Important scope note

This is a working starter, not a fully finished production deployment. The admin Clubs, Events, Content and Settings routes are currently labelled scaffolds; gallery manager, announcements editor, audit-log UI, complete event CRUD, full club detail content, automated end-to-end tests, and the full original HTML section-by-section React migration still need implementation. No external Supabase project has been provisioned from this repository, and no build/test result is claimed here. Demo content from the source HTML should not be published as verified member data.

## Requirements

- Node.js 20 or later
- A Supabase project
- Git and a GitHub repository (for deployment)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with the Supabase project URL and publishable key from Supabase project settings. Do not put a service-role key in a Vite environment variable; all `VITE_` variables are shipped to the browser.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/migrations/0001_initial_schema.sql`.
3. Run `supabase/migrations/0002_storage_policies.sql`.
4. Run `supabase/seed.sql`.
5. In **Authentication → URL Configuration**, add your local URL (e.g. `http://localhost:5173`) and the production URL to the allowed redirect URLs.
6. Create the first administrator in **Authentication → Users** using a secure invitation or admin-created account. Copy that user's UUID.
7. In the SQL editor, assign the role to that UUID:

   ```sql
   insert into public.admin_roles(user_id, role)
   values ('PASTE_AUTH_USER_UUID', 'admin');
   ```

   Do not expose role assignment through public registration. Only trusted administrators should perform this bootstrap step.
8. Copy the Supabase project URL and publishable key into `.env.local`.
9. Restart `npm run dev`, then visit `/login`.

### Image storage

The migration creates public-read buckets `member-photos`, `event-media`, and `club-images`, with 5 MB limit for member images and 10 MB for other media. Public read means a file's URL can be viewed by anyone; uploads, updates and deletes require a role in `admin_roles`. If your college requires private photographs, switch to a private bucket and implement signed URL generation before launch.

### Security and privacy checklist before launch

- Review every RLS policy with a test anon user, an editor, and an admin.
- Decide whether editors should be allowed to delete or archive records; this starter grants `admin` and `editor` the same member CRUD permission.
- Confirm college approval for public profile photos and any personal details.
- Phone and email fields are never exposed by the current public directory query. Only publish contact details after explicit consent.
- Add server-side image validation/scanning if required by your deployment risk assessment.
- Add rate limiting/CAPTCHA if a public contact form is added.
- Back up the database and Storage before major changes.

## Build and deploy

```bash
npm run build
npm run preview
```

To deploy:
1. Push this project to GitHub.
2. Import the repository into Vercel.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel project environment variables.
4. Deploy. `vercel.json` rewrites application routes to `index.html` so direct refreshes work.
5. Test the public site and protected admin workflows on the deployed URL.

## Project structure

```text
src/
  components/Layout.jsx
  pages/PublicPages.jsx
  pages/AdminPages.jsx
  lib/supabase.js
  lib/format.js
  services/members.js
  main.jsx
  styles.css
supabase/
  migrations/0001_initial_schema.sql
  migrations/0002_storage_policies.sql
  seed.sql
```

## Original design source

The supplied HTML file remains separate as a reference. This starter re-creates key design elements in reusable React components rather than automatically converting every legacy section and interaction. Use the original HTML as the source of truth when completing the remaining public sections.
