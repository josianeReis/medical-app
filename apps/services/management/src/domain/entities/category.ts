import { category, procedureCategories } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';

export type Category = InferSelectModel<typeof category>;
export type ProcedureCategory = InferSelectModel<typeof procedureCategories>;
