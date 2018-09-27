import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SapaceSquareService } from './space-square.service';

@Component({
  selector: 'app-space-aquare',
  templateUrl: './space-square.html',
  styleUrls: ['./space-square.less'],
  providers: [SapaceSquareService],
})
export class SpaceSquareComponent implements OnInit {
  groups = [1, 2, 3, 4, 5];
  spaceArr = [];

  constructor(private router: Router, private spaceService: SapaceSquareService) {
    // this.service.getSpaces().subscribe(data => {
    //   this.groups = data.data;
    // });
    console.log('-------------------------------------');
    this.getList();
  }

  ngOnInit() {
  }

  openDetail(id) {
    console.log(id);
    this.router.navigate(['app/square/' + id]);
  }

  getList() {
    this.spaceService.getSpaceList({})
      .subscribe(res => {
        console.log(res);
        this.spaceArr = res['retList']
      }, err => {
        console.log(err);
      });
  }
}

