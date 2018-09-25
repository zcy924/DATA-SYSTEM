import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.html',
  styles: [
    `.ant-card-head {
      background-color: red
    }`
  ]
})

export class UserInfoComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
