import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/internal/operators';
import { Region } from './region';
import { RegionModel } from './region.model';
import { ViewEventTarget } from '@data-studio/shared';

export abstract class RegionView extends ViewEventTarget {
  protected _region: Region;
  protected _model: RegionModel;

  // 视图元素
  $element: JQuery;
  $fill: JQuery;
  protected _$mover: JQuery;

  /**
   * region view 的初始化工作，比如创建dom结构、事件转换等
   */
  abstract init();

  /**
   * 刷新视图
   */
  abstract refresh();

  /**
   * 给region添加resize功能 此方法内不做任何响应操作
   * draggable.dragstart->resizeStart
   * document.mousemove->resizing
   * document.mouseup->resizeEnd
   * @private
   */
  protected _bindEventForResize() {
    let mouseMoveSubscription: Subscription,
      draggable$ = this.$element.find('div.u-resize>.draggable'),
      dragEndHandler = (event: MouseEvent) => { //resize结束 解除事件绑定，触发resizeEnd事件
        if (mouseMoveSubscription) {
          mouseMoveSubscription.unsubscribe();
          mouseMoveSubscription = null;
          document.removeEventListener('mouseup', dragEndHandler);
          this.dispatchEvent('resizeEnd', event.pageX, event.pageY);
        }
      };

    draggable$
      .on('dragstart', ($event: JQuery.Event) => {
        this.dispatchEvent('resizeStart', $event.pageX, $event.pageY, (<HTMLElement>$event.currentTarget).dataset.which);
        // 监听鼠标移动
        mouseMoveSubscription =
          fromEvent(document, 'mousemove')
            .pipe(throttleTime(20))
            .subscribe((mouseEvent: MouseEvent) => {
              this.dispatchEvent('resizing', mouseEvent.pageX, mouseEvent.pageY);
            });
        // 解除对伸缩事件的监听
        document.addEventListener('mouseup', dragEndHandler);

        return false;
      });
    this.onDestroy(() => {
      // 此处释放局部变量，防止出现内存泄漏
      draggable$.off('dragstart');
      draggable$ = null;
      dragEndHandler = null;
    });
  }

  /**
   * tips:
   * 1、被拖拽元素的z-index是否需要改变  以避免被其他高z-index的region覆盖
   * 2、如果要将一个region拖放到其他容器中，则当前region跟在鼠标后面移动的方式并不可行，因为drop事件会在被拖拽的元素上面触发
   *
   * mover.dragstart->moveStart
   * document.mousemove->moving
   * document.mouseup->moveEnd
   * @private
   */
  protected _bindEventForMover() {
    let mouseMoveSubscription: Subscription,
      timeoutHandle,
      dragEndHandler = (event: MouseEvent) => {
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

    this.onDestroy(() => {
      if (mouseMoveSubscription) {
        mouseMoveSubscription.unsubscribe();
        mouseMoveSubscription = null;
        document.removeEventListener('mouseup', dragEndHandler);
      }
      dragEndHandler=null;

      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      }
      this._$mover.off('dragstart click singleClick dblclick');
    });
  }

  /**
   * 事件转换
   * contextmenu->rightClick
   * @private
   */
  protected _bindContextEvent() {
    this._$mover.on('contextmenu', ($event: JQuery.Event) => {
      this.dispatchEvent('rightClick', $event);
      return false;
    });
    this.onDestroy(() => {
      this._$mover.off('contextmenu');
    });
  }
}
