import {RegionController} from '../../../core/node/region/region.controller';
import { ChartGraphic } from './chart.graphic';

export class WordCloudChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }
}
