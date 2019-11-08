import { Coordinates, Dimensions, IRegionOption, ModelEventTarget, Rectangle } from '@data-studio/shared';
import { closestNum, pick } from '../../../utils/common';

export enum RegionState {
  default, selected, multiSelected, activated
}


/**
 * z-index/state的变化会触发属性变化事件
 *
 * 首先，$scope本身是一个普通的JavaScript对象；其次，$scope是一个表达式的执行环境
 * $scope是一个树形结构，与DOM标签平行，子$scope对象可以对父$scope对象的变量、函数等进行操作。
 *
 * 作用域能做什么
 提供观察者以监视数据模型的变化
 可以将数据模型的变化通知给整个应用,甚至是系统外的组件
 可以进行嵌套,隔离业务功能和数据
 给表达式提供运算时所需的执行环境
 */
export class RegionModel extends ModelEventTarget {
  private _option: IRegionOption;
  // 非持久化状态层
  private _state: RegionState;

  constructor(
    left: number = 100,
    top: number = 100,
    width: number = 300,
    height: number = 200) {
    super();
    this._option = {
      zIndex: 1,
      left,
      top,
      width,
      height,
    };
    this._state = RegionState.default;
    this.onDestroy(() => {
      this._option = null;
      this._state = null;
    });
  }

  set zIndex(value: number) {
    const changedItem = { key: 'z-index', oldValue: this._option.zIndex, newValue: value, option: null };
    this._option.zIndex = value;
    this._trigger(changedItem);
  }

  get zIndex(): number {
    return this._option.zIndex;
  }

  set left(param: number) {
    this._option.left = closestNum(param);
  }

  get left(): number {
    return this._option.left;
  }

  set top(param: number) {
    this._option.top = closestNum(param);
  }

  get top(): number {
    return this._option.top;
  }

  set width(width: number) {
    this._option.width = closestNum(width);
  }

  get width() {
    return this._option.width;
  }

  set height(height: number) {
    this._option.height = closestNum(height);
  }

  get height() {
    return this._option.height;
  }

  set coordinates({ left, top }: Coordinates) {
    this._option.left = closestNum(left);
    this._option.top = closestNum(top);
  }

  get coordinates(): Coordinates {
    return pick(this._option, ['left', 'top']) as Coordinates;
  }

  set dimensions({ width, height }: Dimensions) {
    this._option.width = closestNum(width);
    this._option.height = closestNum(height);
  }

  get dimensions(): Dimensions {
    return pick(this._option, ['width', 'height']) as Dimensions;
  }

  set rectangle({ left, top, width, height }: Rectangle) {
    this._option.left = closestNum(left);
    this._option.top = closestNum(top);
    this._option.width = closestNum(width);
    this._option.height = closestNum(height);
  }

  get rectangle(): Rectangle {
    return pick(this._option, ['left', 'top', 'width', 'height']) as Rectangle;
  }


  set state(param: RegionState) {
    if (this._state !== param) {
      const changedItem = { key: 'state', oldValue: this._state, newValue: param, option: null };
      this._state = param;
      this._trigger(changedItem);
    }
  }

  get state(): RegionState {
    return this._state;
  }

  zoom(width: number, height: number, preserveAspectRatio?: boolean) {
    if (preserveAspectRatio) {
      height = (this.height * width) / this.width;
      this.dimensions = {
        width, height,
      };
    } else {
      this.dimensions = {
        width, height,
      };
    }
  }

  /**
   * 不可以直接将option赋值给model对象
   * 因为多次粘贴的情况 会导致多个region公用一个model对象
   * @param option
   */
  importModel(option: any) {
     Object.assign(this._option, option);
  }

  /**
   * state不会被序列化
   */
  exportModel() {
    return Object.assign({}, this._option);
  }
}
