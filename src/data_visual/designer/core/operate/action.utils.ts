import { IReportPageInnerFacade } from '../structure/page/report/page.interface';
import { IComponentOption } from '@data-studio/shared';
import { regionDefinitionMap } from '../structure/region/region.definition.map';
import { Region } from '../structure/region/region';

/**
 * 向页面添加图表
 * @param pageInnerFacade
 * @param componentOption
 * @param left
 * @param top
 */
export function addGraphicToPage(pageInnerFacade: IReportPageInnerFacade, componentOption: IComponentOption, left?: number, top?: number) {

  const { region, graphic } = componentOption;
  if (regionDefinitionMap.has(region.regionKey)) {
    // 创建region
    // 第一步创建region对象
    const regionInstance: Region = new (regionDefinitionMap.get(region.regionKey))(pageInnerFacade);

    if (Number.isInteger(left) && Number.isInteger(top)) {
      Object.assign(region.regionOption, {
        left, top,
      });
    }
    // 第二步初始化region
    regionInstance.init(region.regionOption, graphic);

    return { region: regionInstance };
  }
}
