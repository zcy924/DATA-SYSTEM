const windowMask = `
<div class="m-window m-window-mask" style="z-index: 405;">
  <div style="width: 1000px;height: 700px;background-color: #f8f6f1;position:absolute;left: 50%; top: 50%;transform: translate(-50%, -50%);overflow: hidden;border-radius: 2px">
    <div style="display: flex;width: 100%;height: 100%;align-items: stretch;flex-direction: column;">
      <div style="flex-basis: 36px;background-color: #363d3f;">
      <h3 style="line-height: 36px;margin: 0 10px;color: white;display: inline-block;">Echart 配置项编辑</h3>
      <i class="u-icn u-icn-close" style="margin: 5px;float: right;line-height:36px;color: #e1e1e1;"></i>
      </div>
      <div style="flex-basis: 1px;flex-grow: 1;flex-shrink: 1;display: flex;align-items: stretch;">
        <div style="flex-grow: 0;flex-basis: 500px">
          <pre id="editor" style="width: 100%;height: 100%;">
              var option;
              return option;
          </pre>
        </div>
        <div style="flex-grow: 1;flex-shrink: 0;flex-basis: 1px;">
          <div id="echart-example" style="width:100%;height: 100%;">
         
          </div>
        </div>
      </div>
      <div style="flex-basis: 48px;background-color: #363d3f;text-align: center;line-height: 48px">
        <button id="refresh" class="ant-btn ant-btn-default"><span>刷新</span></button>
        <button id="confirm" class="ant-btn ant-btn-default"><span>保存</span></button>
      </div>
    </div>
  </div>
</div>
`;


/**
 * 数据模型选择弹出框
 */
class PopupEditor {
  $mask: JQuery;
  private _refresh$: JQuery;
  private _chart$: JQuery;

  private _edit;
  private _oldValue = null;

  private _callback;

  constructor() {
    this.$mask = $(windowMask);
    this._refresh$ = this.$mask.find('#refresh');
    this._chart$ = this.$mask.find('#echart-example');
    const myChart = echarts.init(this._chart$[0]);
    const editor = this._edit = ace.edit(this.$mask.find('#editor')[0]);
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode('ace/mode/javascript');
    this._refresh$.click(() => {
      const generator = editor.getValue(), fun = new Function(`
      ${generator}
      return option;
      `);
      try {
        const config = fun();
        myChart.clear();
        myChart.setOption(config);
        myChart.resize();
      } catch (e) {
        console.error(e);
      }

    });
    this.$mask.on('click', ($event) => {
      if ($event.target === this.$mask[0]) {
        this.close();
      }
    });
    this.$mask.find('.u-icn-close').click(() => {
      this.close();
    });
    this.$mask.find('#confirm').click(() => {
      const text = editor.getValue();
      if (!!this._callback && (text !== this._oldValue)) {
        this._callback(text);
        this._callback = null;
      }
      myChart.clear();
      this.close();
    });
  }

  open(content, callback: (value: string) => void) {
    this._edit.setValue(this._oldValue = content);
    this._callback = callback;
    $('body').append(this.$mask);
  }

  close() {
    this._oldValue=null;
    this._callback=null;
    this.$mask.detach();
  }
}

export const popupEditor = new PopupEditor();
