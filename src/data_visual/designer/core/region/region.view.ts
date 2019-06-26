import { View } from '../structure/view';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/internal/operators';
import { closestNum } from '../../utils/common';
import { Region } from './region';
import { CoordinatesAndDimensions } from '../interface';
import { RegionModel } from './region.model';
import { contextMenuHelper, ContextMenuItem } from '../../helper/context.menu.helper';
import { resizeTipHelper } from '../../helper/resize.tip.helper';

type IContextMenuGenerator = () => Array<ContextMenuItem | 'split'>;

export abstract class RegionView extends View {
  protected _controller: Region;
  protected _model: RegionModel;

  $fill: JQuery;
  protected _$mover: JQuery;

  private _contextMenuGenerator: IContextMenuGenerator;

  set contextMenuGenerator(generator: IContextMenuGenerator) {
    this._contextMenuGenerator = generator;
  }

  abstract init();

  abstract accept(model: RegionModel);

  abstract refresh();

  protected _bindEventForResize() {
    let offsetX, offsetY,
      scale = 1,
      offset: JQuery.Coordinates,
      snapshot: CoordinatesAndDimensions,
      which: string,
      subscription: Subscription;

    // 进行缩放转换
    const
      getReal = (num) => Math.round(num / scale),
      model = this._model,
      handleResize = (pageX, pageY) => {
        switch (which) {
          case 'resize-left':
            if (pageX < (offset.left + snapshot.width)) {
              offsetX = closestNum(getReal(pageX - offset.left));
              model.left = snapshot.left + offsetX;
              model.width = snapshot.width - offsetX;
            }
            break;
          case 'resize-top':
            if (pageY < (offset.top + snapshot.height)) {
              offsetY = closestNum(getReal(pageY - offset.top));
              model.top = snapshot.top + offsetY;
              model.height = snapshot.height - offsetY;
            }
            break;
          case 'resize-right':
            if (pageX > offset.left) {
              model.width = closestNum(getReal(pageX - offset.left));
            }
            break;
          case 'resize-topLeft':
            if (pageY < (offset.top + snapshot.height) && pageX < (offset.left + snapshot.width)) {
              offsetX = closestNum(getReal(pageX - offset.left)),
                offsetY = closestNum(getReal(pageY - offset.top));
              model.setCoordinates(snapshot.left + offsetX, snapshot.top + offsetY);
              model.setDimensions(snapshot.width - offsetX, snapshot.height - offsetY);
            }
            break;
          case 'resize-topRight':
            if (pageY < (offset.top + snapshot.height)) {
              offsetY = closestNum(getReal(pageY - offset.top));
              model.top = snapshot.top + offsetY;
              model.height = snapshot.height - offsetY;
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
            if (pageX < (offset.left + snapshot.width)) {
              offsetX = closestNum(getReal(pageX - offset.left));
              model.left = snapshot.left + offsetX;
              model.width = snapshot.width - offsetX;
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
        if (subscription) {
          subscription.unsubscribe();
          subscription = null;
          document.removeEventListener('mouseup', dragEndHandler);
          this.$element.removeClass('no-transition');
          resizeTipHelper.hide();
          handleResize(event.pageX, event.pageY);
          this._eventTarget.dispatchEvent('resizeEnd');
        }
      };

    this.$element.find('div.u-resize>.draggable')
      .on('dragstart', ($event: JQuery.Event) => {
        scale = this._controller.page.scale;
        offset = this.$element.offset();
        snapshot = model.snapshot;
        which = (<HTMLElement>$event.currentTarget).dataset.which;
        resizeTipHelper.show($event.pageX, $event.pageY, model.width, model.height);
        this.$element.addClass('no-transition');

        // 监听鼠标移动
        subscription =
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
    let subscription: Subscription,
      scale,
      originPageX,
      originPageY,
      snapshot: JQuery.Coordinates,
      timeoutHandle;

    const model = this._model, dragEndHandler = (event: MouseEvent) => {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
        document.removeEventListener('mouseup', dragEndHandler);
        this.$element.removeClass('no-transition');
        resizeTipHelper.hide();
      }
    };

    this._$mover
      .on('dragstart', ($event: JQuery.Event) => {
        this.$element.addClass('no-transition');
        scale = this._controller.page.scale;
        originPageX = $event.pageX;
        originPageY = $event.pageY;
        snapshot = model.coordinates;
        resizeTipHelper.show(originPageX, originPageY, snapshot.left, snapshot.top);

        subscription = fromEvent(document, 'mousemove')
          .pipe(throttleTime(20))
          .subscribe((mouseEvent: MouseEvent) => {
            const offsetLeft = mouseEvent.pageX - originPageX,
              offsetTop = mouseEvent.pageY - originPageY;
            model.left = snapshot.left + Math.round(offsetLeft / scale);
            model.top = snapshot.top + Math.round(offsetTop / scale);
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
          this._eventTarget.dispatchEvent('ctrlSelect');
        } else {
          this._eventTarget.dispatchEvent('select');
        }

      })
      .on('dblclick', ($event: JQuery.Event) => {
        this._eventTarget.dispatchEvent('activateRegion');
      });
  }

  protected _bindContextEvent() {
    this._$mover.on('contextmenu', ($event: JQuery.Event) => {
      contextMenuHelper.open(this._contextMenuGenerator(), $event.pageX, $event.pageY, $event);
      return false;
    });
  }

  destroy() {
    this.$element.find('div.u-resize>.draggable').off('dragstart');
    this._$mover.off('dragstart click singleClick dblclick contextmenu');
    this.$element.remove();
    this._contextMenuGenerator = null;
    this._controller = null;
    this._model = null;
    super.destroy();
  }
}
