export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'GPT-4.1 Mini',
    description: 'Fast, all-purpose model',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Grok 3',
    description: 'Better for complex reasoning',
  },
];
