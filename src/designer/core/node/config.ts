import {Type} from '@angular/core/src/type';
import {RegionController} from '@core/node/region/region.controller';

import {IGraphicView} from '@core/node/graphic.view/graphic.view';
import { IGraphic } from '@shared/core/graphic/graphic';

interface GraphicItem {
  regionClass: Type<RegionController>;
  graphicClass: Type<IGraphic>;
  contentClass: Type<IGraphicView>;
}
