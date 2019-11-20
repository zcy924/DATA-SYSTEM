import {
  IDestroyable,
  RegionState,
  Coordinates,
  IGraphicOption, Rectangle,
} from '@data-studio/shared';
import { IReportPageInner } from '../page/report/page.interface';
import { GraphicWrapper } from '../graphic/graphic.wrapper';

/**
 * region
 */
export interface Region extends IDestroyable {
  readonly $element: JQuery;
  readonly page: IReportPageInner;
  state: RegionState;
  index: number;
  coordinates: Coordinates; // 图表移动
  rectangle: Rectangle;// 图表缩放
  readonly description: any;

  init(regionOption: any, { graphicPath, graphicOption }: { graphicPath: string, graphicOption?: IGraphicOption });

  addChild(graphic: GraphicWrapper);

  updateTheme(theme: string);

  switchDataSource(id: string);

  getOption();
}

