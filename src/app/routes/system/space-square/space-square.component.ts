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
  title = 'it is title';
  description = ' this is a long long long long description';

  constructor(private router: Router, private spaceService: SapaceSquareService) {
    // this.service.getSpaces().subscribe(data => {
    //   this.groups = data.data;
    // });
    console.log('-------------------------------------');
    this.getList();
  }

  ngOnInit() {
  }

  openDetail(item) {
    console.log(item);
    this.router.navigate(['app/square/' + '123']);
  }

  getList() {
    this.spaceService.getSpaceList({})
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
  }
}

