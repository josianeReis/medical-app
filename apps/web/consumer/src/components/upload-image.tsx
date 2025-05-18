"use client";

import { Button, Input } from "@packages/ui-components";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1584395630827-860eee694d7b",
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
  "https://images.unsplash.com/photo-1493612276216-ee3925520721",
  "https://images.unsplash.com/photo-1533228100845-08145b01de14",
  "https://images.unsplash.com/photo-1428263197823-ce6a8620d1e1",
  "https://images.unsplash.com/photo-1424746219973-8fe3bd07d8e3",
  "https://images.unsplash.com/photo-1422207109431-97544339f995",
  "https://images.unsplash.com/photo-1431184052543-809fa8cc9bd6",
  


];

export function UploadImage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  function handleChooseFile(){
    if (!fileInputRef.current) return;

    fileInputRef.current.click();
  }

  function toggleImage(url: string) {
    setSelectedImages((prev) =>
      prev.includes(url) ? prev.filter((img) => img !== url) : [...prev, url]
    );
  }

  function handleChange() {
    if (!fileInputRef.current) return;

    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file) return;

    fileInput.value = "";
  }

  return (
    
    <div className="flex flex-row gap-2">
        <Button onClick={handleChooseFile} type='button'>
            <Upload/>
            Upload images
        </Button>
        <Input
              onChange={handleChange}
              ref={fileInputRef}
              className="hidden"
              name="file"
              type="file"
              accept="image/*"
            />
      {images.map((url) => {
        return (
          <div
            key={url}
            className="relative w-[80px] h-[80px] overflow-hidden rounded border group"
          >
            <Image
              src={url}
              alt="Imagem de exame"
              width={80}
              height={80}
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-300"
            />

            <input
              type="checkbox"
              checked={selectedImages.includes(url)}
              onChange={() => toggleImage(url)}
              className="absolute top-1 left-1 w-4 h-4 appearance-none rounded-full border border-white bg-white checked:bg-blue-600 checked:border-blue-600 flex items-center justify-center cursor-pointer"
            />

            {selectedImages.includes(url) && (
                <div className="absolute top-1 left-1 w-4 h-4 flex items-center justify-center text-white text-[10px] font-bold pointer-events-none">
                ✓
                </div>
            )}
            
            
           
          </div>
        );
      })}
    </div>
  );
}
