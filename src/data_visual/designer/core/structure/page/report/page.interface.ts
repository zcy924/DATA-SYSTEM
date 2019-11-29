import {
  GraphicOption,
  IDestroyable,
  IFileStructure,
  IModelSource,
} from '@data-studio/shared';
import { Observable } from 'rxjs';
import { Region } from '../../region/region';
import { ActionManager } from '../../../operate/action.manager';
import { ModelSourceManager } from '../../../model/model.source.manager';
import { PageView } from './page.view';
import { RegionManager } from '../../../manager/region.manager';
import { SelectManager } from '../../../manager/select.manager';
import { ActivateManager } from '../../../manager/activate.manager';

export type OpenMode = 'design' | 'runtime';

export interface IReportPage extends IDestroyable {
  offset;

  focusRegion;

  regionArray$: Observable<Array<Region>>;

  actionManager: ActionManager;

  load(file: IFileStructure);

  createGraphic(graphicName: string, x: number, y: number, configSourceOption?: any);

  paste(componentOption: any, x?: number, y?: number);

  save(): any;

  /**
   * 清空页面中所有图表
   */
  clear();

  enterFullScreen();
}

export interface IReportPageKernel extends IDestroyable {
  readonly mode: OpenMode;
  readonly theme: string;
  view: PageView;
  regionManager: RegionManager;
  selectManager: SelectManager;
  activateManager: ActivateManager;
  actionManager: ActionManager;
  modelSourceManager: ModelSourceManager;
}

/**
 * Page接口  供region，graphic等子元素引用
 */
export interface IReportPageInner extends IDestroyable {

  mode: OpenMode;

  readonly theme: string;
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

  modelSourceManager: ModelSourceManager;

  actionManager: ActionManager;

  addChild(region: Region);

  removeChild(region: Region);

  select(region: Region);

  ctrlSelect(region: Region);

  isSelected(region: Region): boolean;

  activateRegion(region: Region);

  regionResize(region: Region);

  getModelSource(graphicOption: GraphicOption): IModelSource;
}
