import { Destroyable, IRegionDesigner, RegionState } from '@data-studio/shared';

enum SelectStatus {
  default, single, multi
}

/**
 * 被删除的region如何剔除
 */
class Store extends Destroyable {
  private _selectedArray: Array<IRegionDesigner> = [];

  constructor() {
    super();
    this.onDestroy(() => {
      this._selectedArray.splice(0);
      this._selectedArray = null;
    });
  }

  /**
   * 获取选中状态
   */
  get status(): SelectStatus {
    switch (this._selectedArray.length) {
      case 0:
        return SelectStatus.default;
      case 1:
        return SelectStatus.single;
      default:
        return SelectStatus.multi;
    }
  }

  get selectedArray() {
    return this._selectedArray.slice(0);
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
  include(region: IRegionDesigner) {
    return this._selectedArray.includes(region);
  }

  addRegion(region: IRegionDesigner) {
    if (!this.include(region)) {
      this._selectedArray.push(region);
      if (this._selectedArray.length > 1) {
        this._selectedArray.forEach((value) => {
          if (value.state !== RegionState.multiSelected) {
            value.state = RegionState.multiSelected;
          }
        });
      } else {
        region.state = RegionState.selected;
      }
    }
  }

  removeRegion(region: IRegionDesigner) {
    if (this._selectedArray.includes(region)) {
      region.state = RegionState.default;
      this._selectedArray.splice(this._selectedArray.indexOf(region), 1);

      if (this._selectedArray.length === 1) {
        this._selectedArray[0].state = RegionState.selected;
      }
    }
  }

  clear() {
    while (this._selectedArray.length > 0) {
      const region = this._selectedArray.pop();
      region.state = RegionState.default;
    }
  }

  /**
   * 当元素从页面删除的时候 需要清空selectManager对它的引用
   * @param region
   */
  delete(region: IRegionDesigner) {
    if (this.include(region)) {
      this._selectedArray.splice(this._selectedArray.indexOf(region), 1);
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

  abstract select(region: IRegionDesigner);

  abstract ctrlSelect(region: IRegionDesigner);
}

/**
 * 页面未选中任何region
 */
class StateDefault extends State {
  constructor(store) {
    super(store);
  }

  select(region: IRegionDesigner) {
    this._store.addRegion(region);
  }

  ctrlSelect(region: IRegionDesigner) {
    this._store.addRegion(region);
  }
}

class StateSelected extends State {
  constructor(store: Store) {
    super(store);
  }

  select(region: IRegionDesigner) {
    if (this._store.include(region)) {
      return;
    } else {
      this._store.clear();
      this._store.addRegion(region);
    }
  }

  ctrlSelect(region: IRegionDesigner) {
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

  select(region: IRegionDesigner) {
    this._store.clear();
    this._store.addRegion(region);
  }

  ctrlSelect(region: IRegionDesigner) {
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
  select(region: IRegionDesigner) {
    this.state.select(region);
  }

  /**
   * 摁住ctrl键，点击region
   * @param region
   */
  ctrlSelect(region: IRegionDesigner) {
    this.state.ctrlSelect(region);
  }
}
