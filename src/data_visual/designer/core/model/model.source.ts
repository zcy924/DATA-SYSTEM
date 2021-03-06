import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { ConfigSourceManager } from '../config/config.source.manager';
import { DataSourceManager, Destroyable, GraphicOption, IModelSource } from '@data-studio/shared';
import * as _ from 'lodash';
import { filter, tap } from 'rxjs/operators';

export class ModelSource extends Destroyable implements IModelSource {

  private _graphicOption: GraphicOption;

  private _modelSubject: Subject<any>;
  private _model$: Observable<Array<any>>;

  private _config$: Observable<any>;
  private _data$: Observable<any>;
  private _combineSubscription: Subscription;

  constructor(
    private _configSourceManger: ConfigSourceManager,
    private _dataSourceManager: DataSourceManager) {
    super();
    this._modelSubject = new BehaviorSubject(null);
    this.onDestroy(() => {
      if (this._modelSubject) {
        this._modelSubject.unsubscribe();
        this._modelSubject = null;
      }
      if (this._combineSubscription) {
        this._combineSubscription.unsubscribe();
        this._combineSubscription = null;
      }
      this._config$ = this._data$ = this._graphicOption = null;
    });
  }

  get id() {
    return this._graphicOption.id;
  }

  get dataSourceConfigID() {
    return this._graphicOption.dataSourceConfigID;
  }

  get value() {
    return this._graphicOption.value;
  }

  get graphicOption(): GraphicOption {
    return this._graphicOption;
  }

  get model$(): Observable<any> {
    return this._model$;
  }

  // 根据配置信息初始化model
  init(graphicOption: GraphicOption) {
    const { id, classID, configSourceOption, dataSourceConfigID } = this._graphicOption = graphicOption;
    // 有configOption一般粘贴，或者打开新的文件时 会走这条路
    // 如果是新建 则肯定是调用设计时的configFactory
    this._config$ = !!configSourceOption ? this._configSourceManger
      .getMockConfigSource({
        id,
        classID,
        configSourceOption,
      }) : this._configSourceManger
      .getConfigSource({
        id,
        classID,
        configSourceOption,
      });

    this._data$ = this._dataSourceManager.getDataSource(dataSourceConfigID);

    // 两个组件必须同时打开  不然收不到信息
    this._combineSubscription = combineLatest(this._config$, this._data$)
      .subscribe(([config, data]) => {
        this._modelSubject.next([config, data]);
      });

    this._model$ = this._modelSubject.asObservable().pipe(
      filter(value => value != null),
      tap((model: Array<any>) => {
        if (model) {
          const [config] = model;
          if (_.isArray(config)) {
            this._graphicOption.configSourceOption = Object.assign({}, config[0].option);
          } else if (!_.isNull(config)) {
            this._graphicOption.configSourceOption = Object.assign({}, config.option);
          }
        }
      }));
  }

  /**
   * 设计模式下 切换配置信息源
   * 设计器
   */
  switchConfigSource() {
    if (this._combineSubscription) {
      this._combineSubscription.unsubscribe();
      this._combineSubscription = null;
    }
    const { id, classID, configSourceOption } = this._graphicOption;
    this._config$ = this._configSourceManger.getConfigSource({
      id,
      classID,
      configSourceOption,
    });
    this._combineSubscription = combineLatest(this._config$, this._data$).subscribe((model) => {
      this._modelSubject.next(model);
    });
  }

  /**
   * 设计模式下 切换数据源
   * @param dataSourceConfigID
   */
  switchDataSource(dataSourceConfigID: string) {
    this._graphicOption.dataSourceConfigID = dataSourceConfigID;
    if (this._combineSubscription) {
      this._combineSubscription.unsubscribe();
      this._combineSubscription = null;
    }
    this._data$ = this._dataSourceManager.getDataSource(dataSourceConfigID);
    this._combineSubscription = combineLatest(this._config$, this._data$).subscribe((model) => {
      this._modelSubject.next(model);
    });
  }

}
