import { env } from '@packages/data-access';
import puppeteer from 'puppeteer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { report, printMask } from '@packages/data-access/src/schema';
import { and, eq, isNull } from 'drizzle-orm';

async function generatePdf(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdfBuffer;
}

async function uploadPdf(buffer: Buffer, key: string): Promise<string> {
  const s3 = new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
    forcePathStyle: true,
  });
  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'application/pdf',
    }),
  );
  // Generate presigned URL valid for 7 days
  const presigned = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key }),
    { expiresIn: 60 * 60 * 24 * 7 },
  );
  return presigned;
}

async function processReports() {
  const client = new pg.Pool({ connectionString: env.DATABASE_URL });
  const db = drizzle(client);

  const pending = await db
    .select()
    .from(report)
    .where(and(eq(report.status, 'published'), isNull(report.pdfUrl)))
    .limit(10);

  for (const r of pending) {
    console.log('Processing report', r.id);
    const mask = await db
      .select()
      .from(printMask)
      .where(eq(printMask.id, r.printMaskId))
      .then((rows) => rows[0]);

    const html = `${mask?.headerHtml ?? ''}${r.htmlContent ?? ''}${mask?.footerHtml ?? ''}`;
    try {
      const pdfBuffer = await generatePdf(html);
      const key = `reports/${r.id}.pdf`;
      const url = await uploadPdf(pdfBuffer, key);
      await db
        .update(report)
        .set({ pdfUrl: url })
        .where(eq(report.id, r.id));
      console.log('Report', r.id, 'PDF generated');
    } catch (err) {
      console.error('Failed to generate PDF for report', r.id, err);
    }
  }

  await client.end();
}

processReports().then(() => {
  console.log('Worker finished');
  process.exit(0);
});