'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@packages/ui-components";

type Template = {
  id: string;
  title: string;
  content: string;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setTemplates(data);
    };
    fetchTemplates();
  }, []);

  const handleSelectTemplate = (template: { id: string; title: string; content: string }) => {
    localStorage.setItem("selectedTemplate", JSON.stringify(template));
    router.push("/create-report");
  };


  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Escolha um modelo de laudo</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleSelectTemplate(template)}
          >
            <CardHeader>
              <CardTitle className="text-xl">{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {template.content.replace(/\n/g, " ").slice(0, 300)}...
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
