import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { ConfigSourceManager } from '../config/config.source.manager';
import { DataSourceManager, GraphicOption } from '@barca/shared';
import * as _ from 'lodash';

export class ModelSource {

  private _graphicOption;

  private _modelSubject: Subject<any> = new BehaviorSubject(null);
  private _modelSubscription: Subscription;

  private _subscription: Subscription;
  private _config$: Observable<any>;
  private _data$: Observable<any>;

  private _dataSourceKey: string;

  constructor(
    private _configSourceManger: ConfigSourceManager,
    private _dataSourceManager: DataSourceManager) {

  }

  init(graphicOption: GraphicOption) {
    const { graphicId, graphicKey, configOption, dataSourceKey } = this._graphicOption = graphicOption;
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
    this._subscription = combineLatest(this._config$, this._data$)
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
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    const { graphicId, graphicKey, configOption } = this._graphicOption;
    this._config$ = this._configSourceManger.getConfigSource({
      graphicId,
      graphicKey,
      configOption,
    });
    this._subscription = combineLatest(this._config$, this._data$).subscribe(([config, data]) => {
      this._modelSubject.next([config, data]);
    });
  }

  switchDataSource(dataSourceKey: string) {
    this._dataSourceKey = dataSourceKey;
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._data$ = this._dataSourceManager.getDataSource(dataSourceKey);
    this._subscription = combineLatest(this._config$, this._data$).subscribe(([config, data]) => {
      this._modelSubject.next({
        config, data,
      });
    });
  }

  model$(): Observable<any> {
    return this._modelSubject.asObservable();
  }

}
