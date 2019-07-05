import { EventBus } from '@data-studio/shared';

export interface IPlugin {
  listen(eventBus: EventBus);
}
