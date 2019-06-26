import {Type} from '@angular/core/src/type';

import { IGraphic } from '../../shared/core/graphic/graphic';
import { Region } from './region/region';
import { IGraphicView } from '../../shared/core/graphic/graphic.view';

interface GraphicItem {
  regionClass: Type<Region>;
  graphicClass: Type<IGraphic>;
  contentClass: Type<IGraphicView>;
}
