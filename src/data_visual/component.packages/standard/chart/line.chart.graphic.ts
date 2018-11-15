import { Grid } from './echart.interface/grid';
import { Axis } from './echart.interface/axis';
import { Title } from './echart.interface/title';
import { LineSeriesConfig } from './echart.interface/series/line.series';
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
  constructor(region: any) {
    super(region);
  }

  init(region: any, wrapper: any) {
    super.init();
    region.addMethod && region.addMethod('desc', () => {
      return {
        id: wrapper.uuid,
        displayName: `折线图 ${wrapper.uuid}`,
        icon: 'u-icn-chart-line',
      };
    });
  }
}
