import { Destroyable } from '../common/destroyable';
import { ChangedItem, IModelEventTarget, KeyValueListener } from './event.interface';
import * as _ from 'lodash';

export class ModelEventTarget extends Destroyable implements IModelEventTarget{
  private _map: Map<string, Array<KeyValueListener>> = new Map();

  constructor() {
    super();
    this.addSubscription(() => {
      if (this._map) {
        this._map.clear();
        this._map = null;
      }
    });
  }

  /**
   * 监听属性变化
   * @param {string} propertyName  "color color.add color.delete"
   * @param {KeyValueListener} listener
   * @returns {this}
   */
  register(propertyName: string, listener: KeyValueListener) {
    if (arguments.length === 2) {
      const eventArray = propertyName
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ');
      eventArray.forEach((value) => {
        if (this._map.has(value)) {
          this._map.get(value).push(listener);
        } else {
          this._map.set(value, [listener]);
        }
      });
    }
    return this;
  }

  /**
   * 撤销对属性的监听
   * @param propertyName
   * @param listener
   */
  revoke(propertyName: string, listener?: KeyValueListener) {
    if (this._map.has(propertyName)) {
      const listenerArray = this._map.get(propertyName);
      if (!!listener) {
        if (listenerArray.includes(listener)) {
          listenerArray.splice(listenerArray.indexOf(listener), 1);
        }
      } else {
        this._map.delete(propertyName);
      }
    }
  }

  trigger(item: ChangedItem | Array<ChangedItem>) {
    if (Array.isArray(item)) {
      this._batchTrigger(item);
    } else if (!!item) {
      this._trigger(item);
    }
  }


  protected _trigger(item: ChangedItem) {
    const {key, oldValue, newValue, option} = item;
    if (this._map.has(key)) {
      const listeners = this._map.get(key);
      listeners.forEach((listener) => {
        try {
          listener(key, oldValue, newValue, option);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }

  protected _batchTrigger(changedItemArray: Array<ChangedItem>) {
    changedItemArray.forEach((value) => {
      this._trigger(value);
    });
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







