import { ReportPageKernel } from './page.kernel';
import { IReportPageInnerFacade } from './page.interface';
import { Observable } from 'rxjs';
import { Region } from '../../region/region';


export class ReportPageInnerFacadeImpl implements IReportPageInnerFacade {

  focusRegion: Region;

  constructor(private _pageKernel: ReportPageKernel) {

  }

  get mode() {
    return this._pageKernel.mode;
  }

  set scale(value: number) {
    this._pageKernel.view.scale = value;
  }

  get scale(): number {
    return this._pageKernel.view.scale;
  }

  get bottomIndex() {
    return this._pageKernel.regionManager.bottomIndex;
  }

  get topIndex() {
    return this._pageKernel.regionManager.topIndex;
  }

  get regionArray(): Array<Region> {
    return this._pageKernel.regionManager.regionArray;
  }

  get regionArray$(): Observable<Array<Region>> {
    return this._pageKernel.regionManager.regionArray$;
  }

  get selectedArray(): Array<Region> {
    return this._pageKernel.selectManager.selectedArray;
  }

  get actionManager() {
    return this._pageKernel.actionManager;
  }


  addChild(child: Region) {
    this._pageKernel.regionManager.add(child);
    this._pageKernel.view.$grid.append(child.$element);
  }

  removeChild(child: Region) {
    this._pageKernel.selectManager.delete(child);
    this._pageKernel.regionManager.remove(child);
  }

  select(region: Region) {
    this._pageKernel.selectManager.select(region);
  }

  ctrlSelect(region: Region) {
    this._pageKernel.selectManager.ctrlSelect(region);
  }

  isSelected(region: Region) {
    return this._pageKernel.selectManager.include(region);
  }

  activateRegion(region: Region) {
    this._pageKernel.activateManager.activate(region);
  }

  regionResize(region: Region) {
    this._pageKernel.activateManager.regionResize(region);
  }

  getMockConfigSource(option: any) {
    return this._pageKernel.configSourceManager.getMockConfigSource(option);
  }

  getConfigSource(option: any) {
    return this._pageKernel.configSourceManager.getConfigSource(option);
  }

  getDataSource(id: string) {
    return this._pageKernel.dataSourceManager.getDataSource(id);
  }

  destroy() {
    this._pageKernel = null;
  }
}
