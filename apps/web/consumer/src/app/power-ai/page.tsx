"use client";

import { useState } from "react";
import { Button } from "@packages/ui-components";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecione um arquivo primeiro!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); 

    try {
      const response = await fetch("http://localhost:8000/upload_txt/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Upload feito com sucesso!");
      } else {
        alert("Erro no upload.");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Falha ao fazer upload.");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>{t("title")}</h1>

        <input type="file" onChange={handleFileChange} />
        <Button variant="destructive" onClick={handleUpload}>
          Upload file
        </Button>
      </main>
    </div>
  );
}
