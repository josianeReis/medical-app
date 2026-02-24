import { template } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';
import { Procedure } from './procedure';

export type Template = InferSelectModel<typeof template>;

export type TemplateWithProcedure = Template & {
	procedure?: Pick<Procedure, 'id' | 'name'> | null;
};
