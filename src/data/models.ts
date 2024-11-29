export const types = [
  {
    value: 'gpt3',
    label: 'GPT-3',
  },
  {
    value: 'codex',
    label: 'Codex',
  },
] as const;

export const models = [
  {
    value: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
    type: 'gpt3',
  },
  {
    value: 'gpt-4',
    label: 'GPT-4',
    type: 'gpt3',
  },
] as const;

// Add proper types for the ModelSelector props
export interface ModelType {
  value: string;
  label: string;
}

export interface Model extends ModelType {
  type: string;
}
