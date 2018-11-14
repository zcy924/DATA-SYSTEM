import {IGraphicView} from '../../graphic.view';
import { ViewEventTarget } from '../../../../designer/core/event/view.event';

export abstract class FilterNode implements IGraphicView {
  $element: JQuery;
  protected _event: ViewEventTarget = new ViewEventTarget();

  abstract resize();

  abstract update(option: any);

  updateConfig(config: any) {
  }

  updateData(data) {

  }

  updateTheme(theme: string) {
  }

  abstract activate();

  deactivate() {
  }

  abstract destroy();

  addEventListener(eventName: string, callback: Function) {
    this._event.addEventListener(eventName, callback);
    return this;
  }

  removeEventListener(eventName: string, fn?: Function) {
    this._event.removeEventListener(eventName, fn);
    return this;
  }
}
