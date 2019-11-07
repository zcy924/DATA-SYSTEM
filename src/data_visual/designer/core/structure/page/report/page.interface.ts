import { Observable } from 'rxjs';
import { Region } from '../../region/region';
import { ActionManager } from '../../../operate/action.manager';
import { ConfigSourceManager } from '../../../config/config.source.manager';
import { DataSourceManager, IDestroyable } from '@data-studio/shared';

/**
 * Page接口  供region，graphic等子元素引用
 */
export interface IReportPageInnerFacade extends IDestroyable{

  mode: 'design' | 'runtime';
  /**
   * region根据scale计算位移和伸缩
   */
  scale: number;

  // 当前页面中所有图表的最小index
  bottomIndex: number;

  // 当前页面中所有图表的最大index
  topIndex: number;

  // 当前获得焦点的region
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
}
