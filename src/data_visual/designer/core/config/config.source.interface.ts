import {DesignerGraphicConfig} from '../../../shared/core/source/config.source/designer.config.source';
import { Type } from '../../../shared/common/type';

export interface IConfigSourceOption {
  graphicId: string;
  graphicConfigClass: Type<DesignerGraphicConfig>;
  option: any;
}
