import { Title } from './echart.interface/title';
import { Grid } from './echart.interface/grid';
import { Axis } from './echart.interface/axis';
import { PieSeriesConfig } from './echart.interface/series/pie.series';
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
  constructor(region: any) {
    super(region);
  }
}
