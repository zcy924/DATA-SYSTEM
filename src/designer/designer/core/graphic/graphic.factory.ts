import { ReportPageInner } from '../page/report/page.inner';
import { regionMap } from '../../config/region.map';
import { session } from '../../utils/session';
import { GraphicCreateAction } from '../operate/graphic.create.action';
import { ReportPageOuter } from '../page/report/page.outer';
import { RegionController } from '../region/region.controller';
import { GraphicWrapper } from './graphic.wrapper';

class GraphicFactory {
  /**
   *
   * @param {string} graphicName
   * @param {ReportPageInner} page
   * @param {number} x
   * @param {number} y
   * @param configOption  创建图片的时候，会从外部传入图片信息
   * @returns {{region: RegionController; graphic: GraphicWrapper}}
   */
  newGraphicByName(page: ReportPageOuter, graphicName: string, x: number, y: number, configOption?: any) {
    page.actionManager.execute(new GraphicCreateAction(graphicName, page.reportPage, x, y, configOption));
  }

  createByName(name: string, page: ReportPageOuter, x: number, y: number) {
    return this.newGraphicByName(page, name, x, y);
  }

  paste(graphicMeta: any, x?: number, y?: number) {
    if (regionMap.has(graphicMeta.region.regionKey)) {
      const region: RegionController = new (regionMap.get(graphicMeta.region.regionKey))(session.currentPage.reportPage);

      region.init(graphicMeta.region.regionOption);

      if (Number.isInteger(x) && Number.isInteger(y)) {
        region.setCoordinates(x, y);
      }

      const graphic = new GraphicWrapper(region);
      graphic.init(graphicMeta.graphic);

      setTimeout(() => {
        graphic.resize();
      }, 200);

    }
  }
}

export const graphicFactory = new GraphicFactory();
