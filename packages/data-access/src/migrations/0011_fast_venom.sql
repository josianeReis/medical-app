ALTER TABLE "patient" DROP CONSTRAINT "patient_user_id_unique";--> statement-breakpoint
ALTER TABLE "patient" DROP CONSTRAINT "patient_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "patient" DROP CONSTRAINT "patient_deleted_by_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "patient" DROP CONSTRAINT "patient_created_by_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "patient" DROP CONSTRAINT "patient_updated_by_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "terms" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "terms" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "deleted_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "patient" ADD COLUMN "deleted_by" text;--> statement-breakpoint
ALTER TABLE "patient" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patient" ADD COLUMN "updated_by" text;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_deleted_by_user_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_deleted_by_user_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN "is_deleted";--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN "deleted_by_id";--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN "created_by_id";--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN "updated_by_id";