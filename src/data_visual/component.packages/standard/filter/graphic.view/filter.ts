import { IGraphicView,ViewEventTarget } from '@data-studio/shared';

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

  addEventListener(eventName: string, callback: (...params) => void) {
    this._event.addEventListener(eventName, callback);
    return this;
  }

  removeEventListener(eventName: string, fn?: (...params) => void) {
    this._event.removeEventListener(eventName, fn);
    return this;
  }
}
