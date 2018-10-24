import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './screen-detail.html',
  styles: [
    `
    .title-tab {
      height: 32px;
      line-height: 32px;
      font-size: x-large;
    }
    .title-tab + div {
      float: right;
    }
    .title-tab + div a {
      height: 32px;
      line-height: 32px;
      font-size: x-large;
      padding-right: 24px;
      color: red;
    }
    `
  ]
})

export class ScreenDetailComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
