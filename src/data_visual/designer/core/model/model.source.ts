import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { ConfigSourceManager } from '../config/config.source.manager';
import { DataSourceManager } from '@barca/shared';


export class ModelSource {

  private _configSourceOption;

  private _subject: Subject<any> = new BehaviorSubject(null);

  private _subscription: Subscription;
  private _config$: Observable<any>;
  private _data$: Observable<any>;

  constructor(private _configSourceManger: ConfigSourceManager, private _dataSourceManager: DataSourceManager) {

  }

  init(configSourceOption, dataSourceKey: string) {
    const { graphicId, graphicKey, configOption } = this._configSourceOption = configSourceOption;
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
    this._subscription = combineLatest(this._config$, this._data$).subscribe(([config, data]) => {
      this._subject.next({
        config, data,
      });
    });
  }

  switchConfigSource() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    const { graphicId, graphicKey, configOption } = this._configSourceOption;
    this._config$ = this._configSourceManger.getConfigSource({
      graphicId,
      graphicKey,
      configOption,
    });
    this._subscription = combineLatest(this._config$, this._data$).subscribe(([config, data]) => {
      this._subject.next({
        config, data,
      });
    });
  }

  switchDataSource(dataSourceKey: string) {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._data$ = this._dataSourceManager.getDataSource(dataSourceKey);
    this._subscription = combineLatest(this._config$, this._data$).subscribe(([config, data]) => {
      this._subject.next({
        config, data,
      });
    });
  }

  model() {
    return this._subject;
  }

}
