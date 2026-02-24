import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { generateId } from "../../utils";
import { patient } from "../patient/patient-schema";

export const address = pgTable("address", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  patientId: text("patient_id")
    .notNull()
    .references(() => patient.id, { onDelete: "cascade" }),
  zipCode: text("zip_code").notNull(),
  street: text("street").notNull(),
  number: text("number"),
  complement: text("complement"),
  neighborhood: text("neighborhood"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
});

export const addressRelations = relations(address, ({ one }) => ({
  patient: one(patient, {
    fields: [address.patientId],
    references: [patient.id],
  }),
}));
