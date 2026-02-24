import { report } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';

export type Report = InferSelectModel<typeof report>;
