import { Component, OnInit, ViewChild } from '@angular/core';
import { SpaceManageService } from '../../../space-manage.service';
import { NzFormatEmitEvent, NzMessageService, NzModalRef, NzTreeNode } from 'ng-zorro-antd';
import { CompanyManageService } from '../../../../company-manage/company-manage.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user-modal.html',
})

export class AddUserModalComponent implements OnInit {

  userName;
  userNo;
  adminChecked = false;
  usersOfSpace = [];
  users = [];
  searchedUsers = [];
  roles = [];
  reportList = [];

  constructor(
    private companyService: CompanyManageService,
    private spaceService: SpaceManageService,
    private message: NzMessageService,
    private modalRef: NzModalRef) {
  }

  @ViewChild('treeCom') treeCom;
  nodes = [];

  checkTreeNode(event: NzFormatEmitEvent): void {
    // console.log(event);
    console.log(this.treeCom.getCheckedNodeList());
  }

  ngOnInit() {
    this.initRoleList();
    this.initReportTree();
  }

  updateChecked(checked) {
    checked = !checked;
  }

  // 添加空间用户
  createUser() {
    let spaceID = localStorage.getItem('spaceID');
    this.roles = this.roles.filter(role => role.checked);
    this.treeCom.getCheckedNodeList().forEach(node => this.reportList.push({ reportId: node.key }));
    this.users = this.users.filter(user => user.checked);
    this.users.forEach(user => user.isSpaceAdmin = (this.adminChecked !== true) ? 'F' : 'T');
    let params = {
      SpaceUser: {
        userList: this.users,
        status: 'T',
        spaceId: spaceID,
        roleList: this.roles,
        reportList: this.reportList,
      },
    };
    this.spaceService.addUser(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.message.success('添加空间用户成功！');
        this.modalRef.destroy('ok');
      } else {
        this.message.error('添加空间用户失败！');
      }
    });
  }

  // 初始化角色列表
  initRoleList() {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      pageSize: 100,
      curPage: 0,
      totalPage: 0,
      totalRow: 0,
      SpaceRole: {
        spaceId: spaceID,
      },
    };
    this.spaceService.getRoleList(params).subscribe(res => {
      this.roles = res['retList'];
      this.roles.forEach(role => {
        role.checked = false;
      });
    });
  }

  // 初始化报表树
  initReportTree() {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      Report: {
        spaceId: spaceID,
      },
    };
    this.spaceService.qryReportTree(params).subscribe(res => {
      this.recursiveNode(this.nodes, res['retTreeList']);
    });
  }

  // 遍历组建树
  recursiveNode(nodes, reports) {
    reports.forEach(report => {
      let node = new NzTreeNode({
        title: report.reportName,
        key: report.reportId,
        expanded: true,
        isLeaf: report.type !== '0',
        checked: report.checked === 'T',
      });
      nodes.push(node);
      if (!node.isLeaf && report.children) {
        this.recursiveNode(node.children, report.children);
      }
    });
  }


  /********************模糊查询用户**********************/

  // 用户复选框勾选
  updateUserChecked(user) {
    this.users.forEach(res => {    // 将取消勾选的用户置为false
      if (user.userNo === res.userNo) {
        res.checked = false;
      }
    });
    this.searchedUsers.forEach(res => {    // 将取消勾选的用户的列表复选框置为false
      if (user.userNo === res.userNo) {
        res.checked = false;
      }
    });
  }

  // 模糊查询复选框勾选
  searchUserChecked(user) {    // 将用户锁定，并加入勾选数组
    user.checked = !user.checked;
    this.users = this.users.filter(res => !(res.userNo === user.userNo));
    this.users.push(user);
  }

  key = '';

  searchUsers() {
    if (this.key === '') {
      this.searchedUsers = [];
      return;
    }
    let params = {
      key: this.key,
      pageSize: '100',
      curPage: '0',
      totalRow: '0',
      totalPage: '0',
    };
    this.companyService.searchFuzzyUsers(params).subscribe(res => {
      this.searchedUsers = [];
      this.searchedUsers = res['retList'];
      this.searchedUsers = this.searchedUsers.filter(user => {
        for(let i of this.usersOfSpace) {    // 去除已存在于空间的用户
          return i.userId !== user.userId;
        }
      });
      this.searchedUsers.forEach(i => {
        i.checked = false;
        this.users.forEach(j => {           // 查询已被勾选的用户，将其锁定
          if (i.userNo === j.userNo && j.checked === true) {
            i.checked = !i.checked;
          }
        });
      });
    });
  }


}
