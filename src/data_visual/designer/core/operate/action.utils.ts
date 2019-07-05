import { IReportPageInnerFacade } from '../structure/page/report/page.interface';
import { IComponentOption } from '@data-studio/shared';
import { regionDefinitionMap } from '../structure/region/region.definition.map';
import { Region } from '../structure/region/region';
import { GraphicWrapper } from '../structure/graphic/graphic.wrapper';

export function addGraphicToPage(pageInnerFacade: IReportPageInnerFacade, componentOption: IComponentOption, left?: number, top?: number) {

  if (regionDefinitionMap.has(componentOption.region.regionKey)) {
    // 创建region
    // 第一步创建region对象
    const region: Region = new (regionDefinitionMap.get(componentOption.region.regionKey))(pageInnerFacade);

    if (Number.isInteger(left) && Number.isInteger(top)) {
      Object.assign(componentOption.region.regionOption, {
        left, top,
      });
    }
    // 第二步初始化region
    region.init(componentOption.region.regionOption, componentOption.graphic);

    return { region };
  }
}
