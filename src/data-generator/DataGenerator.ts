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
      case 'xmlDataGenerator':
        const xmlDataGenerator = new XmlDataGenerator(api);
        return xmlDataGenerator.fetchData();
        break;
      case 'textDataGenerator':
        const textDataGenerator = new TextDataGenerator(api);
        return textDataGenerator.fetchData();
        break;
      case  'defaultDataGenerator':
        const defaultDataGenerator = new DefaultDataGenerator(api);
        return defaultDataGenerator.fetchData();
      default:
        const DataGenerator = new DefaultDataGenerator(api);
        return DataGenerator.fetchData();
    }
  }

}
