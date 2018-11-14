import { RegionController } from '../../../designer/core/region/region.controller';

import { Grid } from './echart.interface/grid';
import { BarSeriesConfig } from './echart.interface/series/bar.series';
import { Axis } from './echart.interface/axis';
import { Title } from './echart.interface/title';
import { GraphicWrapper } from '../../../designer/core/graphic/graphic.wrapper';
import { ChartGraphic } from './chart.graphic';


export interface ChartBarOption {
  title?: Title;
  tooltip?: any;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<BarSeriesConfig>;
  color?: Array<string>;
}

export class BarChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }

  init(region: RegionController, wrapper: GraphicWrapper) {
    super.init();
    region.addMethod && region.addMethod('desc', () => {
      return {
        id: wrapper.uuid,
        displayName: `柱状图 ${wrapper.uuid}`,
        icon: 'u-icn-chart-bar',
      };
    });
  }
}
