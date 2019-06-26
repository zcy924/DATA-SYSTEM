const TEMPLATE = `
<div style="
background-color: rgba(5,157,255,0.31);
position:absolute;
left:300px;
top:300px;
border:2px rgba(5,127,217,0.80) dashed;
z-index: 999;
background-clip: content-box;
display: none;"></div>`;

/**
 * 框选辅助工具
 */
class BoxSelectHelper {
  private static _instance: BoxSelectHelper;

  private readonly _$element: JQuery;
  private _show = false;

  private constructor() {
    this._$element = $(TEMPLATE);
  }

  static getInstance() {
    if (!BoxSelectHelper._instance) {
      BoxSelectHelper._instance = new BoxSelectHelper();
    }
    return BoxSelectHelper._instance;
  }

  start(left: number, top: number) {
    $('body').append(this._$element);
    this._$element.css({ left, top, width: 0, height: 0 }).show();
    this._show = true;
  }

  show(left: number, top: number, width: number, height: number) {
    if (this._show) {
      this._$element.css({ left, top, width, height });
    }
  }

  hide() {
    this._$element.hide();
    this._show = false;
  }
}

export const boxSelectHelper = BoxSelectHelper.getInstance();
