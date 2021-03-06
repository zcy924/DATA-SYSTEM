import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { RegionState } from '@data-studio/shared';
import { Region } from '../region';
import { RegionView } from '../region.view';
import { RegionModel } from '../region.model';



const template = `
<div class="m-dashbox">
  <div class="u-resize">
    <div class="resize-topLeft draggable" data-which="resize-topLeft" draggable="true"></div>
    <div class="resize-top draggable" data-which="resize-top" draggable="true"></div>
    <div class="resize-topRight draggable" data-which="resize-topRight" draggable="true"></div>
    <div class="resize-right draggable" data-which="resize-right" draggable="true"></div>
    <div class="resize-bottomRight draggable" data-which="resize-bottomRight" draggable="true"></div>
    <div class="resize-bottom draggable" data-which="resize-bottom" draggable="true"></div>
    <div class="resize-bottomLeft draggable" data-which="resize-bottomLeft" draggable="true"></div>
    <div class="resize-left draggable" data-which="resize-left" draggable="true"></div>
  </div>
  <div class="g-fill u-graphic droppable"></div>
  <div class="u-mover"  draggable="true"></div>
  </div>
`;

export class ExplicitRegionView extends RegionView {
  // 视图元素
  $element: JQuery;
  $fill: JQuery;
  private _$mover: JQuery;

  constructor(private _region: Region, private _model: RegionModel) {
    super();
  }

  /**
   * 建立关联关系
   * 1、创建视图
   * 2、根据运行模式，决定是否进行事件绑定，以响应用户操作
   * 3、销毁
   * 设计模式和运行模式  执行不同的初始逻辑
   * 事件绑定
   */
  init() {
    // 创建视图
    const $element = this.$element = $(template);
    this.$fill = $element.find('.g-fill');
    this._$mover = $element.find('.u-mover');

    if (this._region.page.mode === 'design') {
      this._bindEventForResize();
      this._bindEventForMover();
      this._bindContextEvent();
    }

    // 先调用父类的destroy方法
    this.onDestroy(() => {
      this.$fill = this._$mover = null;
      this.$element.remove();
      this.$element = null;
      this._region = this._model = null;
    }, 2);
  }

  /**
   * 哪些情况下要进行视图刷新 将位置和维度更新到页面上
   *
   * 1、组件刚创建完成的时候
   */
  refresh() {
    const { left, top, width, height, zIndex, state } = this._model;
    this.$element.css({
      left,
      top,
      width,
      height,
      zIndex,
    });

    // 激活状态下需要更新辅助元素mask的状态
    if (state === RegionState.activated) {
      this._region.page.regionResize(this._region);
    }
  }


  /**
   * 给region添加resize功能 此方法内不做任何响应操作
   * draggable.dragstart->resizeStart
   * document.mousemove->resizing
   * document.mouseup->resizeEnd
   * @private
   */
  private _bindEventForResize() {
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
  private _bindEventForMover() {
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
      dragEndHandler = null;

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
  private _bindContextEvent() {
    this._$mover.on('contextmenu', ($event: JQuery.Event) => {
      this.dispatchEvent('rightClick', $event);
      return false;
    });
    this.onDestroy(() => {
      this._$mover.off('contextmenu');
    });
  }
}
