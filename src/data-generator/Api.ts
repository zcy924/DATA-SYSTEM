export class Api {

  url: string;
  method: string;
  headers: any;
  params: any;
  body: any;

  constructor(method,headers,url,params,body){
    this.method = method;
    this.headers = headers;
    this.url = url;
    this.params = params;
    this.body = body;
  }

}
