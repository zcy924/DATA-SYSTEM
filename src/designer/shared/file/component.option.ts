export interface IComponentOption {
  region: {
    regionKey: string;
    regionOption?: {
      width?: number;
      height?: number;
    };
  };
  graphic: IGraphicOption
}

export interface IRegionOption {
  zIndex: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IGraphicOption {
  graphicKey?: string;
  graphicId?: string;
  configOption?: any;
  dataSourceKey?: string;
}

