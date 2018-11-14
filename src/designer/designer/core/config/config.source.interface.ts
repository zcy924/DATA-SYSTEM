import {Type} from '@angular/core';
import {DesignGraphicConfig} from '../../../shared/core/source/config.source/design.config.source';


export interface IConfigSourceOption {
  graphicId: string;
  graphicConfigClass: Type<DesignGraphicConfig>;
  option: any;
}
