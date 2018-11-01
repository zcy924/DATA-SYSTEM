export interface IFileStructure {
  name: string;
  creator: {
    version: string;
  };
  manifest?: {
    version: string;
    createBy: string;
    vendor: any;
  };
  dependencies: Array<string>;
  main: {
    pageOption: any;
    children: Array<IRegionOption>;
  };

  page: any;
}

interface IRegionOption {

}
