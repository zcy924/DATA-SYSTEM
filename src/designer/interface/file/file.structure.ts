export interface IFileStructure {
  name: string;
  manifest?: {
    version: string;
    vendor: {
      id: string;
      name: string;
    };
    designer: {
      version: string;
    };
  };
  dependencies: Array<string>;
  main: {
    option: any;
    children: Array<IFileElement>;
  };
  data?: Array<any>;
}

interface IFileElement {
  region: {
    regionKey: string;
    regionOption: any
  };
  graphic: {
    graphicKey: string;
    configOption: any;
    dataSourceKey: string;
  }
}
