import {IDataGenerator} from "./IDataGenerator";
import {Api} from "./Api";

export class TextDataGenerator implements IDataGenerator {
  api: Api;

  constructor(api:Api) {
    this.api = api;
  }

  fetchData() {

  }
}
