import {Dataset, DataModel} from './data.model.interface';
import {Observable, Subject} from 'rxjs';
import { DataSourceConfigSet } from '../../shared/core/data/data.source.config.set';
import { session } from '../utils/session';

/**
 * 该类不可以跟DataSourceManager合并 DataModelPlugin只认DataModelManager说话
 * 切换Graphic
 */
class DataModelManager {
  private _map: Map<string, DataModel> = new Map();
  private _currentDataModel: DataModel;

  private _dataOptionSet: DataSourceConfigSet;
  private _modelNameSubject = new Subject<string>();
  private _dataModelSubject = new Subject<DataModel>();

  set dataOptionSet(value: DataSourceConfigSet) {
    if (value) {
      value.values.forEach((dataSourceConfig) => {
        this.addDataModel(dataSourceConfig.id, dataSourceConfig.displayName, dataSourceConfig.dimensions);
      });
      this._dataOptionSet = value;
    }
  }

  get modelNameObservable(): Observable<string> {
    return this._modelNameSubject.asObservable();
  }

  get currentDataModelObservable(): Observable<DataModel> {
    return this._dataModelSubject.asObservable();
  }

  updateState(dataModelType: string, dataModelID: string) {

  }

  addDataModel(id: string, displayName: string, dimensions: any) {
    this._map.set(id, {
      id,
      displayName,
      dimensions,
      state: {collapsedDimension: false, collapsedMeasure: false}
    });
    return this;
  }

  get list(): Array<{ id: string, displayName: string }> {
    const retArray = [];
    this._map.forEach((value: DataModel, key, map) => {
      retArray.push({
        id: value.id,
        displayName: value.displayName
      });
    });
    return retArray;
  }

  has(id: string): boolean {
    return this._map.has(id);
  }

  getDataModel(id: string): DataModel {
    return this._map.get(id);
  }

  switchDataModel(id: string, updateGraphic: boolean = true): DataModel {
    const ret = this._currentDataModel = this._map.get(id);
    if (ret) {
      this._modelNameSubject.next(ret ? ret.displayName : '未选择任何model');
      this._dataModelSubject.next(ret);
    }
    if (updateGraphic) {
      console.log('switchDataSource:' + id);
      session.currentPage.reportPage.focusRegion.graphicWrapper.switchDataSource(id);
    }
    return ret;
  }

  clear() {

  }

  get current(): Dataset {
    return null; // this._currentDatasetWrapper ? this._currentDatasetWrapper.dataset : null;
  }

  getDefaultDataset(): DataModel {
    return null; // this._map.entries().next().value[1];
  }
}

export const dataModelManager = new DataModelManager();