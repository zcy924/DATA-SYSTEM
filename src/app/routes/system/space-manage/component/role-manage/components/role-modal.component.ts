import { Component, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent, NzMessageService, NzModalRef, NzTreeNode } from 'ng-zorro-antd';
import { CompanyManageService } from '../../../../company-manage/company-manage.service';
import { SpaceManageService } from '../../../space-manage.service';


@Component({
  selector: 'app-add-role',
  templateUrl: './role-modal.html',
  styles: [``],
})

export class RoleModalComponent implements OnInit {

  roleName = '';
  remark = '';

  users = [];
  searchedUsers = [];
  key = '';
  reportList = [];

  @ViewChild('treeCom') treeCom;
  nodes = [];

  constructor(
    private companyService: CompanyManageService,
    private spaceService: SpaceManageService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
  ) {
  }

  ngOnInit() {
    this.openFolder('first', null);
  }

  checkTreeNode(event: NzFormatEmitEvent): void {
    console.log(event);
    console.log("_______________________");
    console.log(  this.treeCom.getCheckedNodeList());

  }

  // 打开树节点，异步获取报表列表
  openFolder(name: string, e: NzFormatEmitEvent): void {
    let spaceID = localStorage.getItem('spaceID');
    let parentID = '';
    if (name === 'first') {
      parentID = '/';         // 加载根目录
    }
    if (name === 'expand') {
      parentID = e.node.key;  // 加载子目录
    }
    let params = {
      curPage: 1,
      pageSize: 100,
      totalPage: 0,
      totalRow: 0,
      Report: {
        space_id: spaceID,
        parentid: parentID,
      },
    };

    this.spaceService.getReportList(params).subscribe(res => {
      let data = res['retList'];
      if (name === 'first') {
        data.forEach(report => {
          this.nodes.push(new NzTreeNode({
            title: report.report_name,
            key: report.report_id,
            expanded: false,
            isLeaf: report.type !== '0',
            icon: 'anticon anticon-smile-o',
          }));
        });
        return;
      }
      if (e.node.getChildren().length === 0 && e.node.isExpanded) {
        data.forEach(report => {
          e.node.addChildren([{
              title: report.report_name,
              key: report.report_id,
              expanded: false,
              isLeaf: report.type !== '0',
            }],
          );
        });
      }
      e.node.addChildren([]);
    });

  }

  // 空间管理员复选框勾选
  updateChecked(user) {
    // 将取消勾选的用户置为false
    this.users.forEach(res => {
      if (user.userNo === res.userNo) {
        res.checked = false;
      }
    });
    // 将取消勾选的用户的列表复选框置为false
    this.searchedUsers.forEach(res => {
      if (user.userNo === res.userNo) {
        res.checked = false;
      }
    });
  }

  // 模糊查询复选框勾选
  searchChecked(user) {
    // 将用户锁定，并加入勾选数组
    user.checked = !user.checked;
    this.users = this.users.filter(res => !(res.userNo === user.userNo));
    this.users.push(user);
  }

  // 模糊查询用户
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
      console.log(res);
      this.searchedUsers = [];
      this.searchedUsers = res['retList'];
      this.searchedUsers.forEach(i => {
        i.checked = false;
        // 查询已被勾选的用户，将其锁定
        this.users.forEach(j => {
          if (i.userNo === j.userNo && j.checked === true) {
            i.checked = !i.checked;
          }
        });
      });
    });
  }

  // 创建角色
  createRole() {
    let spaceID = localStorage.getItem('spaceID');
    this.users.forEach(user => {
      user.user_id = user.userId;
      user.is_space_admin = 'F';
    });
    let params = {
      SpaceRole: {
        role_name: this.roleName,
        status: 'T',
        space_id: spaceID,
        userList: this.users,
        reportList: this.reportList,
      },
    };
    this.spaceService.createRole(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.message.success('添加空间成功！');
        this.modalRef.destroy('ok');
      } else {
        this.message.error('添加空间失败！');
      }
    });
  }

  // 修改更新角色
  editRole() {
    // TODO 获取选择的报表

    let spaceID = localStorage.getItem('spaceID');
    this.users.forEach(user => {
      user.user_id = user.userId;
    });
    let params = {
      SpaceRole: {
        role_name: this.roleName,
        status: 'T',
        space_id: spaceID,
        userList: this.users,
        reportList: this.reportList,
      },
    };
    this.spaceService.createRole(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.message.success('修改角色成功！');
        this.modalRef.destroy('ok');
      } else {
        this.message.error('修改角色失败！');
      }
    });
  }
}
