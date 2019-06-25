import { EventBus } from '@barca/shared';

export interface IPlugin {
  listen(eventBus: EventBus);
}
