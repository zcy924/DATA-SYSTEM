import {DefaultDataGenerator} from "./DefaultDataGenerator";
import {TextDataGenerator} from "./TextDataGenerator";
import {XmlDataGenerator} from "./XmlDataGenerator";
import {Api} from "./Api";
import {Observable} from "rxjs/internal/Observable";

export class DataGenerator {
  api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  getResponse$(api: Api):Observable<any> {
    switch (api.generator) {
      case 'XML':
        const xmlDataGenerator = new XmlDataGenerator(api);
        return xmlDataGenerator.fetchData();
        break;
      case 'TEXT':
        const textDataGenerator = new TextDataGenerator(api);
        return textDataGenerator.fetchData();
        break;
      case  'JSON':
        const defaultDataGenerator = new DefaultDataGenerator(api);
        return defaultDataGenerator.fetchData();
      default:
        const DataGenerator = new DefaultDataGenerator(api);
        return DataGenerator.fetchData();
    }
  }

}
