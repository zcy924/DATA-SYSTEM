import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-control-divider',
  templateUrl: './control.divider.component.html',
  styleUrls: ['./control.divider.component.less']
})
export class ControlDividerComponent implements AfterViewInit {

  @Input() title: string;
  @Input() state: boolean;

  @Output() stateChange = new EventEmitter();

  changeState() {
    this.state = !this.state;
    this.stateChange.emit(this.state);
  }

  ngAfterViewInit() {

  }
}
