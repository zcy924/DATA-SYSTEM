import { Observable } from 'rxjs/internal/Observable';

import { PageConfigRuntime } from './page.config.runtime';
import { RegionRuntime } from './region.runtime';
import { GraphicWrapperRuntime } from './graphic.wrapper.runtime';
import { RuntimeConfigSourceFactory } from './config/runtime.config.source.factory';
import {
  DataSourceManager,
  IComponentOption,
  IConfigSourceFactory,
  BasePageConfig
} from '@barca/shared';



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

  private _model: BasePageConfig;

  private _state: PageRuntimeState = PageRuntimeState.created;
  private _scale = 1;
  private _width: number;
  private _height: number;

  private _regionArray: Array<RegionRuntime> = [];

  private _configSourceFactory: IConfigSourceFactory = RuntimeConfigSourceFactory.getInstance();

  constructor(private _dataSourceManager: DataSourceManager) {
    const $element = this.$element = $(template);

    this._$canvas = $element.find('.report-canvas');
    this._$box = $element.find('.report-box');
    this._$grid = $element.find('.report-grid');
  }

  /**
   * 创建PageConfig
   * 监听PageConfig
   */
  init() {
    if (this._state === PageRuntimeState.created) {
      this._model = new PageConfigRuntime();
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
      throw new Error('状态不一致,页面已经装载  请检查代码！ ');
    }
  }

  private _accept(model: BasePageConfig) {
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
    const region: RegionRuntime = new RegionRuntime(this);

    region.init(componentOption.region.regionOption);

    const graphic = new GraphicWrapperRuntime(region);
    graphic.init(componentOption.graphic);

    region.addChild(graphic);
    setTimeout(() => {
      graphic.resize();
    }, 200);
  }

  addChild(region: RegionRuntime) {
    this._$grid.append(region.$element);
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
    return this._configSourceFactory.getConfigSource(option);
  }

  getDataSource(id: string): Observable<any> {
    return this._dataSourceManager.getDataSource(id);
  }

  destroy() {
    this._regionArray.forEach(value => value.destroy());
    this._regionArray.splice(0);
    this._regionArray = null;

    this._configSourceFactory = null;

    this._dataSourceManager.destroy();
    this._dataSourceManager = null;

    this._model.destroy();
  }
}
