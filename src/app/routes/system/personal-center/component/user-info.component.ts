import { Component, OnInit } from '@angular/core';
import { PersonalCenterService } from '../personal-center.service';

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
  constructor(private perService: PersonalCenterService) {}

  ngOnInit() {}
  test() {
    this.perService.getUser().subscribe(data => {
      console.log(data);
    });
  }
}
