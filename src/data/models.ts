export const types = ['GPT-3', 'Codex'] as const;

export type ModelType = (typeof types)[number];

export interface Model<Type = string> {
  id: string;
  name: string;
  description: string;
  strengths?: string;
  type: Type;
}

export const models: Model<ModelType>[] = [
  {
    id: 'c305f976-8e38-42b1-9fb7-d21b2e34f0da',
    name: 'text-davinci-003',
    description:
      'Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following.',
    type: 'GPT-3',
    strengths:
      'Complex intent, cause and effect, creative generation, search, summarization for audience',
  },
  // Add more models as needed
];
