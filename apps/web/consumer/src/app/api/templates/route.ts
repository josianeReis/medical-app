import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const templatesDir = path.join(process.cwd(), 'src/templates');
  const files = fs.readdirSync(templatesDir);

  const templates = files.map((file) => {
    const content = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
    const json = JSON.parse(content);
    return { id: json.id, title: json.title, content: json.content };
  });

  return NextResponse.json(templates);
}
