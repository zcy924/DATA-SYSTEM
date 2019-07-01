import { IGraphicView } from '@barca/shared/core/graphic/graphic.view';
import { ViewEventTarget } from '@barca/shared';

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

  addEventListener(eventName: string, callback: (...params) => void) {
    this._event.addEventListener(eventName, callback);
    return this;
  }

  removeEventListener(eventName: string, fn?: (...params) => void) {
    this._event.removeEventListener(eventName, fn);
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
