// # 3rd Party Library
// If the library doesn't have typings available at `@types/`,
// you can still use it by manually adding typings for it
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

declare var hljs: any;
declare var BalloonEditor: any;

interface Echart {
  setOption: Function;
  getOption: Function;
  showLoading: Function;
  hideLoading: Function;
  on: Function;
  off: Function;
  resize: Function;
  getWidth: Function;
  getHeight: Function;
  clear: Function;
  dispose: Function;
  isDisposed: Function;
}

interface Array<T> {
  contain(item): boolean;
}
