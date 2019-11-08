import { Region } from '../region';
import { RegionView } from '../region.view';
import { RegionModel, RegionState } from '../region.model';

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

  constructor(protected _region: Region, protected _model: RegionModel) {
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
}
