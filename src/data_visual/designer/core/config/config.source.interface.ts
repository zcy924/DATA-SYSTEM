import { DesignerGraphicConfig, Type } from '@barca/shared';

export interface IConfigSourceOption {
  graphicId: string;
  graphicConfigClass: Type<DesignerGraphicConfig>;
  option: any;
}
