import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
  inet,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const projectStatusEnum = pgEnum('project_status', ['draft', 'published']);

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 200 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  title: varchar('title', { length: 120 }).notNull(),
  summary: varchar('summary', { length: 280 }).notNull(),
  role: varchar('role', { length: 120 }).notNull(),
  description: text('description').notNull(),
  techStack: text('tech_stack').array().notNull().default([]),
  year: integer('year').notNull(),
  repoUrl: text('repo_url').notNull(),
  liveUrl: text('live_url'),
  coverImage: text('cover_image').notNull(),
  status: projectStatusEnum('status').notNull().default('draft'),
  featured: boolean('featured').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const projectImages = pgTable('project_images', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  alt: varchar('alt', { length: 200 }).notNull(),
  caption: varchar('caption', { length: 300 }),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const galleryImages = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  path: text('path').notNull(),
  title: varchar('title', { length: 150 }).notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 200 }).notNull(),
  subject: varchar('subject', { length: 150 }).notNull(),
  body: text('body').notNull(),
  ip: inet('ip'),
  userAgent: text('user_agent'),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  images: many(projectImages),
}));

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}));
