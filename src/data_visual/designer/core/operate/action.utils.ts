import { IReportPageInnerFacade } from '../structure/page/report/page.interface';
import { IComponentOption } from '@barca/shared';
import { regionDefinitionMap } from '../structure/region/region.definition.map';
import { Region } from '../structure/region/region';
import { GraphicWrapper } from '../structure/graphic/graphic.wrapper';

export function addGraphicToPage(pageInnerFacade: IReportPageInnerFacade, componentOption: IComponentOption, left?: number, top?: number) {

  if (regionDefinitionMap.has(componentOption.region.regionKey)) {
    // 创建region
    // 第一步创建region对象
    const region: Region = new (regionDefinitionMap.get(componentOption.region.regionKey))(pageInnerFacade);
    // 第二步初始化region
    region.init(componentOption.region.regionOption);

    if (Number.isInteger(left) && Number.isInteger(top)) {
      region.coordinates = {
        left, top,
      };
    }

    const graphicWrapper = new GraphicWrapper(region);
    graphicWrapper.init(componentOption.graphic);

    setTimeout(() => {
      if (componentOption.region.regionOption) {
        const { width, height } = componentOption.region.regionOption;
        region.dimensions = { width, height };
      }
      graphicWrapper.resize();
    }, 200);

    return { region, graphicWrapper };
  }
}
