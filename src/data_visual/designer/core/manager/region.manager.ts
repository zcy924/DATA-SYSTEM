import { Observable, Subject } from 'rxjs';
import { Destroyable } from '@data-studio/shared';
import { Region } from '../structure/region/region';
import { IReportPageInner } from '../structure/page/report/page.interface';

/**
 * 管理页面中的所有region，每个页面都有对应的RegionManager
 */
export class RegionManager extends Destroyable {

  private _children: Array<Region> = [];
  private _subject: Subject<Array<Region>> = new Subject();

  constructor(private _pageInner: IReportPageInner) {
    super();
    this.onDestroy(() => {
      if (this._subject) {
        this._subject.unsubscribe();
        this._subject = null;
      }
      this._pageInner = null;
      this._children.splice(0);
      this._children = null;
    });
  }

  get bottomIndex(): number {
    if (this.usable) {
      return this._children.length > 0 ? this._children
        .map(value => value.index)
        .sort((a, b) => a - b)[0] : 0;
    } else {
      throw 'RegionManager已经销毁';
    }
  }

  get topIndex(): number {
    if (this.usable) {
      return this._children.length > 0 ?
        this._children.map(value => value.index)
          .sort((a, b) => b - a)[0] : 0;
    } else {
      throw 'RegionManager已经销毁';
    }
  }

  has(region: Region) {
    if (this.usable) {
      return this._children.includes(region);
    } else {
      throw 'RegionManager已经销毁';
    }
  }

  /**
   * 如果重复调用该方法 需要避免重复添加
   * @param {Region} region
   */
  add(region: Region) {
    if (this.usable) {
      if (!this.has(region)) {
        this._children.push(region);
      }
      this._subject.next([...this._children]);
    } else {
      throw 'RegionManager已经销毁';
    }
  }

  /**
   * 只删除region的引用，不调用region的destroy方法
   * @param region
   */
  remove(region: Region) {
    if (this.usable) {
      if (this.has(region)) {
        this._children.splice(this._children.indexOf(region), 1);
      }
      this._subject.next([...this._children]);
    } else {
      throw 'RegionManager已经销毁';
    }
  }

  /**
   * 清空所有region
   * 注意某些region被选中或处于activated状态
   */
  clear() {
    if (this.usable) {
      while (this._children.length > 0) {
        const region = this._children.pop();
        region.destroy();
      }
      this._subject.next([...this._children]);
    } else {
      throw 'RegionManager已经销毁';
    }
  }

  get regionArray() {
    if (this.usable) {
      return this._children.slice(0);
    } else {
      throw 'RegionManager已经销毁';
    }
  }

  get regionArray$(): Observable<Array<Region>> {
    if (this.usable) {
      return this._subject.asObservable();
    } else {
      throw 'RegionManager已经销毁';
    }
  }

  /**
   * 传入指定区域，返回包含在该区域内的region
   * @param left
   * @param top
   * @param width
   * @param height
   * @returns {Array<Region>}
   */
  public selectByBox(left, top, width, height): Array<Region> {
    if (this.usable) {
      return this._children.filter((region: Region) => {
        const $element = region.$element,
          offset = $element.offset(),
          x1 = left, y1 = top,
          x2 = left + width, y2 = top + height,
          x3 = offset.left, y3 = offset.top,
          x4 = offset.left + $element.outerWidth() * this._pageInner.scale,
          y4 = offset.top + $element.outerHeight() * this._pageInner.scale;
        return (x3 > x1 && y3 > y1 && x2 > x4 && y2 > y4);
      });
    } else {
      throw 'RegionManager已经销毁';
    }
  }

  saveAs() {
    if (this.usable) {
      return this._children.map((item) => {
        return item.getOption();
      });
    } else {
      throw 'RegionManager已经销毁';
    }
  }
}
