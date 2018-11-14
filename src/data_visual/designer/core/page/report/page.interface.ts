
import { Observable } from 'rxjs';
import { RegionController } from '../../region/region.controller';

/**
 *
 */
export interface IReportPage {

  mode: 'design' | 'runtime';
  /**
   * region根据scale计算位移和伸缩
   */
  scale: number;

  bottomIndex: number;

  topIndex: number;

  focusRegion: RegionController;

  regionArray: Array<RegionController>;

  regionArray$: Observable<Array<RegionController>>;

  selectedArray: Array<RegionController>;

  addChild(region: RegionController);

  removeChild(region: RegionController);

  select(region: RegionController);

  ctrlSelect(region: RegionController);

  isSelected(region: RegionController): boolean;

  activateRegion(region: RegionController);

  regionResize(region: RegionController);

  getMockConfigSource(option: any);

  getConfigSource(option: any);

  getDataSource(id: string);

  destroy();
}
