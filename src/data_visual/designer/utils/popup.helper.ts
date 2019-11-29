import { componentManager } from '@data-studio/shared';
import { grabHelper } from './grab.helper';
import { session } from './session';

export class PopupHelper {
  private readonly _$element: JQuery;

  constructor(template: string) {
    this._$element = $(template);
    $('body').append(this._$element);

    this._init();
  }

  private _init() {
    const $element = this._$element;
    let componentPath: string;
    $element.mouseleave(() => {
      $element.hide();
    });
    $element.find('.btn-item.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        componentPath = (<HTMLElement>$event.target).dataset.componentPath;
        // attach
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
        grabHelper.show($event.pageX, $event.pageY, componentManager.getComponentMeta(componentPath).grabOption);

        return false;
      });

    const mouseMove = (event: MouseEvent) => {
      grabHelper.refresh(event.pageX, event.pageY);
    };
    const mouseUp = (event: MouseEvent) => {
      session.currentPage.createGraphic(componentPath,
        event.pageX - session.currentPage.offset.left - grabHelper.offsetX,
        event.pageY - session.currentPage.offset.top - grabHelper.offsetY);
      // detach
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
      grabHelper.hidden();
    };
  }

  show(left: number) {
    this._$element.css({ left }).show();
  }

  hide() {
    this._$element.hide();
  }
}
