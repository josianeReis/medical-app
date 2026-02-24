import { printMask } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';

export type PrintMask = InferSelectModel<typeof printMask>;
