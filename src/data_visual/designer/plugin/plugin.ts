import {EventBus} from '../../shared/core/event/event.bus';

export interface IPlugin {
  listen(eventBus: EventBus);
}
