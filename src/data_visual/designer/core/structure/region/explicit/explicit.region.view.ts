import { RegionView } from '../region.view';
import { RegionModel, RegionState } from '../region.model';
import { Region } from '../region';

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

  private _refresh = () => {
  };

  constructor(protected _region: Region, protected _model: RegionModel) {
    super();
    const $element = this.$element = $(template);
    this.$fill = $element.find('.g-fill');
    this._$mover = $element.find('.u-mover');
  }

  /**
   * 事件绑定
   */
  init() {
    if (this._region.page.mode === 'design') {
      this._bindEvent();
    }
  }

  // 监听regionModel
  accept(model: RegionModel) {
    model
      .register('state', (key, oldValue, newValue, option) => {
        if (oldValue !== newValue) {
          switch (oldValue) {
            case RegionState.selected:
              this.$element.removeClass('selected');
              break;
            case RegionState.multiSelected:
              this.$element.removeClass('multi-selected');
              break;
            case RegionState.activated:
              this.$element.removeClass('activated');
          }
          switch (newValue) {
            case RegionState.default:
              this.$element.removeClass('selected multi-selected activated');
              break;
            case RegionState.selected:
              this.$element.addClass('selected');
              break;
            case RegionState.multiSelected:
              this.$element.addClass('multi-selected');
              break;
            case RegionState.activated:
              this.$element.addClass('activated');
              break;
          }
        }
      })
      .register('left top width height', (key, oldValue, newValue, option) => {
        this.refresh();
      })
      .register('z-index', (key, oldValue, newValue, option) => {
        this.$element.css('z-index', newValue);
      });

    this._refresh = () => {
      this.$element.css({
        width: model.width,
        height: model.height,
        left: model.left,
        top: model.top,
        zIndex: model.zIndex,
      });
      // 激活状态下需要更新辅助元素mask的状态
      if (model.state === RegionState.activated) {
        this._region.page.regionResize(this._region);
      }
    };
  }

  /**
   * 哪些情况下要进行视图刷新 将位置和维度更新到页面上
   *
   * 1、组件刚创建完成的时候
   */
  refresh() {
    this._refresh();
  }

  private _bindEvent() {
    this._bindEventForResize();
    this._bindEventForMover();
    this._bindContextEvent();
  }

  destroy() {
    this._refresh = null;
    super.destroy();
  }
}
