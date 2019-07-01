import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/internal/operators';
import { closestNum } from '../../../utils/common';
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

  set contextMenuGenerator(generator: IContextMenuGenerator) {
    this._contextMenuGenerator = generator;
  }

  abstract init();

  abstract accept(model: RegionModel);

  abstract refresh();

  /**
   * 给region添加resize功能
   * @private
   */
  protected _bindEventForResize() {
    let offsetX, offsetY,
      scale = 1,
      offset: Coordinates,
      resizeStartRectangle: Rectangle,
      resizeStopRectangle: Rectangle,
      which: string,
      mouseMoveSubscription: Subscription;

    // 进行缩放转换
    const
      getReal = (num) => Math.round(num / scale),
      model = this._model,
      handleResize = (pageX, pageY) => {
        switch (which) {
          case 'resize-left':
            if (pageX < (offset.left + resizeStartRectangle.width)) {
              offsetX = closestNum(getReal(pageX - offset.left));
              model.left = resizeStartRectangle.left + offsetX;
              model.width = resizeStartRectangle.width - offsetX;
            }
            break;
          case 'resize-top':
            if (pageY < (offset.top + resizeStartRectangle.height)) {
              offsetY = closestNum(getReal(pageY - offset.top));
              model.top = resizeStartRectangle.top + offsetY;
              model.height = resizeStartRectangle.height - offsetY;
            }
            break;
          case 'resize-right':
            if (pageX > offset.left) {
              model.width = closestNum(getReal(pageX - offset.left));
            }
            break;
          case 'resize-topLeft':
            if (pageY < (offset.top + resizeStartRectangle.height) && pageX < (offset.left + resizeStartRectangle.width)) {
              offsetX = closestNum(getReal(pageX - offset.left)),
                offsetY = closestNum(getReal(pageY - offset.top));
              model.coordinates = {
                left: resizeStartRectangle.left + offsetX,
                top: resizeStartRectangle.top + offsetY,
              };
              model.dimensions = {
                width: resizeStartRectangle.width - offsetX, height: resizeStartRectangle.height - offsetY,
              };
            }
            break;
          case 'resize-topRight':
            if (pageY < (offset.top + resizeStartRectangle.height)) {
              offsetY = closestNum(getReal(pageY - offset.top));
              model.top = resizeStartRectangle.top + offsetY;
              model.height = resizeStartRectangle.height - offsetY;
            }
            if (pageX > offset.left) {
              model.width = closestNum(getReal(pageX - offset.left));
            }
            break;
          case 'resize-bottomRight':
            if (pageX > offset.left) {
              model.width = getReal(pageX - offset.left);
            }
            if (pageY > offset.top) {
              model.height = getReal(pageY - offset.top);
            }
            break;
          case 'resize-bottomLeft':
            if (pageX < (offset.left + resizeStartRectangle.width)) {
              offsetX = closestNum(getReal(pageX - offset.left));
              model.left = resizeStartRectangle.left + offsetX;
              model.width = resizeStartRectangle.width - offsetX;
            }
            if (pageY > offset.top) {
              model.height = getReal(pageY - offset.top);
            }
            break;
          case 'resize-bottom':
            if (pageY > offset.top) {
              model.height = getReal(pageY - offset.top);
            }
            break;
        }
      },
      dragEndHandler = (event: MouseEvent) => {
        if (mouseMoveSubscription) {
          mouseMoveSubscription.unsubscribe();
          mouseMoveSubscription = null;
          document.removeEventListener('mouseup', dragEndHandler);
          this.$element.removeClass('no-transition');
          resizeTipHelper.hide();
          handleResize(event.pageX, event.pageY);
          resizeStopRectangle = model.rectangle;
          this._region.page.actionManager.execute(new GraphicActionResize(this._region, resizeStartRectangle, resizeStopRectangle));
          this.dispatchEvent('resizeEnd');
        }
      };

    this.$element.find('div.u-resize>.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        scale = this._region.page.scale;
        offset = this.$element.offset();
        resizeStartRectangle = model.rectangle;
        which = (<HTMLElement>$event.currentTarget).dataset.which;
        resizeTipHelper.show($event.pageX, $event.pageY, model.width, model.height);
        this.$element.addClass('no-transition');

        // 监听鼠标移动
        mouseMoveSubscription =
          fromEvent(document, 'mousemove')
            .pipe(throttleTime(30))
            .subscribe((mouseEvent: MouseEvent) => {
              handleResize(mouseEvent.pageX, mouseEvent.pageY);
              resizeTipHelper.refresh(mouseEvent.pageX, mouseEvent.pageY, model.width, model.height);
              this.refresh();
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
      moveStartCoordinates: Coordinates,
      moveStopCoordinates: Coordinates,
      timeoutHandle;

    const model = this._model, dragEndHandler = (event: MouseEvent) => {
      if (mouseMoveSubscription) {
        mouseMoveSubscription.unsubscribe();
        mouseMoveSubscription = null;
        document.removeEventListener('mouseup', dragEndHandler);
        this.$element.removeClass('no-transition');
        resizeTipHelper.hide();
        this._region.page.actionManager.execute(new GraphicActionMove(this._region, moveStartCoordinates, moveStopCoordinates));
      }
    };

    this._$mover
      .on('dragstart', ($event: JQuery.Event) => {
        this.$element.addClass('no-transition');
        const scale = this._region.page.scale;
        let { pageX: originPageX, pageY: originPageY } = $event;
        moveStartCoordinates = model.coordinates;
        resizeTipHelper.show(originPageX, originPageY, moveStartCoordinates.left, moveStartCoordinates.top);

        mouseMoveSubscription = fromEvent(document, 'mousemove')
          .pipe(throttleTime(20))
          .subscribe((mouseEvent: MouseEvent) => {
            model.left = moveStartCoordinates.left + ((mouseEvent.pageX - originPageX) / scale);
            model.top = moveStartCoordinates.top + ((mouseEvent.pageY - originPageY) / scale);
            moveStopCoordinates = {
              left: model.left,
              top: model.top,
            };
            this.refresh();
            resizeTipHelper.refresh(mouseEvent.pageX, mouseEvent.pageY, model.left, model.top);
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
