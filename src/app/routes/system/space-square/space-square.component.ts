import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-space-aquare',
  templateUrl: './space-square.html',
  styleUrls:['./space-square.less']
})
export class SpaceSquareComponent implements OnInit {

  groups = [];
  constructor() {
    // this.service.getSpaces().subscribe(data => {
    //   this.groups = data.data;
    // });
  }

  ngOnInit() {
  }

  openDetail(item) {
    console.log(item);
    // this.router.navigate(['app/groups/' + item.group_name]);
  }
}
