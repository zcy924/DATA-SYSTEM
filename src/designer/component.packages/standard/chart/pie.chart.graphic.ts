import {RegionController} from '../../../designer/core/region/region.controller';

import {Title} from '../../../core/node/graphic.view/chart/echart.interface/title';
import {Grid} from '../../../core/node/graphic.view/chart/echart.interface/grid';
import {Axis} from '../../../core/node/graphic.view/chart/echart.interface/axis';
import {PieSeriesConfig} from '../../../core/node/graphic.view/chart/echart.interface/series/pie.series';
import { ChartGraphic } from './chart.graphic';

export interface ChartPieConfig {
  title?: Title;
  dataset?: any;
  grid?: Grid;
  xAxis?: Axis;
  yAxis?: Axis;
  series?: Array<PieSeriesConfig>;
  color?: Array<string>;
}

export class PieChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }
}
