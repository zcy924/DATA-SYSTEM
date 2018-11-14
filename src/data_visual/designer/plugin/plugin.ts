import {EventBus} from '../core/event/event.bus';

export interface IPlugin {
  listen(eventBus: EventBus);
}
