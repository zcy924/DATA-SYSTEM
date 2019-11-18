import { ModelEventTarget, ViewEventTarget } from '@data-studio/shared';
import { RepaintMask, repaintMaskGenerator } from '../../../helper/mask.helper';
import { boxSelectHelper } from '../../../helper/box.select.helper';
import { ReportPageKernel } from './page.kernel';


const TEMPLATE = `
    <div class="report-region">
        <div class="report-canvas">
          <div class="report-box">
             <div class="report-grid">
               <div class="u-edit-mask">
                  <div class="mask mask-left" tabindex="-1"></div>
                  <div class="mask mask-right" tabindex="-1"></div>
                  <div class="mask mask-bottom" tabindex="-1"></div>
                  <div class="mask mask-top" tabindex="-1"></div>
                </div>
             </div>
          </div>
        </div>
    </div>
`;

export class PageView extends ViewEventTarget {

  // 视图元素
  $element: JQuery;
  private _$canvas: JQuery;
  private _$box: JQuery;
  $grid: JQuery;

  // 遮罩层重绘函数，根据当前选中的元素重绘遮罩层
  private _repaintMask: RepaintMask;

  private _scale = 1;
  private _width: number;
  private _height: number;

  constructor(private _page: ReportPageKernel) {
    super();
  }

  /**
   * 1、创建视图
   * 2、创建遮罩层重绘函数
   * 3、功能构建 设置$grid识别拖拽操作，打开框选功能
   * 4、事件绑定
   */
  init() {
    const $element = this.$element = $(TEMPLATE);

    this._$canvas = $element.find('.report-canvas');
    this._$box = $element.find('.report-box');
    this.$grid = $element.find('.report-grid');
    this.$grid.attr('draggable', 'true');

    this._repaintMask = repaintMaskGenerator($element.find('.u-edit-mask'));

    this._bindEvent();

    // 先解除事件绑定
    this.onDestroy(() => {
      this._$canvas = this._$box = this.$grid = null;
      this.$element.remove();
      this.$element = null;

      this._repaintMask = null;
    }, 2);
  }

  /**
   * 绘制遮罩层
   * @param $activatedRegion 突出现实的元素
   */
  repaintMask($activatedRegion: JQuery) {
    this.usable && this._repaintMask($activatedRegion);
  }


  /**
   * 获取画布相对于文档的偏移值
   * @returns {JQuery.Coordinates | undefined}
   */
  offset() {
    return this.$grid.offset();
  }

  get scale() {
    return this._scale;
  }

  set scale(param: number) {
    this._scale = param / 100;
    this._refresh();
  }

  /**
   * 监听页面模型变化
   * 页面对象销毁时 先销毁哪个 model or pageView
   * @param model
   */
  public accept(model: ModelEventTarget) {
    model.register('remove.backgroundClass', (key, oldValue, newValue) => {
      this._$box.removeClass('background1 background2 background3 background4');
    });
    model.register('add.backgroundClass backgroundClass', (key, oldValue, newValue) => {
      this._$box.removeClass(oldValue).addClass(newValue);
    });
    model.register('remove.backgroundCustom', (key, oldValue, newValue) => {
      this._$box.css({
        backgroundImage: `none`,
      });
    });
    model.register('add.backgroundCustom backgroundCustom', (key, oldValue, newValue) => {
      newValue.dataUrl && this._$box.css({
        backgroundImage: `url(${newValue.dataUrl})`,
      });
    });
    model.register('remove.backgroundColor', (key, oldValue, newValue) => {
      this._$box.css({
        backgroundColor: 'transparent',
      });
    });
    model.register('add.backgroundColor backgroundColor', (key, oldValue, newValue) => {
      this._$box.css({
        backgroundColor: newValue,
      });
    });
    model.register('auxiliaryLine', (key, oldValue, newValue) => {
      this.$grid.toggleClass('help-lines', newValue);
    });
    model.register('width add.width', (key, oldValue, newValue) => {
      this._width = newValue;
      this._refresh();
    });
    model.register('height add.height', (key, oldValue, newValue) => {
      this._height = newValue;
      this._refresh();
    });
  }

  /**
   * 进入全屏模式
   */
  enterFullScreen() {
    this.usable && this._$box[0].requestFullscreen();
  }

  /**
   * 更新 视图中画布大小
   * @private
   */
  private _refresh() {
    if (this._width && this._height) {
      this.$element.css({
        'width': this._width * this.scale + 50,
        'height': this._height * this.scale + 30,
      });
      this._$canvas.css({
        width: this._width * this.scale,
        height: this._height * this.scale,
      });
      this._$box.css('transform', `translate(-50%, -50%) scale(${this.scale})`);
      this.$grid.css({
        width: this._width,
        height: this._height,
      });
    }
  }

  /**
   * event transform
   * 事件绑定以及事件类型转换
   * editMask.click->deactivateRegion
   * grid.click->select
   * grid.contextmenu->rightClick
   * grid.dragstart/document.mousemove/document.mouseup->boxSelect
   * @private
   */
  private _bindEvent() {
    // 1、点击activate辅助元素事件转换
    let $editMask = this.$element.find('.u-edit-mask');
    $editMask.on('click', () => {
      this.dispatchEvent('deactivateRegion');
    });
    this.onDestroy(() => {
      $editMask.off('click');
      $editMask = null;
    }, 1);

    this.$grid
      .on('click', ($event) => {
        if ($event.target === this.$grid[0]) {
          this.dispatchEvent('select');
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
              width = (Math.abs(event.pageX - startPageX) + 2),
              height = (Math.abs(event.pageY - startPageY)) + 2);
          },
          mouseup = (event: MouseEvent) => {
            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
            boxSelectHelper.hide();
            this.dispatchEvent('boxSelect', left, top, width, height);
          };
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);

        boxSelectHelper.start($event.pageX, $event.pageY);
        return false;
      })
      .on('dragover', ($event: JQuery.Event) => {
        (<DragEvent>$event.originalEvent).dataTransfer.dropEffect = 'copyMove';
        $event.preventDefault();
      })
      .on('contextmenu', ($event: JQuery.Event) => {
        this.dispatchEvent('rightClick', $event);
        return false;
      });

    this.onDestroy(() => {
      this.$grid.off('click dragstart dragover contextmenu');
    }, 1);
  }
}
