import {RegionController} from '../../../designer/core/region/region.controller';
import { ChartGraphic } from './chart.graphic';


export class MapChartGraphic extends ChartGraphic {
  constructor(region: RegionController) {
    super(region);
  }
}
