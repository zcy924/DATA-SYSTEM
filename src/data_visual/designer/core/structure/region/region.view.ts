import { ViewEventTarget } from '@data-studio/shared';

export abstract class RegionView extends ViewEventTarget {
  $element: JQuery;
  $fill: JQuery;

  /**
   * region view 的初始化工作，比如创建dom结构、事件转换等
   */
  abstract init();

  /**
   * 刷新视图
   */
  abstract refresh();
}
