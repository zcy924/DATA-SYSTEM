import {DesignGraphicConfig} from '../../../shared/core/source/config.source/design.config.source';
import { Type } from '../../../shared/common/type';


export interface IConfigSourceOption {
  graphicId: string;
  graphicConfigClass: Type<DesignGraphicConfig>;
  option: any;
}
