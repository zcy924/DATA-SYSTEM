import { Region } from '../structure/region/region';
import { RegionState } from '../structure/region/region.model';
import { Destroyable } from '@data-studio/shared';

enum SelectStatus {
  default, single, multi
}

/**
 * 被删除的region如何剔除
 */
class Store extends Destroyable {
  private _selectArray: Array<Region> = [];

  constructor() {
    super();
    this.onDestroy(() => {
      this._selectArray.splice(0);
      this._selectArray = null;
    });
  }

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
}

abstract class State extends Destroyable {
  protected constructor(protected _store: Store) {
    super();
    this.onDestroy(() => {
      this._store = null;
    });
  }

  abstract select(region: Region);

  abstract ctrlSelect(region: Region);
}

/**
 * 页面未选中任何region
 */
class StateDefault extends State {
  constructor(store) {
    super(store);
  }

  select(region: Region) {
    this._store.addRegion(region);
  }

  ctrlSelect(region: Region) {
    this._store.addRegion(region);
  }
}

class StateSelected extends State {
  constructor(store: Store) {
    super(store);
  }

  select(region: Region) {
    if (this._store.include(region)) {
      return;
    } else {
      this._store.clear();
      this._store.addRegion(region);
    }
  }

  ctrlSelect(region: Region) {
    if (this._store.include(region)) {
      this._store.removeRegion(region);
    } else {
      this._store.addRegion(region);
    }
  }
}

class StateMultiSelected extends State {
  constructor(store) {
    super(store);
  }

  select(region: Region) {
    this._store.clear();
    this._store.addRegion(region);
  }

  ctrlSelect(region: Region) {
    if (this._store.include(region)) {
      this._store.removeRegion(region);
    } else {
      this._store.addRegion(region);
    }
  }
}

/**
 * 管理被选中的region
 */
export class SelectManager extends Store {
  // 当前页面没有任何region被选中
  private _stateDefault: State;
  // 当前页面有且只有一个region被选中
  private _stateSelected: State;
  // 当前页面至少有两个region被选中
  private _stateMultiSelected: State;

  constructor() {
    super();
    this._stateDefault = new StateDefault(this);
    this._stateSelected = new StateSelected(this);
    this._stateMultiSelected = new StateMultiSelected(this);

    this.onDestroy(() => {
      this._stateDefault = null;
      this._stateSelected = null;
      this._stateMultiSelected = null;
    });
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

  /**
   * 用户点击region，选中图表
   * 之前选择的图表会被清空
   * @param region
   */
  select(region: Region) {
    this.state.select(region);
  }

  /**
   * 摁住ctrl键，点击region
   * @param region
   */
  ctrlSelect(region: Region) {
    this.state.ctrlSelect(region);
  }
}
