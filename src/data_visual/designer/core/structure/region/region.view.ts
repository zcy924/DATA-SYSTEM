import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/internal/operators';
import { Region } from './region';
import { RegionModel } from './region.model';
import { contextMenuHelper, ContextMenuItem } from '../../helper/context.menu.helper';
import { resizeTipHelper } from '../../helper/resize.tip.helper';
import { Coordinates, Rectangle, ViewEventTarget } from '@barca/shared';
import { GraphicActionMove } from '../../operate/graphic.action.move';
import { GraphicActionResize } from '../../operate/graphic.action.resize';

type IContextMenuGenerator = () => Array<ContextMenuItem | 'split'>;

export abstract class RegionView extends ViewEventTarget {
  protected _region: Region;
  protected _model: RegionModel;

  $element: JQuery;
  $fill: JQuery;
  protected _$mover: JQuery;

  private _contextMenuGenerator: IContextMenuGenerator;

  set contextMenuGenerator(generator: IContextMenuGenerator) {
    this._contextMenuGenerator = generator;
  }

  protected constructor() {
    super();
    this.addSubscription(() => {
      this.$element.find('div.u-resize>.draggable').off('dragstart');
      this._$mover.off('dragstart click singleClick dblclick contextmenu');
      this.$element.remove();
      this._contextMenuGenerator = null;
      this._region = null;
      this._model = null;
    });
  }

  abstract init();

  abstract accept(model: RegionModel);

  abstract refresh();

  /**
   * 给region添加resize功能
   * @private
   */
  protected _bindEventForResize() {
    let mouseMoveSubscription: Subscription;

    // 进行缩放转换
    const
      dragEndHandler = (event: MouseEvent) => {
        if (mouseMoveSubscription) {
          mouseMoveSubscription.unsubscribe();
          mouseMoveSubscription = null;
          document.removeEventListener('mouseup', dragEndHandler);
          this.dispatchEvent('resizeEnd' , event.pageX, event.pageY);
        }
      };

    this.$element.find('div.u-resize>.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        this.dispatchEvent('resizeStart', $event.pageX, $event.pageY, (<HTMLElement>$event.currentTarget).dataset.which);
        // 监听鼠标移动
        mouseMoveSubscription =
          fromEvent(document, 'mousemove')
            .pipe(throttleTime(30))
            .subscribe((mouseEvent: MouseEvent) => {
              this.dispatchEvent('resizing', mouseEvent.pageX, mouseEvent.pageY);
            });
        // 解除对伸缩事件的监听
        document.addEventListener('mouseup', dragEndHandler);

        return false;
      });
    // 事件对象
  }

  /**
   * tips:
   * 1、被拖拽元素的z-index是否需要改变  以避免被其他高z-index的region覆盖
   * 2、如果要将一个region拖放到其他容器中，则当前region跟在鼠标后面移动的方式并不可行，因为drop事件会在被拖拽的元素上面触发
   * @private
   */
  protected _bindEventForMover() {
    let mouseMoveSubscription: Subscription,
      timeoutHandle;

    const dragEndHandler = (event: MouseEvent) => {
      if (mouseMoveSubscription) {
        mouseMoveSubscription.unsubscribe();
        mouseMoveSubscription = null;
        document.removeEventListener('mouseup', dragEndHandler);
        this.dispatchEvent('moveEnd', event.pageX, event.pageY);
      }
    };

    this._$mover
      .on('dragstart', ($event: JQuery.Event) => {
        this.dispatchEvent('moveStart', $event.pageX, $event.pageY);
        mouseMoveSubscription = fromEvent(document, 'mousemove')
        // .pipe(throttleTime(10))
          .subscribe((mouseEvent: MouseEvent) => {
            this.dispatchEvent('moving', mouseEvent.pageX, mouseEvent.pageY);
          });
        document.addEventListener('mouseup', dragEndHandler);
        return false;
      })
      .on('click', ($event: JQuery.Event) => {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        } else {
          timeoutHandle = setTimeout(() => {
            $($event.currentTarget).triggerHandler('singleClick', [$event]);
            timeoutHandle = null;
          }, 200);
        }
        $event.stopPropagation();
      })
      .on('singleClick', ($event: JQuery.Event, $singleClickEvent: JQuery.Event) => {
        if ($singleClickEvent.ctrlKey) {
          this.dispatchEvent('ctrlSelect');
        } else {
          this.dispatchEvent('select');
        }

      })
      .on('dblclick', ($event: JQuery.Event) => {
        this.dispatchEvent('activateRegion');
      });
  }

  protected _bindContextEvent() {
    this._$mover.on('contextmenu', ($event: JQuery.Event) => {
      contextMenuHelper.open(this._contextMenuGenerator(), $event.pageX, $event.pageY, $event);
      return false;
    });
  }
}
