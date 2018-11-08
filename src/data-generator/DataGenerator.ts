import {DefaultDataGenerator} from "./DefaultDataGenerator";
import {TextDataGenerator} from "./TextDataGenerator";
import {XmlDataGenerator} from "./XmlDataGenerator";
import {Api} from "./Api";

export class DataGenerator {
  constructor() {
  }

  useDataGenerator(api: Api) {
    switch (api.generator){
      case 'xmlDataGenerator':
        const xmlDataGenerator = new XmlDataGenerator(api);
        xmlDataGenerator.fetchData();
        break;
      case 'textDataGenerator':
        const textDataGenerator = new TextDataGenerator(api);
        textDataGenerator.fetchData();
        break;
      case  'defaultDataGenerator':
        const defaultDataGenerator = new DefaultDataGenerator(api);
        defaultDataGenerator.fetchData();
    }
  }

}
