import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-space-aquare',
  templateUrl: './space-square.html',
  styleUrls: ['./space-square.less'],
})
export class SpaceSquareComponent implements OnInit {
  groups = [1, 2, 3, 4, 5];
  constructor(private router: Router) {
    // this.service.getSpaces().subscribe(data => {
    //   this.groups = data.data;
    // });
  }

  ngOnInit() {}

  openDetail(item) {
    console.log(item);
    this.router.navigate(['app/square/' +'123']);
  }
}
