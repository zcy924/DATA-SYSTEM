import { KeyValueListener } from '@core/node/event/event';
import * as _ from 'lodash';

export interface ChangedItem {
  key: string;
  oldValue: any;
  newValue: any;
  option: any;
}

export class ModelEventTarget {
  private _map = new Map();

  /**
   * @param {string} eventType  "color color.add color.delete"
   * @param {KeyValueListener} listener
   * @returns {this}
   */
  public register(eventType: string, listener: KeyValueListener) {
    if (arguments.length === 2) {
      const eventArray = eventType
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ');
      eventArray.forEach((value, index, array) => {
        this._map.set(value, listener);
      });
    }
    return this;
  }


  protected _trigger(item: ChangedItem) {
    const { key, oldValue, newValue, option } = item;
    if (this._map.has(key)) {
      const listener = this._map.get(key);
      listener(key, oldValue, newValue, option);
    }
  }

  protected _batchTrigger(changedItemArray: Array<ChangedItem>) {
    changedItemArray.forEach((value) => {
      this._trigger(value);
    });
  }

  destroy() {
    if (this._map) {
      this._map.clear();
      this._map = null;
    }

  }

}

export class OuterModelEventTarget extends ModelEventTarget {
  trigger(item: ChangedItem | Array<ChangedItem>) {
    if (_.isArray(item)) {
      this._batchTrigger(item);
    } else {
      this._trigger(item);
    }
  }
}







