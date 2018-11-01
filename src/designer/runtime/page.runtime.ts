import { RegionRuntime } from './region.runtime';
import { PageConfig } from '../components/page.config/page.config';
import { RegionController } from '@core/node/region/region.controller';
import { regionMap } from '@core/node/config/region.map';
import { GraphicWrapper } from '@core/node/graphic/graphic.wrapper';
import { Observable } from 'rxjs/internal/Observable';

const template = `
    <div class="report-region">
        <div class="report-canvas">
          <div class="report-box">
             <div class="report-grid">

             </div>
          </div>
        </div>
    </div>
`;

export class PageRuntime {
  $element: JQuery;

  private _$canvas: JQuery;
  private _$box: JQuery;
  private _$grid: JQuery;

  private _model: PageConfig;

  private _scale = 1;
  private _width: number;
  private _height: number;

  private _regionArray: Array<RegionRuntime> = [];

  constructor() {
    const $element = this.$element = $(template);

    this._$canvas = $element.find('.report-canvas');
    this._$box = $element.find('.report-box');
    this._$grid = $element.find('.report-grid');

    this._init();
  }

  private _init() {
    this._accept(this._model);
  }

  load(option: any) {
    this._model.importOption(option.option);
    option.children.forEach((value) => {
      this._createRegion(value);
    });
  }

  private _accept(model: PageConfig) {
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
      this._$grid.toggleClass('help-lines', newValue);
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
        'width': this._width * this._scale + 50,
        'height': this._height * this._scale + 30,
      });
      this._$canvas.css({
        width: this._width * this._scale,
        height: this._height * this._scale,
      });
      this._$box.css('transform', `translate(-50%, -50%) scale(${this._scale})`);
      this._$grid.css({
        width: this._width,
        height: this._height,
      });
    }
  }

  private _createRegion(graphicMeta: any) {
    if (regionMap.has(graphicMeta.region.regionKey)) {
      const region: RegionController = new (regionMap.get(graphicMeta.region.regionKey))(this);

      region.init(graphicMeta.region.regionOption);

      const graphic = new GraphicWrapper(region);
      graphic.init(graphicMeta.graphic);

      setTimeout(() => {
        graphic.resize();
      }, 200);

    }
  }

  addChild(region: RegionRuntime) {
    this._regionArray.push(region);
  }

  removeChild(region: RegionRuntime) {
    const array = this._regionArray;
    array.includes(region) && array.splice(array.indexOf(region), 1);
  }

  set scale(value: number) {
    this._scale = value;
    this._refresh();
  }

  enterFullScreen() {
    this._$box[0].requestFullscreen();
  }

  getConfigSource(option: any): Observable<any> {
    return null;
  }

  getDataSource(option: any): Observable<any> {
    return null;
  }
}
