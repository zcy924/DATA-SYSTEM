import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-create-space',
  templateUrl: './create-space.html',
  styles: []
})
export class CreateSpaceComponent implements OnInit {
  firstUrl='http://10.2.72.172:8080/DVSP/app/square/';
  typeValue;
  constructor() {}

  ngOnInit() {
  }
}
