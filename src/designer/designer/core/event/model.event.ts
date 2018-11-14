
import * as _ from 'lodash';
import { KeyValueListener } from './event';

export interface ChangedItem {
  key: string;
  oldValue: any;
  newValue: any;
  option: any;
}

export class ModelEventTarget {
  private _map: Map<string, Array<KeyValueListener>> = new Map();

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
        if (this._map.has(value)) {
          this._map.get(value).push(listener);
        } else {
          this._map.set(value, [listener]);
        }
      });
    }
    return this;
  }

  public revoke(eventType: string) {
    if (this._map.has(eventType)) {
      this._map.delete(eventType);
    }
  }


  protected _trigger(item: ChangedItem) {
    const { key, oldValue, newValue, option } = item;
    if (this._map.has(key)) {
      const listeners = this._map.get(key);
      listeners.forEach((listener) => {
        listener(key, oldValue, newValue, option);
      });
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
    } else if (!!item) {
      this._trigger(item);
    }
  }
}






