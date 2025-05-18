'use client';
import type { TElement } from '@udecode/plate';
import { CopilotPlugin } from '@udecode/plate-ai/react';
import { serializeMd, stripMarkdown } from '@udecode/plate-markdown';

import { GhostText } from '@/components/ui/ghost-text';

import { markdownPlugin } from './markdown-plugin';

export const copilotPlugins = [
  markdownPlugin,
  CopilotPlugin.configure(({ api }) => ({
    options: {
      completeOptions: {
        api: '/api/ai/copilot',
        body: {
          system: `You are an advanced AI writing assistant for medical reports. Your task is to assist the user in writing a medical report by providing suggestions and completing sentences. You should focus on clarity, conciseness, and relevance to the medical field. Always ensure that your suggestions are medically accurate and appropriate for the context.`,
          apiKey: 'SUA_OPENAI_KEY',
          model: 'gpt-4',
        },
        onError: () => {
          console.error("❌ Erro ao se comunicar com a OpenAI");
        },
        onFinish: (_, completion) => {
          if (completion === '0') return;

          api.copilot.setBlockSuggestion({
            text: stripMarkdown(completion),
          });
        },
      },
      debounceDelay: 500,
      renderGhostText: GhostText,
      getPrompt: ({ editor }) => {
        const contextEntry = editor.api.block({ highest: true });

        if (!contextEntry) return '';

        const prompt = serializeMd(editor, {
          value: [contextEntry[0] as TElement],
        });

        return `Continue the text up to the next punctuation mark:
  """
  ${prompt}
  """`;
      },
    },
  })),
] as const;
