import { procedure } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';
import { Category } from './category';

export type Procedure = InferSelectModel<typeof procedure>;

export type ProcedureWithCategory = Procedure & {
	category: Category | null;
};
