ALTER TABLE "category" RENAME COLUMN "parentId" TO "parent_id";--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT "category_parentId_category_id_fk";
--> statement-breakpoint
ALTER TABLE "template" DROP CONSTRAINT "template_procedure_id_procedure_id_fk";
--> statement-breakpoint
ALTER TABLE "patient" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "procedure" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "procedure" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "procedure" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "procedure" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "procedure_categories" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "procedure_categories" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "template" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "template" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "template" ALTER COLUMN "active" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "template" ALTER COLUMN "active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "template" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "template" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patient_document" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "procedure" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "procedure" ADD COLUMN "updated_by" text;--> statement-breakpoint
ALTER TABLE "procedure" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "procedure" ADD COLUMN "deleted_by" text;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "updated_by" text;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "deleted_by" text;--> statement-breakpoint
ALTER TABLE "template" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "template" ADD COLUMN "updated_by" text;--> statement-breakpoint
ALTER TABLE "template" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "template" ADD COLUMN "deleted_by" text;--> statement-breakpoint
ALTER TABLE "procedure" ADD CONSTRAINT "procedure_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procedure" ADD CONSTRAINT "procedure_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procedure" ADD CONSTRAINT "procedure_deleted_by_user_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_parent_id_category_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_deleted_by_user_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_deleted_by_user_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_procedure_id_procedure_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."procedure"("id") ON DELETE no action ON UPDATE no action;