export interface Api{
  url: string;
  method: string;
  headers?: any;
  params?: any;
  generator: 'JSON'|'XML'|'TEXT';
}
