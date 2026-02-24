CREATE TABLE "procedure" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" integer,
	"duration" integer,
	"equipament" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "procedure_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"procedure_id" text NOT NULL,
	"category_id" text NOT NULL,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "template" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"procedure_id" text,
	"content" text,
	"created_at" timestamp,
	"active" boolean,
	"organization_id" text
);
--> statement-breakpoint
ALTER TABLE "procedure_categories" ADD CONSTRAINT "procedure_categories_procedure_id_procedure_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."procedure"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procedure_categories" ADD CONSTRAINT "procedure_categories_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_procedure_id_organization_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;