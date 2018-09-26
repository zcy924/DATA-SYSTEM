import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-space-aquare',
  templateUrl: './space-square.html',
  styleUrls: ['./space-square.less'],
})
export class SpaceSquareComponent implements OnInit {
  groups = [1, 2, 3, 4, 5];
  constructor() {
    // this.service.getSpaces().subscribe(data => {
    //   this.groups = data.data;
    // });
  }

  ngOnInit() {}

  openDetail(item) {
    console.log(item);
    // this.router.navigate(['app/groups/' + item.group_name]);
  }
}
