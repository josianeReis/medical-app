import { Toaster } from 'sonner';
import { PlateEditor } from '@/components/editor/plate-editor';
import { SettingsProvider } from '@/components/editor/settings';
import { useEffect, useState } from 'react';

export default function Editor() {
  const [initialValue, setInitialValue] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("selectedTemplate");
    if (stored) {
      const parsed = JSON.parse(stored);
      setInitialValue(parsed.content);
      localStorage.removeItem("selectedTemplate");
    }
  }, []);

  return (
    <div className="">
      <SettingsProvider>
        <PlateEditor initialValue={initialValue} />
      </SettingsProvider>
      <Toaster />
    </div>
  );
}
