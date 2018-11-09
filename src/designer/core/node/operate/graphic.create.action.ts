import { regionMap } from '@core/node/config/region.map';
import { RegionController } from '@core/node/region/region.controller';
import { graphicMetaMap } from '@core/node/config/default.graphic.meta.map';
import { GraphicWrapper } from '@core/node/graphic/graphic.wrapper';
import { IAction } from '@core/node/operate/action';
import { IReportPage } from '@core/node/page/report/page.interface';
import { ComponentRepositoryManager } from '@shared/manager/component.repository.manager';
import { IComponentOption } from '@shared/file/component.option';

export class GraphicCreateAction implements IAction {

  private _region: RegionController;

  constructor(private _graphicPath: string, private _page: IReportPage,
              private _x: number, private _y: number, private _configOption?: any) {

  }

  forward() {
    const compRepoManager = ComponentRepositoryManager.getInstance();
    console.log('XXXXXX', compRepoManager.has('standard$bar.chart.graphic'));
    // 是否存在图表的默认定义
    if (compRepoManager.has(this._graphicPath)) {
      const componentOption: IComponentOption = compRepoManager.getComponentMeta(this._graphicPath).componentOption;

      if (regionMap.has(componentOption.region.regionKey)) {
        const region: RegionController = new (regionMap.get(componentOption.region.regionKey))(this._page);
        region.init(null);
        region.setCoordinates(this._x, this._y);
        if (componentOption.region.regionOption) {
          const { width, height } = componentOption.region.regionOption;
          region.setDimensions(width, height);
        }

        const graphicWrapper = new GraphicWrapper(region);
        if (this._configOption) {
          graphicWrapper.init(Object.assign({}, componentOption.graphic, { configOption: JSON.parse(JSON.stringify(this._configOption)) }));
        } else {
          graphicWrapper.init(JSON.parse(JSON.stringify(componentOption.graphic)));
        }


        setTimeout(() => {
          graphicWrapper.resize();
        }, 200);

        this._region = region;

        return {
          region, graphicWrapper,
        };
      }
    }
  }

  backward() {
    if (this._region) {
      this._region.destroy();
      this._region = null;
    }
  }
}
