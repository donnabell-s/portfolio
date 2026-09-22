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

async function seedSampleProjects() {
  const existing = await db.query.projects.findFirst();
  if (existing) {
    console.log('Projects table already has data, skipping sample seed.');
    return;
  }

  const [sample] = await db
    .insert(projects)
    .values({
      slug: 'sample-project',
      title: 'Sample Project',
      summary: 'A placeholder case study — replace with a real project.',
      role: 'Full-stack developer',
      problem: 'Describe the problem this project solved.',
      approach: 'Describe the approach and key technical decisions.',
      outcome: 'Describe the measurable outcome or what was learned.',
      techStack: ['Node.js', 'Next.js', 'PostgreSQL'],
      year: new Date().getFullYear(),
      repoUrl: 'https://github.com/your-username/sample-project',
      coverImage: '/projects/sample-project/cover.svg',
      status: 'draft',
      featured: false,
      sortOrder: 0,
    })
    .returning();

  await db.insert(projectImages).values({
    projectId: sample.id,
    path: '/projects/sample-project/cover.svg',
    alt: 'Sample project screenshot',
    sortOrder: 0,
  });

  console.log(`Seeded sample project: ${sample.slug}`);
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
