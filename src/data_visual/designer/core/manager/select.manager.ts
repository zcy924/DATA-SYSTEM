import { Region } from '../region/region';
import { RegionState } from '../region/region.model';

enum SelectStatus {
  default, single, multi
}

/**
 * 被删除的region如何剔除
 */
class Store {
  private _selectArray: Array<Region> = [];

  get status(): SelectStatus {
    switch (this._selectArray.length) {
      case 0:
        return SelectStatus.default;
      case 1:
        return SelectStatus.single;
      default:
        return SelectStatus.multi;
    }
  }

  get selectedArray() {
    return this._selectArray.slice(0);
  }

  /**
   * 判断传入元素是否包含在多选集合中
   *
   * 删除元素的时候，判断该Region是否被选中
   * 如果没有被选中 那么只删除当前region
   * 否则删除r被选中的region组
   * @param {Region} region
   * @returns {boolean}
   */
  include(region: Region) {
    return this._selectArray.includes(region);
  }

  addRegion(region: Region) {
    if (!this.include(region)) {
      this._selectArray.push(region);
      if (this._selectArray.length > 1) {
        this._selectArray.forEach((value) => {
          if (value.state !== RegionState.multiSelected) {
            value.state = RegionState.multiSelected;
          }
        });
      } else {
        region.state = RegionState.selected;
      }
    }
  }

  removeRegion(region: Region) {
    if (this._selectArray.includes(region)) {
      region.state = RegionState.default;
      this._selectArray.splice(this._selectArray.indexOf(region), 1);

      if (this._selectArray.length === 1) {
        this._selectArray[0].state = RegionState.selected;
      }
    }
  }

  clear() {
    while (this._selectArray.length > 0) {
      const region = this._selectArray.pop();
      region.state = RegionState.default;
    }
  }

  /**
   * 当元素从页面删除的时候 需要清空selectManager对它的引用
   * @param region
   */
  delete(region: Region) {
    if (this.include(region)) {
      this._selectArray.splice(this._selectArray.indexOf(region), 1);
    }
  }

  destroy() {
    this._selectArray.splice(0);
    this._selectArray = null;
  }
}

abstract class State {
  protected constructor(protected store: Store) {
  }

  abstract select(region: Region);

  abstract ctrlSelect(region: Region);
}

class StateDefault extends State {
  constructor(store) {
    super(store);
  }

  select(region: Region) {
    this.store.addRegion(region);
  }

  ctrlSelect(region: Region) {
    this.store.addRegion(region);
  }
}

class StateSelected extends State {
  constructor(store: Store) {
    super(store);
  }

  select(region: Region) {
    if (this.store.include(region)) {
      return;
    } else {
      this.store.clear();
      this.store.addRegion(region);
    }
  }

  ctrlSelect(region: Region) {
    if (this.store.include(region)) {
      this.store.removeRegion(region);
    } else {
      this.store.addRegion(region);
    }
  }
}

class StateMultiSelected extends State {
  constructor(store) {
    super(store);
  }

  select(region: Region) {
    this.store.clear();
    this.store.addRegion(region);
  }

  ctrlSelect(region: Region) {
    if (this.store.include(region)) {
      this.store.removeRegion(region);
    } else {
      this.store.addRegion(region);
    }
  }
}

export class SelectManager extends Store implements ISelectManager {
  private _stateDefault: State;
  private _stateSelected: State;
  private _stateMultiSelected: State;

  constructor() {
    super();
    this._stateDefault = new StateDefault(this);
    this._stateSelected = new StateSelected(this);
    this._stateMultiSelected = new StateMultiSelected(this);
  }

  private get state(): State {
    switch (this.status) {
      case SelectStatus.default:
        return this._stateDefault;
      case SelectStatus.single:
        return this._stateSelected;
      case SelectStatus.multi:
        return this._stateMultiSelected;
    }
  }

  select(region: Region) {
    this.state.select(region);
  }

  ctrlSelect(region: Region) {
    this.state.ctrlSelect(region);
  }

  destroy() {
    super.destroy();
    this._stateDefault = null;
    this._stateSelected = null;
    this._stateMultiSelected = null;
  }
}

export interface ISelectManager {
  selectedArray;

  select(region: Region);

  ctrlSelect(region: Region);

  include(region: Region): boolean;

  delete(region: Region);

  clear();

  destroy();
}
