import { IGraphicView } from '@barca/shared/core/graphic/graphic.view';
import { ViewEventTarget } from '@barca/shared/core/event/view.event';

export abstract class DefaultGraphicView implements IGraphicView {
  $element: JQuery;

  protected _event: ViewEventTarget = new ViewEventTarget();

  abstract update(option: any);

  updateConfig(config: any) {

  }

  updateData(data: any) {

  }

  updateTheme(theme: string) {
  }

  resize() {
  }

  activate() {
  }

  deactivate() {
  }

  addEventListener(eventName: string, callback: Function) {
    this._event.addEventListener(eventName, callback);
    return this;
  }

  removeEventListener(eventName: string, fn?: Function) {
    this._event.removeEventListener(eventName, fn);
    return this;
  }

  destroy() {
    if (this._event) {
      this._event.destroy();
      this._event = null;
    }
  }
}
