CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"path" text NOT NULL,
	"title" varchar(150) DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "description" text;
--> statement-breakpoint
UPDATE "projects" SET "description" = trim(
	coalesce("problem", '') ||
	CASE WHEN "approach" IS NOT NULL AND "approach" <> '' THEN E'\n\n' || "approach" ELSE '' END ||
	CASE WHEN "outcome" IS NOT NULL AND "outcome" <> '' THEN E'\n\n' || "outcome" ELSE '' END
);
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "description" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "problem";
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "approach";
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "outcome";
