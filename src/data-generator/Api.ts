export interface Api{
  url: string;
  method: string;
  headers?: any;
  params?: any;
  body?: any;
  generator: string;
}
