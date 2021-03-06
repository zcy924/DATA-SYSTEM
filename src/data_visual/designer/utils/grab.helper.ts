const grabTemplate = `
<div class="m-chart-grabbing"
 style="width: 300px; height: 200px;
 background-color: rgb(36, 148, 232);
 background-image: url('https://ydcdn.nosdn.127.net/dash-online/img/holder-automatic.8f656e5b7d.svg');
 background-size: 320px 224px;">
 <div class="g-grab-fill"></div>
 <div class="g-grab-fill u-mover"></div>
 </div>
`;

class GrabHelper {
  private readonly _$element: JQuery;

  // 辅助元素是否添加到dom树中
  private _visible = false;
  private _offsetX;
  private _offsetY;
  private _defaultOption = {
    width: 300,
    height: 200,
    backgroundImage: 'url("https://ydcdn.nosdn.127.net/dash-online/img/holder-automatic.8f656e5b7d.svg")',
    backgroundSize: '320px 224px',
  };

  constructor(template: string) {
    this._$element = $(template);
  }

  get offsetX() {
    return this._offsetX;
  }

  get offsetY() {
    return this._offsetY;
  }

  /**
   *
   * @param left
   * @param top
   * @param option
   */
  show(left: number, top: number, option?: { width: number, height: number, backgroundImage: string }) {
    const targetOption = option || this._defaultOption;
    this._offsetX = targetOption.width / 2;
    this._offsetY = targetOption.height / 2;
    this._$element.css(Object.assign({ backgroundSize: `${targetOption.width}px ${targetOption.height}px` }, targetOption));
    if (!this._visible) {
      $('body').append(this._$element);
      this._visible = true;
    }
    this._$element.css({
      left: left - this.offsetX,
      top: top - this.offsetY,
    });
  }

  /**
   * 给定鼠标位置 刷新浮动层位置
   * @param left event.pageX
   * @param top event.pageY
   */
  refresh(left: number, top: number) {
    this._$element.css({
      left: left - this.offsetX,
      top: top - this.offsetY,
    });
  }

  /**
   * 隐藏浮动层
   */
  hidden() {
    this._offsetX = this._offsetY = 0;
    this._$element.detach();
    this._visible = false;
  }
}

export const grabHelper = new GrabHelper(grabTemplate);
