import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { ConfigSourceManager } from '../config/config.source.manager';
import { DataSourceManager, Destroyable, GraphicOption } from '@barca/shared';
import * as _ from 'lodash';

export class ModelSource extends Destroyable {

  private _graphicOption: GraphicOption;

  private _modelSubject: Subject<any> = new BehaviorSubject(null);
  private _modelSubscription: Subscription;

  private _config$: Observable<any>;
  private _data$: Observable<any>;
  private _combineSubscription: Subscription;

  constructor(
    private _configSourceManger: ConfigSourceManager,
    private _dataSourceManager: DataSourceManager) {
    super();
    this.onDestroy(() => {
      if (this._modelSubscription) {
        this._modelSubscription.unsubscribe();
        this._modelSubscription = null;
      }
      if (this._modelSubject) {
        this._modelSubject.unsubscribe();
      }
      if (this._combineSubscription) {
        this._combineSubscription.unsubscribe();
        this._combineSubscription = null;
      }
      this._config$ = this._data$ = this._graphicOption = null;
    });
  }

  get graphicOption(): GraphicOption {
    return this._graphicOption;
  }

  init(graphicOption: GraphicOption) {
    const { graphicId, graphicKey, configOption, dataSourceKey } = this._graphicOption = graphicOption;
    // 有configOption一般粘贴，或者打开新的文件时 会走这条路
    if (configOption) {
      this._config$ = this._configSourceManger
        .getMockConfigSource({
          graphicId,
          graphicKey,
          configOption,
        });
    } else {
      // 如果是新建 则肯定是调用设计时的configFactory
      this._config$ = this._configSourceManger
        .getConfigSource({
          graphicId,
          graphicKey,
          configOption,
        });
    }
    this._data$ = this._dataSourceManager.getDataSource(dataSourceKey);

    // 两个组件必须同时打开  不然收不到信息
    this._combineSubscription = combineLatest(this._config$, this._data$)
      .subscribe(([config, data]) => {
        this._modelSubject.next([config, data]);
      });

    this._modelSubscription = this._modelSubject
      .subscribe((model: Array<any>) => {
        if (model) {
          const [config] = model;
          if (_.isArray(config)) {
            this._graphicOption.configOption = Object.assign({}, config[0].option);
          } else if (!_.isNull(config)) {
            this._graphicOption.configOption = Object.assign({}, config.option);
          }
        }
      });
  }

  switchConfigSource() {
    if (this._combineSubscription) {
      this._combineSubscription.unsubscribe();
    }
    const { graphicId, graphicKey, configOption } = this._graphicOption;
    this._config$ = this._configSourceManger.getConfigSource({
      graphicId,
      graphicKey,
      configOption,
    });
    this._combineSubscription = combineLatest(this._config$, this._data$).subscribe(([config, data]) => {
      this._modelSubject.next([config, data]);
    });
  }

  switchDataSource(dataSourceKey: string) {
    this._graphicOption.dataSourceKey = dataSourceKey;
    if (this._combineSubscription) {
      this._combineSubscription.unsubscribe();
    }
    this._data$ = this._dataSourceManager.getDataSource(dataSourceKey);
    this._combineSubscription = combineLatest(this._config$, this._data$).subscribe(([config, data]) => {
      this._modelSubject.next({
        config, data,
      });
    });
  }

  model$(): Observable<any> {
    return this._modelSubject.asObservable();
  }

}
