import { IGraphicView } from '@barca/shared/core/graphic/graphic.view';
import { ViewEventTarget } from '@barca/shared';

export abstract class HtmlNode implements IGraphicView {
  $element: JQuery;
  protected _event: ViewEventTarget = new ViewEventTarget();

  abstract resize();

  abstract init(option: any);

  abstract update(option: any);

  updateConfig(config: any) {
  }

  updateData(data) {
  }

  updateTheme(theme: string) {

  }

  refresh() {
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
