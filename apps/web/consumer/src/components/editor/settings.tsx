'use client';

import * as React from 'react';

interface Model {
  label: string;
  value: string;
}

interface SettingsContextType {
  keys: Record<string, string>;
  model: Model;
  setModel: (model: Model) => void;
}

export const models: Model[] = [
  { label: 'gpt-4o-mini', value: 'gpt-4o-mini' },
  { label: 'gpt-4o', value: 'gpt-4o' },
  { label: 'gpt-4-turbo', value: 'gpt-4-turbo' },
  { label: 'gpt-4', value: 'gpt-4' },
  { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
  { label: 'gpt-3.5-turbo-instruct', value: 'gpt-3.5-turbo-instruct' },
];

const SettingsContext = React.createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [keys] = React.useState({
    openai: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    uploadthing: '',
  });

  const [model, setModel] = React.useState<Model>(models[0]);

  return (
    <SettingsContext.Provider value={{ keys, model, setModel }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = React.useContext(SettingsContext);

  return (
    context ?? {
      keys: {
        openai: '',
        uploadthing: '',
      },
      model: models[0],
      setModel: () => {},
    }
  );
}
