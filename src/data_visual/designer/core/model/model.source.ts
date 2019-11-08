import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { ConfigSourceManager } from '../config/config.source.manager';
import { DataSourceManager, Destroyable, GraphicOption } from '@data-studio/shared';
import * as _ from 'lodash';
import { filter } from 'rxjs/operators';

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

  // 根据配置信息初始化model
  init(graphicOption: GraphicOption) {
    const { id, classID, configSourceOption, dataSourceConfigID } = this._graphicOption = graphicOption;
    // 有configOption一般粘贴，或者打开新的文件时 会走这条路
    // 如果是新建 则肯定是调用设计时的configFactory
    this._config$ = !!configSourceOption ? this._configSourceManger
      .getMockConfigSource({
        instanceID: id,
        classID,
        configSourceOption,
      }) : this._configSourceManger
      .getConfigSource({
        instanceID: id,
        classID,
        configSourceOption,
      });

    this._data$ = this._dataSourceManager.getDataSource(dataSourceConfigID);

    // 两个组件必须同时打开  不然收不到信息
    this._combineSubscription = combineLatest(this._config$, this._data$)
      .subscribe(([config, data]) => {
        let a = 1;
        this._modelSubject.next([config, data]);
      });

    this._modelSubscription = this._modelSubject
      .subscribe((model: Array<any>) => {
        if (model) {
          const [config] = model;
          if (_.isArray(config)) {
            this._graphicOption.configSourceOption = Object.assign({}, config[0].option);
          } else if (!_.isNull(config)) {
            this._graphicOption.configSourceOption = Object.assign({}, config.option);
          }
        }
      });
  }

  switchConfigSource() {
    if (this._combineSubscription) {
      this._combineSubscription.unsubscribe();
    }
    const { id, classID, configSourceOption, dataSourceConfigID } = this._graphicOption;
    this._config$ = this._configSourceManger.getConfigSource({
      instanceID: id,
      classID,
      configSourceOption,
    });
    this._combineSubscription = combineLatest(this._config$, this._data$).subscribe(([config, data]) => {
      this._modelSubject.next([config, data]);
    });
  }

  switchDataSource(dataSourceConfigID: string) {
    this._graphicOption.dataSourceConfigID = dataSourceConfigID;
    if (this._combineSubscription) {
      this._combineSubscription.unsubscribe();
    }
    this._data$ = this._dataSourceManager.getDataSource(dataSourceConfigID);
    this._combineSubscription = combineLatest(this._config$, this._data$).subscribe(([config, data]) => {
      this._modelSubject.next({
        config, data,
      });
    });
  }

  model$(): Observable<any> {
    return this._modelSubject.asObservable().pipe(filter(value => value != null));
  }

}
