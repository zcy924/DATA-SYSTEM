import { Destroyable } from '../common/destroyable';
import { ChangedItem, IModelEventTarget, KeyValueListener } from './event.interface';
import * as _ from 'lodash';

export class ModelEventTarget extends Destroyable implements IModelEventTarget{
  private _listenerMap: Map<string, Array<KeyValueListener>> = new Map();

  constructor() {
    super();
    this.addSubscription(() => {
      if (this._listenerMap) {
        this._listenerMap.clear();
        this._listenerMap = null;
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
        if (this._listenerMap.has(value)) {
          this._listenerMap.get(value).push(listener);
        } else {
          this._listenerMap.set(value, [listener]);
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
    if (this._listenerMap.has(propertyName)) {
      const listenerArray = this._listenerMap.get(propertyName);
      if (!!listener) {
        if (listenerArray.includes(listener)) {
          listenerArray.splice(listenerArray.indexOf(listener), 1);
        }
      } else {
        this._listenerMap.delete(propertyName);
      }
    }
  }

  /**
   * 该方法的存在  使得外部能够触发事件
   * @param item
   */
  trigger(item: ChangedItem | Array<ChangedItem>) {
    if (Array.isArray(item)) {
      this._batchTrigger(item);
    } else if (!!item) {
      this._trigger(item);
    }
  }


  protected _trigger(item: ChangedItem) {
    const {key, oldValue, newValue, option} = item;
    if (this._listenerMap.has(key)) {
      const listeners = this._listenerMap.get(key);
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







