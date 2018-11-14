import {Type} from '@angular/core/src/type';

import { IGraphic } from '../../shared/core/graphic/graphic';
import { RegionController } from './region/region.controller';
import { IGraphicView } from '../../component.packages/standard/graphic.view';

interface GraphicItem {
  regionClass: Type<RegionController>;
  graphicClass: Type<IGraphic>;
  contentClass: Type<IGraphicView>;
}
