
import { Observable } from 'rxjs';
import { Region } from '../../region/region';

/**
 *
 */
export interface IReportPageInnerFacade {

  mode: 'design' | 'runtime';
  /**
   * region根据scale计算位移和伸缩
   */
  scale: number;

  bottomIndex: number;

  topIndex: number;

  focusRegion: Region;

  regionArray: Array<Region>;

  regionArray$: Observable<Array<Region>>;

  selectedArray: Array<Region>;

  addChild(region: Region);

  removeChild(region: Region);

  select(region: Region);

  ctrlSelect(region: Region);

  isSelected(region: Region): boolean;

  activateRegion(region: Region);

  regionResize(region: Region);

  getMockConfigSource(option: any);

  getConfigSource(option: any);

  getDataSource(id: string);

  destroy();
}
