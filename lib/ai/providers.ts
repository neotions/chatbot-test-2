import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { deepseek } from '@ai-sdk/deepseek';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

// export const myProvider = isTestEnvironment
//   ? customProvider({
//       languageModels: {
//         'chat-model': chatModel,
//         'chat-model-reasoning': reasoningModel,
//         'title-model': titleModel,
//         'artifact-model': artifactModel,
//       },
//     })
//   : customProvider({
//       languageModels: {
//         'chat-model': xai('grok-2-vision-1212'),
//         'chat-model-reasoning': wrapLanguageModel({
//           model: xai('grok-3-mini-beta'),
//           middleware: extractReasoningMiddleware({ tagName: 'think' }),
//         }),
//         'title-model': xai('grok-2-1212'),
//         'artifact-model': xai('grok-2-1212'),
//       },
//       imageModels: {
//         'small-model': xai.image('grok-2-image'),
//       },
//     });


export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
        languageModels: {
            'chat-model': anthropic('claude-3-5-sonnet-20241022'),
            'chat-model-reasoning': 
                wrapLanguageModel({
                    model: xai('grok-3-mini-beta'),
                    middleware: extractReasoningMiddleware({ tagName: 'think' }),
            }),
            'title-model': anthropic('claude-3-5-sonnet-20241022'),
            'artifact-model': anthropic('claude-3-5-sonnet-20241022'),
      },
    });