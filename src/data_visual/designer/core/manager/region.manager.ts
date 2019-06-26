import { Region } from '../region/region';
import { Observable, Subject } from 'rxjs';

export class RegionManager {

  private _children: Array<Region> = [];
  private _subject: Subject<Array<Region>> = new Subject();

  constructor() {

  }

  get bottomIndex(): number {
    return this._children
      .map(value => value.index)
      .sort((a, b) => a - b)[0];
  }

  get topIndex(): number {
    return this._children
      .map(value => value.index)
      .sort((a, b) => b - a)[0];
  }

  has(region: Region) {
    return this._children.includes(region);
  }

  /**
   * 如果重复调用该方法 需要避免重复添加
   * @param {Region} region
   */
  add(region: Region) {
    if (!this.has(region)) {
      this._children.push(region);
    }
    this._subject.next([...this.regionArray]);
  }

  remove(region: Region) {
    if (this.has(region)) {
      this._children.splice(this._children.indexOf(region), 1);
    }
    this._subject.next([...this.regionArray]);
  }

  get regionArray() {
    return this._children.slice(0);
  }

  get regionArray$(): Observable<Array<Region>> {
    return this._subject.asObservable();
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
    return this._children.filter((value: Region) => {
      const $element = value.$element,
        offset = $element.offset(),
        x1 = left, y1 = top,
        x2 = left + width, y2 = top + height,
        x3 = offset.left, y3 = offset.top,
        x4 = offset.left + $element.outerWidth(), y4 = offset.top + $element.outerHeight();
      return (x3 > x1 && y3 > y1 && x2 > x4 && y2 > y4);
    });
  }

  saveAs() {
    return this._children.map((item) => {
      return item.getOption();
    });
  }

  destroy() {
    if (this._subject) {
      this._subject.unsubscribe();
      this._subject = null;
    }
  }
}
