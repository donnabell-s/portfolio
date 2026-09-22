import 'dotenv/config';
import argon2 from 'argon2';
import { db } from './client.js';
import { adminUsers, projects, projectImages, galleryImages } from './schema.js';
import { eq } from 'drizzle-orm';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin user');
  }

  const existing = await db.query.adminUsers.findFirst({ where: eq(adminUsers.email, email) });
  if (existing) {
    console.log(`Admin user ${email} already exists, skipping.`);
    return;
  }

  const passwordHash = await argon2.hash(password);
  await db.insert(adminUsers).values({ email, passwordHash });
  console.log(`Created admin user ${email}`);
}

/**
 * Seeds one genuine, honest case study: this portfolio site itself. Past
 * PHP/Django/.NET projects are deliberately NOT seeded with placeholder
 * content here — inventing case-study text for real past work would
 * misrepresent it. Add those through the admin panel once real
 * screenshots exist; the schema and UI already support it.
 */
async function seedSampleProjects() {
  const existing = await db.query.projects.findFirst();
  if (existing) {
    console.log('Projects table already has data, skipping sample seed.');
    return;
  }

  const [sample] = await db
    .insert(projects)
    .values({
      slug: 'this-portfolio',
      title: 'This Portfolio',
      summary:
        'A job-hunting portfolio that is itself the flagship project: a Node.js/Express API, a Next.js CMS-backed frontend, and Postgres — deployed for free.',
      role: 'Full-stack developer (solo)',
      description:
        'Most portfolio sites are static galleries — nothing on them is actually verifiable as the developer\'s own working code. I wanted something a recruiter could poke at that proves real backend, auth, and deployment skill, not just a list of claims.\n\n' +
        'Built as an npm-workspaces monorepo: a Next.js 16 App Router frontend and a separate Express/TypeScript API, sharing one Zod schema package for validation on both sides. Auth uses argon2 + a JWT in an httpOnly cookie; Neon Postgres is queried through Drizzle ORM. Because the frontend and API deploy as two separate *.vercel.app projects (no custom domain), a browser-side cookie can\'t be shared between them — the Next.js config rewrites /api/* to the API origin so the cookie stays first-party and CORS never enters the picture.\n\n' +
        'The result is a fully working, authenticated CMS running on entirely free hosting tiers (Vercel Hobby + Neon free tier), with the admin panel you\'d be looking at right now if you logged in.',
      techStack: ['TypeScript', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM'],
      year: new Date().getFullYear(),
      repoUrl: 'https://github.com/donnabell-s/portfolio',
      coverImage: '/projects/this-portfolio/cover.svg',
      status: 'published',
      featured: true,
      sortOrder: 0,
    })
    .returning();

  await db.insert(projectImages).values({
    projectId: sample.id,
    path: '/projects/this-portfolio/cover.svg',
    alt: 'Placeholder cover for this portfolio — swap for a real screenshot',
    sortOrder: 0,
  });

  console.log(`Seeded case study: ${sample.slug}`);
}

/**
 * Seeds one honest placeholder for the homepage Gallery section — reuses
 * the existing cover placeholder rather than inventing a photo. Swap for a
 * real image via the admin Gallery page whenever one exists.
 */
async function seedGallery() {
  const existing = await db.query.galleryImages.findFirst();
  if (existing) {
    console.log('Gallery already has data, skipping sample seed.');
    return;
  }

  await db.insert(galleryImages).values({
    path: '/gallery/placeholder-1.svg',
    title: 'Placeholder — add a real photo via the admin Gallery page',
    sortOrder: 0,
  });

  console.log('Seeded placeholder gallery image.');
}

async function main() {
  await seedAdmin();
  await seedSampleProjects();
  await seedGallery();
}

main()
  .then(() => {
    console.log('Seed complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
