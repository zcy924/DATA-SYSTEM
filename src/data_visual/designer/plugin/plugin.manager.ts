
import {IPage} from '../core/interface';
import {EventBus} from '../../shared/core/event/event.bus';
import { IPlugin } from './plugin';

export class PluginManager {
  constructor(private _page: IPage) {

  }

  register(plugin: IPlugin) {
    const eventBus = EventBus.getInstance(this._page);
    plugin.listen(eventBus);
  }

  registerPlugins(plugins: Array<IPlugin>) {
    const eventBus = EventBus.getInstance(this._page);
    plugins.forEach((plugin) => {
      plugin.listen(eventBus);
    });
  }

}
