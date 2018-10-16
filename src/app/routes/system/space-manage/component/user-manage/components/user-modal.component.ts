import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-user',
  templateUrl: './user-modal.html'
})

export class UserModalComponent implements OnInit {

  userName;
  userNo;
  admin={};
  constructor() { }

  ngOnInit() { }

  updateChecked(user) {
    user.checked = !user.checked;
  }
}
