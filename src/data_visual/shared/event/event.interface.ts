export interface IEventTarget {
  addEventListener(eventName: string, callback: () => void);

  removeEventListener(eventName: string, callback?: () => void);

  dispatchEvent(...args: Array<any>);
}

export interface ChangedItem {
  key: string;
  oldValue: any;
  newValue: any;
  option: any;
}

export type KeyValueListener = (key: string, oldValue: any, newValue: any, option?: any) => void;

/**
 * 数据模型事件对象接口
 */
export interface IModelEventTarget {
  /**
   * 监听指定属性的改变事件
   * @param propertyName
   * @param listener
   */
  register(propertyName: string, listener: KeyValueListener): IModelEventTarget;

  /**
   * 撤销对指定属性改变的监听
   * @param propertyName
   * @param listener
   */
  revoke(propertyName: string, listener: KeyValueListener);

  /**
   * 触发属性改变事件
   * @param item
   */
  trigger(item: ChangedItem | Array<ChangedItem>);
}
