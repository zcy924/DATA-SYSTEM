class ResizeTipHelper {
  private _template = `
    <div class="u-tip u-tip-grid" style="transform: translate(0px,-50%);left:300px;top:300px;display: none;">
    <span></span>
    </div>`;

  private readonly _$element: JQuery;

  private _$span: JQuery;

  constructor() {
    this._$element = $(this._template);
    this._$span = this._$element.find('span');
  }

  show(left: number, top: number, width: number, height: number) {
    $('body').append(this._$element);
    this.refresh(left, top, width, height);
    this._$element.show();
  }

  refresh(left: number, top: number, width: number, height: number) {
    this._$element.css({
      left,
      top
    });
    this._$span.text(`${width} × ${height}`);
  }

  hide() {
    this._$element.hide();
  }
}

export const resizeTipHelper = new ResizeTipHelper();
