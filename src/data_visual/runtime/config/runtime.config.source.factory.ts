import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { IConfigSourceFactory } from '../../shared/core/config/config.source.factory';
import { keyValueDiffers } from '../../shared/common/differ/default_keyvalue_differ';

export class RuntimeConfigSourceFactory implements IConfigSourceFactory {
  private static _configSourceFactory: IConfigSourceFactory;

  static getInstance() {
    if (!this._configSourceFactory) {
      this._configSourceFactory = new RuntimeConfigSourceFactory();

    }
    return this._configSourceFactory;
  }

  private constructor() {
  }

  getConfigSource(configSourceOption: { graphicId: string, graphicKey: string, configOption: any }): Observable<any> {
    const
      option = configSourceOption.configOption,
      changes = keyValueDiffers.find({}).create().diff(option),
      array = [];
    if (changes) {
      changes.forEachRemovedItem((record) => {
        array.push({
          key: `remove.${record.key}`,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option,
        });
      });
      changes.forEachAddedItem((record) => {
        array.push({
          key: `add.${record.key}`,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option,
        });
      });
      changes.forEachChangedItem((record) => {
        array.push({
          key: record.key,
          oldValue: record.previousValue,
          newValue: record.currentValue,
          option,
        });
      });
    }

    array.push({
      key: 'option',
      oldValue: option,
      newValue: option,
      option,
    });

    return new BehaviorSubject(array);
  }
}
