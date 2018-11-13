import {RegionController} from '../../../core/node/region/region.controller';
import { ChartGraphic } from './chart.graphic';

export class LinesChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }
}