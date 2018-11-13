import { contextMenuHelper } from '../../../../utils/contextMenu';
import { ReportPageInner } from './page.inner';
import { AbstractPageView } from './abstract.page.view';
import { repaintMaskGenerator } from '../../../helper/mask.helper';
import { boxSelectHelper } from '../../../helper/box.select.helper';


export class PageView extends AbstractPageView {


  private _contextMenuGenerator: Function;

  constructor(private _page: ReportPageInner) {
    super();

    this.repaintMask = repaintMaskGenerator(this.$element.find('.u-edit-mask'));
  }

  protected _init(){
    this.$grid.attr('draggable', 'true');
    this._bind();
  }

  set contextMenuGenerator(generator: Function) {
    this._contextMenuGenerator = generator;
  }

  // 试图到模型
  private _bind() {
    this._bindEvent();
    this._bindContextEvent();
  }

  private _bindEvent() {
    const eventTarget = this._eventTarget;
    this.$element.find('.u-edit-mask').on('click', () => {
      eventTarget.dispatchEvent('deactivateRegion');
    });

    this.$grid
      .on('click', ($event) => {
        if ($event.target === this.$grid[0]) {
          eventTarget.dispatchEvent('select');
        }
      })
      .on('dragstart', ($event: JQuery.Event) => {
        if (this._page.activateManager.regionActivated) {
          return false;
        }
        const startPageX = $event.pageX, startPageY = $event.pageY;
        let left: number, top: number, width: number, height: number;
        const
          mousemove = (event: MouseEvent) => {
            boxSelectHelper.show(
              left = Math.min(startPageX, event.pageX),
              top = Math.min(startPageY, event.pageY),
              width = Math.abs(event.pageX - startPageX),
              height = Math.abs(event.pageY - startPageY));
          },
          mouseup = (event: MouseEvent) => {
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            boxSelectHelper.hide();
            this._eventTarget.dispatchEvent('boxSelect', left, top, width, height);
          };
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);

        boxSelectHelper.start($event.pageX, $event.pageY);
        return false;
      })
      .on('dragover', ($event: JQuery.Event) => {
        (<DragEvent>$event.originalEvent).dataTransfer.dropEffect = 'copyMove';
        $event.preventDefault();
      });
  }

  private _bindContextEvent() {
    this.$grid.contextmenu(($event: JQuery.Event) => {
      if (this._contextMenuGenerator) {
        contextMenuHelper.open(this._contextMenuGenerator(), $event.pageX, $event.pageY, $event);
      }
      return false;
    });
  }


  destroy() {

  }
}
