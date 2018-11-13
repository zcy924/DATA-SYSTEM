import {Type} from '@angular/core/src/type';

import {IGraphicView} from '@core/node/graphic.view/graphic.view';
import { IGraphic } from '@shared/core/graphic/graphic';
import { RegionController } from '../../designer/core/region/region.controller';

interface GraphicItem {
  regionClass: Type<RegionController>;
  graphicClass: Type<IGraphic>;
  contentClass: Type<IGraphicView>;
}
