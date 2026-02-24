import fs from 'node:fs';
import path from 'node:path';

import { and, eq } from 'drizzle-orm';
import { DbClientTransaction, schema } from '@packages/data-access';
import { generateId } from '../utils';

/**
 * Structure of the JSON template files located at
 * apps/web/consumer/src/templates/*.json
 */
interface TemplateJson {
  id: string;
  title: string;
  content: string;
}

/**
 * Reads every JSON template bundled with the web consumer application and seeds
 * the data-base with the corresponding rows in the `template` table.  A template
 * will be inserted only if there is not already another template with the same
 * name for the given organisation.  The function is intended to be executed
 * inside a database transaction.
 */
export async function seedTemplates(
  tx: DbClientTransaction,
  organizationId: string,
): Promise<void> {
  /*
   * Resolve the absolute path to the directory that contains all template JSON
   * files.  The compiled version of this file will live in `packages/data-access/dist/seeds`,
   * therefore we need to go four directories up to reach the repository root
   * and then navigate to the templates directory.
   */
  const templatesDir = path.resolve(
    __dirname,
    '../../../..', // → <repo-root>
    'apps/web/consumer/src/templates',
  );

  if (!fs.existsSync(templatesDir)) {
    console.warn(
      `⚠️  Diretório de templates não encontrado em ${templatesDir}. Pulando seed de templates.`,
    );
    return;
  }

  const files = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.json'));

  for (const filename of files) {
    const filePath = path.join(templatesDir, filename);

    const raw = fs.readFileSync(filePath, 'utf8');
    const { title, content } = JSON.parse(raw) as TemplateJson;

    // Skip when template already exists for the organisation.
    const [existing] = await tx
      .select()
      .from(schema.template)
      .where(
        and(
          eq(schema.template.name, title),
          eq(schema.template.organizationId, organizationId),
        ),
      );

    if (existing) continue;

    await tx.insert(schema.template).values({
      id: generateId(),
      name: title,
      content,
      organizationId,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log('✅ Templates inseridos com sucesso.');
} 