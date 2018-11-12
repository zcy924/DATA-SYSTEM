import { RegionRuntime } from './region.runtime';
import { PageConfig } from '../components/page.config/page.config';
import { regionMap } from '@core/node/config/region.map';
import { Observable } from 'rxjs/internal/Observable';
import { RuntimePageConfig } from './runtime.page.config';
import { GraphicWrapperRuntime } from './graphic.wrapper.runtime';
import { DataSourceManager } from '@shared/core/data/data.source.manager';
import { IComponentOption } from '@shared/file/component.option';
import { IComponentMeta } from '../interface/component.meta';
import { ConfigSourceManager } from '@core/config/config.source.manager';

enum PageRuntimeState {
  created, initialized, loaded
}

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

  private _state: PageRuntimeState;
  private _scale = 1;
  private _width: number;
  private _height: number;

  private _regionArray: Array<RegionRuntime> = [];

  private _configSourceManager = new ConfigSourceManager('runtime');

  constructor(private _dataSourceManager: DataSourceManager) {
    const $element = this.$element = $(template);

    this._$canvas = $element.find('.report-canvas');
    this._$box = $element.find('.report-box');
    this._$grid = $element.find('.report-grid');
    this._state = PageRuntimeState.created;
  }

  init() {
    if (this._state === PageRuntimeState.created) {
      this._model = new RuntimePageConfig();
      this._accept(this._model);
      this._state = PageRuntimeState.initialized;
    } else {
      throw new Error('init 方法已经调用');
    }

  }

  load(option: any) {
    if (this._state === PageRuntimeState.initialized) {
      this._model.importOption(option.option);
      option.children.forEach((value) => {
        this._createRegion(value);
      });
      this._state = PageRuntimeState.loaded;
    } else {
      throw new Error('状态不一致  请检查代码！');
    }
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

  private _createRegion(componentOption: IComponentOption) {
    if (regionMap.has(componentOption.region.regionKey)) {
      const region: RegionRuntime = new RegionRuntime(this);

      region.init(componentOption.region.regionOption);

      const graphic = new GraphicWrapperRuntime(region);
      graphic.init(componentOption.graphic);

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
    return this._configSourceManager.getConfigSource(option);
  }

  getDataSource(id: string): Observable<any> {
    return this._dataSourceManager.getDataSourceByID(id);
  }
}
