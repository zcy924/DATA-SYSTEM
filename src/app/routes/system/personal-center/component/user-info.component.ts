import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../system.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.html',
  styles: [
    `
      .ant-card-head {
        background-color: red;
      }
    `,
  ],
})
export class UserInfoComponent implements OnInit {
  constructor(private service: SystemService) {}

  ngOnInit() {}
  test() {
    this.service.test().subscribe(data => {
      console.log(data);
    });
  }
}
