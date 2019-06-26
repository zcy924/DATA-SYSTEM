import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { GraphicConfigManager } from '../../config/design/graphic.config.manager';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { dataModelManager } from '../../../data/data.model.manager';
import { Region } from '../region/region';

import * as _ from 'lodash';
import {
  ChangedItem,
  ComponentRepositoryManager,
  getParameterName,
  GraphicOption, guid,
  IGraphic,
  IGraphicOption,
} from '@barca/shared';


/**
 *
 * 管理组件的ConfigSource和DataSource
 */
export class GraphicWrapper {

  private _uuid: string;
  private _graphicOption: GraphicOption;

  private _graphic: IGraphic;
  private _config$: Observable<any>;
  private _data$: Observable<any>;

  private _configSubject = new Subject();
  private _configSubscription: Subscription;
  private _modelSubscription: Subscription;

  private _optionAccessor: Function;

  constructor(private _region: Region) {
  }

  get uuid(): string {
    return this._uuid;
  }

  get $element() {
    return this._graphic.$element;
  }

  /**
   * 创建Graphic
   *  $element属性可用
   * 创建ConfigSource
   * 创建DataSource
   * @param graphicOption
   */
  init(option: IGraphicOption) {
    const graphicOption = this._graphicOption = new GraphicOption(option);
    const { graphicId, graphicKey, graphicPath, dataSourceKey, configOption } = graphicOption,
      compRepo = ComponentRepositoryManager.getInstance();
    if (compRepo.has(graphicPath)) {
      this._graphic = new (compRepo.getComponentMeta(graphicPath).graphicDef)();
      const paramNameArray = getParameterName(this._graphic.init), map = {
        region: this._region,
        wrapper: this,
      };
      this._graphic.init(...paramNameArray.map((paramName) => {
        return map[paramName];
      }));
      this._region.addChild(this);
    }

    this._configSubscription = this._configSubject
      .pipe(distinctUntilChanged())
      .subscribe((model: Array<ChangedItem> | ChangedItem) => {
        if (_.isArray(model)) {
          this._graphicOption.configOption = Object.assign({}, model[0].option);
        } else if (!_.isNull(model)) {
          this._graphicOption.configOption = Object.assign({}, model.option);
        }
      });

    this._uuid = graphicId || guid(10, 16);

    // 有configOption一般粘贴，或者打开新的文件时 会走这条路
    if (configOption) {
      this._config$ = this._region.page
        .getMockConfigSource({
          graphicId: this._uuid,
          graphicKey,
          configOption,
        });
    } else {
      // 如果是新建 则肯定是调用设计时的configFactory
      this._config$ = this._region.page
        .getConfigSource({
          graphicId: this._uuid,
          graphicKey,
          configOption,
        });
    }
    this._data$ = this._region.page.getDataSource(dataSourceKey);

    // 两个组件必须同时打开  不然收不到信息
    this._modelSubscription = this._graphic
      .accept(combineLatest(this._config$, this._data$)
        .pipe(tap(([model, data]: Array<any>) => {
          this._configSubject.next(model);
        })));
  }

  /**
   * 切换配置源
   */
  switchConfigSource() {
    if (this._modelSubscription) {
      this._modelSubscription.unsubscribe();
    }
    this._config$ = this._region.page.getConfigSource({
      graphicId: this._uuid,
      graphicKey: this._graphicOption.graphicKey,
      configOption: this._graphicOption.configOption,
    });
    this._modelSubscription = this._graphic.accept(combineLatest(this._config$, this._data$)
      .pipe(tap((modelArray: Array<any>) => {
        const [model, data] = modelArray;
        this._configSubject.next(model);
      })));
  }

  switchDataSource(dataSourceKey: string) {
    this._graphicOption.dataSourceKey = dataSourceKey;
    if (this._modelSubscription) {
      this._modelSubscription.unsubscribe();
    }
    this._data$ = this._region.page.getDataSource(dataSourceKey);
    this._modelSubscription = this._graphic.accept(combineLatest(this._config$, this._data$)
      .pipe(tap((modelArray: Array<any>) => {
        const [model, data] = modelArray;
        this._configSubject.next(model);
      })));
  }

  // 激活配置面板
  activateConfig() {
    this._region.page.focusRegion = this._region;

    // 运行时不需要调用此方法
    dataModelManager.switchDataModel(this._graphicOption.dataSourceKey, false);
    if (!GraphicConfigManager.getInstance().has(this._uuid)) {
      this.switchConfigSource();
    }
    GraphicConfigManager.getInstance().activate(this._uuid);
  }

  get optionAccessor() {
    return this._optionAccessor || (() => Object.assign({}, this._graphicOption.value));
  }

  set optionAccessor(value: Function) {
    this._optionAccessor = value;
  }

  getOption() {
    return this.optionAccessor();
  }


  /**
   * 更新全局样式 目前只有Echart图表使用的到
   * @param {string} theme
   */
  updateTheme(theme: string) {
    if (this._graphic) {
      this._graphic.updateTheme(theme);
    }
  }


  resize() {
    if (this._graphic) {
      this._graphic.resize();
    }
  }

  // 图标进入交互状态
  activate() {
    if (this._graphic) {
      this._graphic.activate();
    }
  }

  deactivate() {
    if (this._graphic) {
      this._graphic.deactivate();
    }
  }

  destroy() {
    if (this._configSubscription) {
      this._configSubscription.unsubscribe();
      this._configSubscription = null;
    }
    if (this._modelSubscription) {
      this._modelSubscription.unsubscribe();
      this._modelSubscription = null;
    }
    if (this._graphic) {
      this._graphic.destroy();
      this._graphic = null;
    }
  }
}
