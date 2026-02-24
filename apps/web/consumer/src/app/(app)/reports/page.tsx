'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Template = {
  id: string;
  title: string;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setTemplates(data);
    };
    fetchTemplates();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Escolha um modelo de laudo</h1>
      <ul className="space-y-2">
        {templates.map((template) => (
          <li key={template.id}>
            <Link href={`/edit/${template.id}`} className="text-blue-600 underline">
              {template.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
