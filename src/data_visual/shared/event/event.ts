import { Destroyable } from '../common/destroyable';
import { IEventTarget } from './event.interface';

/**
 * 只能先“订阅”再“发布”
 * 全局对象会产生命名冲突
 * 观察者模式有两个明显的优点
 * 时间上解耦
 * 对象间解耦
 * 它应用广泛，但是也有缺点
 * 创建这个函数同样需要内存，过度使用会导致难以跟踪维护
 */
export class BaseEventTarget extends Destroyable implements IEventTarget {
  private _map: Map<string, Array<Function>> = new Map();

  constructor() {
    super();
    this.addSubscription(() => {
      if (this._map) {
        this._map.clear();
        this._map = null;
      }
    });
  }

  addEventListener(eventName: string, callback: Function): IEventTarget {
    if (eventName && callback) {
      if (!this._map.has(eventName)) {
        this._map.set(eventName, [callback]);
      } else {
        this._map.get(eventName).push(callback);
      }
    }
    return this;
  }

  removeEventListener(eventName: string, callback?: Function) {
    const fns = this._map.get(eventName);
    if (!fns) {
      return false;
    } else {
      if (!callback) { // 如果没有传入fn回调函数，直接取消key对应消息的所有订阅
        fns.splice(0, fns.length);
      } else {
        while (fns.includes(callback)) { // 针对一个处理函数绑定多次的情况
          fns.splice(fns.indexOf(callback), 1);
        }
      }
    }
  }

  dispatchEvent(eventName: string, ...args: Array<any>) {
    if (!this._map.has(eventName)) {
      return false; // 如果回调数组不存在或为空则返回false
    } else {
      this._map.get(eventName).forEach((value) => {
        try {
          value.apply(this, args); // 循环回调数组执行回调函数
        } catch (e) {
          console.error(e);
        }
      });
    }
  }

}
