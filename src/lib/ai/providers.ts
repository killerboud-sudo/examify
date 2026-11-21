import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

export type ProviderId = 'claude' | 'gemini' | 'openai';
type Provider = { label: string; envKey: string; model: () => LanguageModel };

export const PROVIDERS: Record<ProviderId, Provider> = {
  claude: { label: 'Claude', envKey: 'ANTHROPIC_API_KEY', model: () => anthropic(process.env.CLAUDE_MODEL ?? 'claude-sonnet-5-5') },
  gemini: { label: 'Gemini', envKey: 'GOOGLE_GENERATIVE_AI_API_KEY', model: () => google(process.env.GEMINI_MODEL ?? 'gemini-2.5-flash') },
  openai: { label: 'ChatGPT', envKey: 'OPENAI_API_KEY', model: () => openai(process.env.OPENAI_MODEL ?? 'gpt-4o') },
};

export const enabledProviders = () =>
  (Object.keys(PROVIDERS) as ProviderId[]).filter((id) => !!process.env[PROVIDERS[id].envKey]);
