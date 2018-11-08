export interface IComponentOption {
  region: {
    regionKey: string;
    regionOption: IRegionOption;
  };
  graphic: {
    graphicKey: string;
    configOption: any;
    dataSourceKey: string;
  }
}

export interface IRegionOption {
  zIndex: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

