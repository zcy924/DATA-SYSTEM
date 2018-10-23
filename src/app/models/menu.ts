export class Menu {
  public text: String;
  public key?: String;
  public isLeaf?: Boolean;
  public isGroup?: Boolean;
  public icon?: String;
  public link?: String;
  public children?: Array<Menu>;
  constructor() {
  }
}
