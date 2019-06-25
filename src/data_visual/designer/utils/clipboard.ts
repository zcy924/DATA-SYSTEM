/**
 * 剪贴板 全局只有一个实例
 */
class Clipboard {
  private _data: any;

  constructor() {
  }

  /**
   * 剪贴板中是否存在数据
   */
  hasData() {
    return !!this._data;
  }

  /**
   * 向剪贴板中存放数据
   * @param param
   */
  saveData(param: any) {
    this._data = param;
  }

  /**
   * 从剪贴板中获取数据
   */
  getData() {
    return this._data;
  }
}

export const clipboard = new Clipboard();
