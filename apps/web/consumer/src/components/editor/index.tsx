import { Toaster } from 'sonner';

import { PlateEditor } from '@/components/editor/plate-editor';
import { SettingsProvider } from '@/components/editor/settings';

export default function Editor() {
  return (
    <div className="">
      <SettingsProvider>
        <PlateEditor/>
      </SettingsProvider>

      <Toaster />
    </div>
  );
}
