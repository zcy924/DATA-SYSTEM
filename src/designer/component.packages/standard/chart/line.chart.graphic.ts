import {RegionController} from '../../../core/node/region/region.controller';

import {Grid} from '../../../core/node/graphic.view/chart/echart.interface/grid';
import {Axis} from '../../../core/node/graphic.view/chart/echart.interface/axis';
import {Title} from '../../../core/node/graphic.view/chart/echart.interface/title';
import {LineSeriesConfig} from '../../../core/node/graphic.view/chart/echart.interface/series/line.series';
import {GraphicWrapper} from '../../../core/node/graphic/graphic.wrapper';
import { ChartGraphic } from './chart.graphic';

export interface ChartLineOption {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<LineSeriesConfig>;
  color?: Array<string>;
}

export class LineChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }

  init(region: RegionController, wrapper: GraphicWrapper) {
    super.init();
    region.addMethod('desc', () => {
      return {
        id: wrapper.uuid,
        displayName: `折线图 ${wrapper.uuid}`,
        icon: 'u-icn-chart-line'
      };
    });
  }
}
