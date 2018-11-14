import { View } from '../../structure/view';
import { PageConfig } from '../../../../shared/core/page/page.config';

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

export abstract class AbstractPageView extends View {

  $element: JQuery;
  protected readonly _$canvas: JQuery;
  protected readonly _$box: JQuery;
  $grid: JQuery;

  repaintMask: Function;

  private _scale = 1;
  private _width: number;
  private _height: number;

  protected constructor() {
    super();
    const $element = this.$element = $(TEMPLATE);

    this._$canvas = $element.find('.report-canvas');
    this._$box = $element.find('.report-box');
    this.$grid = $element.find('.report-grid');

    this._init();
  }

  protected abstract _init();

  contextMenuGenerator;

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

  public accept(model: PageConfig) {
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
      console.log(newValue);
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

  enterFullScreen() {
    this._$box[0].requestFullscreen();
  }

}
