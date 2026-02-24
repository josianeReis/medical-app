ALTER TABLE "template" DROP CONSTRAINT "template_procedure_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "procedure" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "template" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "procedure" ADD CONSTRAINT "procedure_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_procedure_id_procedure_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."procedure"("id") ON DELETE cascade ON UPDATE no action;