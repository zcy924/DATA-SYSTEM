import {Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import * as ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/clouds';
import 'brace/mode/json';

@Directive({
  selector: '[ace-editor]',
})
export class AceEditorDirective {

  editor;
  _readOnly: boolean;
  _theme;
  _mode;

  oldVal;

  @Output('textChanged') textChanged;
  @Output('editorRef') editorRef;


  static get parameters() {
    return [[ElementRef]];
  }

  @Input('options')
  set options(value) {
    this.editor.setOptions(value || {});
  }

  @Input('readOnly')
  set readOnly(value) {
    this._readOnly = value;
    this.editor.setReadOnly(value);
  }

  @Input('theme')
  set theme(value) {
    this._theme = value;
    this.editor.setTheme(`ace/theme/${value}`);
  }

  @Input('mode')
  set mode(value) {
    this._mode = value;
    this.editor.getSession().setMode(`ace/mode/${value}`);
  }

  @Input('text')
  set text(value) {
    if (value === this.oldVal) {
      return;
    }
    this.editor.setValue(value, -1);
    this.editor.clearSelection();
    this.editor.focus();
  }

  constructor(elementRef: ElementRef) {
    this.textChanged = new EventEmitter();
    this.editorRef = new EventEmitter();

    const el = elementRef.nativeElement;
    el.classList.add('editor');

    this.editor = ace.edit(el);

    setTimeout(() => {
      this.editorRef.next(this.editor);
    });

    this.editor.on('change', () => {
      const newVal = this.editor.getValue();
      if (newVal === this.oldVal) {
        return;
      }
      if (typeof this.oldVal !== 'undefined') {
        this.textChanged.next(newVal);
      }
      this.oldVal = newVal;
    });
  }
}
