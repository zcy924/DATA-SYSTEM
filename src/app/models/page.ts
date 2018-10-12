export class Page {
  constructor(public pageSize = 10,
              public curRow = 10,
              public totalRow = 0,
              public totalPage = 0,
              public curPage = 1) {
  }
}
