export interface IRegion {
  $element: JQuery;
  page: any;

  addChild(child: any);

  updateTheme(theme: string);

  destroy();
}
