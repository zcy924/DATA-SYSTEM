import { ChartGraphic } from './chart.graphic';
import { RegionController } from '../../../designer/core/region/region.controller';

export class RingChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }
}
