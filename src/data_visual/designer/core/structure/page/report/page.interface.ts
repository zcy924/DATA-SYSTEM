import { Observable } from 'rxjs';
import { Region } from '../../region/region';
import { ActionManager } from '../../../operate/action.manager';
import { ConfigSourceManager } from '../../../config/config.source.manager';
import { DataSourceManager } from '@data-studio/shared';

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

  configSourceManager: ConfigSourceManager;

  dataSourceManager: DataSourceManager;

  actionManager: ActionManager;

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
