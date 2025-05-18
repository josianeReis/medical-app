import type { TextStreamPart, ToolSet } from 'ai';
import type { NextRequest } from 'next/server';

import { createOpenAI } from '@ai-sdk/openai';
import { delay as originalDelay } from '@ai-sdk/provider-utils';
import { convertToCoreMessages, streamText } from 'ai';
import { NextResponse } from 'next/server';

/**
 * Detects the first chunk in a buffer.
 */
export type ChunkDetector = (buffer: string) => string | null | undefined;

type delayer = (buffer: string) => number;

/**
 * Smooths text streaming output.
 */
function smoothStream<TOOLS extends ToolSet>({
  _internal: { delay = originalDelay } = {},
  chunking = 'word',
  delayInMs = 10,
}: {
  _internal?: {
    delay?: (delayInMs: number | null) => Promise<void>;
  };
  chunking?: ChunkDetector | RegExp | 'line' | 'word';
  delayInMs?: delayer | number | null;
} = {}): (options: {
  tools: TOOLS;
}) => TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>> {
  let detectChunk: ChunkDetector;

  if (typeof chunking === 'function') {
    detectChunk = chunking;
  } else {
    const chunkingRegex =
      typeof chunking === 'string' ? CHUNKING_REGEXPS[chunking] : chunking;

    detectChunk = (buffer) => {
      const match = chunkingRegex.exec(buffer);
      if (!match) return null;
      return buffer.slice(0, match.index) + match?.[0];
    };
  }

  return () => {
    let buffer = '';

    return new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      async transform(chunk, controller) {
        if (chunk.type !== 'text-delta') {
          if (buffer.length > 0) {
            controller.enqueue({ textDelta: buffer, type: 'text-delta' });
            buffer = '';
          }

          controller.enqueue(chunk);
          return;
        }

        buffer += chunk.textDelta;

        let match;

        while ((match = detectChunk(buffer)) != null) {
          controller.enqueue({ textDelta: match, type: 'text-delta' });
          buffer = buffer.slice(match.length);

          const _delayInMs =
            typeof delayInMs === 'number'
              ? delayInMs
              : (delayInMs?.(buffer) ?? 10);

          await delay(_delayInMs);
        }
      },
    });
  };
}

const CHUNKING_REGEXPS = {
  line: /\n+/m,
  list: /.{8}/m,
  word: /\S+\s+/m,
};

export async function POST(req: NextRequest) {
  const { apiKey: key, messages, system } = await req.json();

  const apiKey = key || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing OpenAI API key.' },
      { status: 401 }
    );
  }

  const openai = createOpenAI({ apiKey });

  try {
    const result = streamText({
      experimental_transform: smoothStream({
        chunking: 'word',
        delayInMs: 20,
      }),
      maxTokens: 2048,
      messages: convertToCoreMessages(messages),
      model: openai('gpt-4o'),
      system: system,
    });

    return result.toDataStreamResponse();
  } catch {
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
