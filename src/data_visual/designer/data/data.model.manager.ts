import { DataSourceConfigSet, Destroyable } from '@data-studio/shared';
import { Dataset, DataModel } from './data.model.interface';
import { Observable, Subject } from 'rxjs';
import { session } from '../utils/session';

/**
 * 该类不可以跟DataSourceManager合并 DataModelPlugin只认DataModelManager说话
 * 切换Graphic
 */
class DataModelManager extends Destroyable {
  private _map: Map<string, DataModel> = new Map();
  private _currentDataModel: DataModel;

  private _dataSourceConfigSet: DataSourceConfigSet;
  private _modelNameSubject = new Subject<string>();
  private _dataModelSubject = new Subject<DataModel>();

  constructor() {
    super();
    this.onDestroy(() => {
      this._modelNameSubject.unsubscribe();
      this._dataModelSubject.unsubscribe();
      this._modelNameSubject = this._dataModelSubject = null;
    });
  }

  set dataSourceConfigSet(value: DataSourceConfigSet) {
    this._map.clear();
    if (value) {
      value.values.forEach((dataSourceConfig) => {
        this.addDataModel(dataSourceConfig.id, dataSourceConfig.displayName, dataSourceConfig.dimensions);
      });
      this._dataSourceConfigSet = value;
    }
  }

  get modelName$(): Observable<string> {
    return this._modelNameSubject.asObservable();
  }

  get currentDataMode$(): Observable<DataModel> {
    return this._dataModelSubject.asObservable();
  }

  get list(): Array<{ id: string, displayName: string }> {
    const retArray = [];
    this._map.forEach((value: DataModel, key, map) => {
      retArray.push({
        id: value.id,
        displayName: value.displayName,
      });
    });
    return retArray;
  }

  addDataModel(id: string, displayName: string, dimensions: any) {
    this._map.set(id, {
      id,
      displayName,
      dimensions,
      state: { collapsedDimension: false, collapsedMeasure: false },
    });
    return this;
  }

  getDataModel(id: string): DataModel {
    return this._map.get(id);
  }

  has(id: string): boolean {
    return this._map.has(id);
  }

  switchDataModel(id: string, updateGraphic: boolean = true): DataModel {
    const ret = this._currentDataModel = this._map.get(id);
    if (ret) {
      this._modelNameSubject.next(ret ? ret.displayName : '未选择任何model');
      this._dataModelSubject.next(ret);
    }
    if (updateGraphic) {
      if(session.currentPage.focusRegion){
        session.currentPage.focusRegion.switchDataSource(id);
      }
    }
    return ret;
  }

  clear() {
    this._map.clear();
  }

  get current(): Dataset {
    return null;
  }

  getDefaultDataset(): DataModel {
    return null;
  }
}

export const dataModelManager = new DataModelManager();
