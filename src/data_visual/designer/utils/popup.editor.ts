const windowMask = `
<div class="m-window m-window-mask" style="z-index: 405;">
  <div style="width: 900px;height: 600px;background-color: #f8f6f1;position:absolute;left: 50%; top: 50%;transform: translate(-50%, -50%);">
    <div style="display: flex;width: 100%;height: 100%;align-items: stretch;flex-direction: column;">
      <div style="flex-basis: 35px;background-color: #363d3f;">
      <button style="line-height: 16px;padding: 3px 5px;" id="refresh">刷新</button>
      <i class="u-icn u-icn-close" style="margin: 5px;float: right;"></i>
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
  private _newValue = null;

  private _callback;

  constructor() {
    this.$mask = $(windowMask);
    this._refresh$ = this.$mask.find('#refresh');
    this._chart$ = this.$mask.find('#echart-example');
    this.$mask.on('click', ($event) => {
      if ($event.target === this.$mask[0]) {
        this.close();
        this._callback=null;
      }
    });
    this.$mask.find('.u-icn-close').click(() => {
      this.close();
      if(this._callback){
        this._callback(this._newValue);
        this._callback=null;
      }
    });
    var myChart = echarts.init(this._chart$[0]);
    const editor = this._edit = ace.edit(this.$mask.find('#editor')[0]);
    editor.setTheme('ace/theme/twilight');
    editor.session.setMode('ace/mode/javascript');
    this._refresh$.click(() => {
      const generator = editor.getValue(), fun = new Function(generator);
      if (generator !== this._oldValue) {
        this._newValue = generator;
      }
      try {
        const config = fun();
        myChart.clear();
        myChart.setOption(config);
        myChart.resize();
      } catch (e) {
        console.error(e);
      }

    });
  }

  open(content, callback: (value: string) => void) {
    this._edit.setValue(this._oldValue = content);
    this._newValue = null;
    this._callback=callback;
    $('body').append(this.$mask);
  }

  close() {
    this.$mask.detach();
  }
}

export const popupEditor = new PopupEditor();
