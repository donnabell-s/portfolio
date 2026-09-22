import 'dotenv/config';
import argon2 from 'argon2';
import { db } from './client.js';
import { adminUsers, projects, projectImages } from './schema.js';
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
      problem:
        'Most portfolio sites are static galleries — nothing on them is actually verifiable as the developer\'s own working code. I wanted something a recruiter could poke at that proves real backend, auth, and deployment skill, not just a list of claims.',
      approach:
        'Built as an npm-workspaces monorepo: a Next.js 16 App Router frontend and a separate Express/TypeScript API, sharing one Zod schema package for validation on both sides. Auth uses argon2 + a JWT in an httpOnly cookie; Neon Postgres is queried through Drizzle ORM. Because the frontend and API deploy as two separate *.vercel.app projects (no custom domain), a browser-side cookie can\'t be shared between them — the Next.js config rewrites /api/* to the API origin so the cookie stays first-party and CORS never enters the picture. The contact form is rate-limited against the database itself (no Redis needed) and layers a honeypot field with a signed minimum-fill-time token to filter bots without a CAPTCHA.',
      outcome:
        'A fully working, authenticated CMS running on entirely free hosting tiers (Vercel Hobby + Neon free tier), with the admin panel you\'d be looking at right now if you logged in. Update: replace this line with real numbers once the site has been live a while (uptime, messages received, etc.).',
      techStack: ['TypeScript', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM'],
      year: new Date().getFullYear(),
      repoUrl: 'https://github.com/your-username/portfolio',
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

async function main() {
  await seedAdmin();
  await seedSampleProjects();
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
