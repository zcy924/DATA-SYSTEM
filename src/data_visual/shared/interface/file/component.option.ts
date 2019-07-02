export interface IComponentOption {
  region: {
    regionKey: string;
    regionOption?: {
      width?: number;
      height?: number;
    };
  };
  graphic: IGraphicOption;
}

export interface IRegionOption {
  zIndex: number;
  left: number;
  top: number;
  width: number;
  height: number;
  [key: string]: any;
}

export interface IGraphicOption {
  graphicPath?: string;
  graphicId?: string;
  configOption?: any;
  dataSourceKey?: string;
}

export class GraphicOption {
  constructor(private _option: IGraphicOption) {
  }

  set graphicId(id: string) {
    this._option.graphicId = id;
  }

  get graphicId() {
    return this._option.graphicId;
  }

  get graphicPath() {
    return this._option.graphicPath;
  }

  get graphicKey() {
    return this.graphicPath ? this.graphicPath.split('$')[1] : null;
  }


  set configOption(value) {
    this._option.configOption = value;
  }

  get configOption() {
    return this._option.configOption;
  }

  set dataSourceKey(value) {
    this._option.dataSourceKey = value;
  }

  get dataSourceKey() {
    return this._option.dataSourceKey;
  }

  get value() {
    return this._option;
  }
}

