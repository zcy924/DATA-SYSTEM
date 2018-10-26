import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NzFormatEmitEvent,
  NzMessageService,
  NzModalRef,
  NzTreeNode,
} from 'ng-zorro-antd';
import { CompanyManageService } from '../../../../company-manage/company-manage.service';
import { SpaceManageService } from '../../../space-manage.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-role',
  templateUrl: './role-modal.html',
  styles: [``],
})
export class RoleModalComponent implements OnInit {
  roleName = '';
  roleId = '';
  remark = '';

  users = [];
  searchedUsers = [];
  key = '';
  reportList = [];

  nodes:Array<any>;

  @ViewChild('treeCom') treeCom;

  constructor(
    private companyService: CompanyManageService,
    private spaceService: SpaceManageService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
  ) {}

  ngOnInit() {
    if (this.roleId === '') {
      this.getTree();
      // this.openFolder('first', null);
    } else {
      this.initData();
    }
  }

  checkTreeNode(event: NzFormatEmitEvent): void {
    // console.log(event);
    console.log(this.treeCom.getCheckedNodeList());
  }

  // 异步获取报表列表
  // openFolder(name: string, e: NzFormatEmitEvent): void {
  //   let spaceID = localStorage.getItem('spaceID');
  //   let parentID = '';
  //   if (name === 'first') {
  //     parentID = '/'; // 加载根目录
  //   }
  //   if (name === 'expand') {
  //     parentID = e.node.key; // 加载子目录
  //   }
  //   let params = {
  //     curPage: 1,
  //     pageSize: 100,
  //     totalPage: 0,
  //     totalRow: 0,
  //     Report: {
  //       spaceId: spaceID,
  //       parentId: parentID,
  //     },
  //   };
  //   this.spaceService.getReportList(params).subscribe(res => {
  //     let data = res['retList'];
  //     if (name === 'first') {
  //       data.forEach(report => {
  //         this.nodes.push({
  //             title: report.reportName,
  //             key: report.reportId,
  //             expanded: false,
  //             isLeaf: report.type !== '0',
  //           },
  //         );
  //       });
  //       return;
  //     }
  //     if (e.node.getChildren().length === 0 && e.node.isExpanded) {
  //       data.forEach(report => {
  //         e.node.addChildren([
  //           {
  //             title: report.reportName,
  //             key: report.reportId,
  //             expanded: false,
  //             isLeaf: report.type !== '0',
  //           },
  //         ]);
  //       });
  //     }
  //     e.node.addChildren([]);
  //   });
  // }

  // 模糊查询复选框取消勾选
  updateChecked(user) {
    this.users.forEach(res => {
      if (user.userNo === res.userNo) {
        res.checked = false;
      }
    });
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
    this.users.forEach(user => (user.isSpaceAdmin = 'F'));
    this.users = this.users.filter(user => user.checked === true);
    this.reportList = [];
    this.treeCom
      .getCheckedNodeList()
      .forEach(node => this.reportList.push({ reportId: node.key }));
    console.log('reports,' + this.treeCom.getCheckedNodeList());
    let params = {
      SpaceRole: {
        roleName: this.roleName,
        remark: this.remark,
        spaceId: spaceID,
        status: 'T',
        userList: this.users,
        reportList: this.reportList,
      },
    };
    this.spaceService.createRole(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.message.success('添加角色成功！');
        this.modalRef.destroy('ok');
      } else {
        this.message.error('添加角色失败！');
      }
    });
  }

  // 修改更新角色
  editRole() {
    let spaceID = localStorage.getItem('spaceID');
    this.users = this.users.filter(user => user.checked === true);
    this.users.forEach(user => (user.isSpaceAdmin = 'F'));
    this.reportList = [];
    this.treeCom
      .getCheckedNodeList()
      .forEach(node => this.reportList.push({ reportId: node.key }));
    let params = {
      SpaceRole: {
        roleName: this.roleName,
        roleId: this.roleId,
        status: 'T',
        spaceId: spaceID,
        userList: this.users,
        reportList: this.reportList,
      },
    };
    this.spaceService.modRole(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.message.success('修改角色成功！');
        this.modalRef.destroy('ok');
      } else {
        this.message.error('修改角色失败！');
      }
    });
  }

  // 修改用户时，数据回显
  initData() {
    let params1 = {
      SpaceRole: {
        roleId: this.roleId,
      },
    };
    this.spaceService.qryUserListByRole(params1).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.users = res['retList'];
        this.users.forEach(user => (user.checked = true));
      } else {
        this.message.error('查询角色对应的用户列表失败！');
      }
    });

    let spaceID = localStorage.getItem('spaceID');
    let params3 = {
      SpaceRoleReport: {
        spaceId: spaceID,
        roleId: this.roleId,
      },
    };
    this.spaceService.qryReportListByRole(params3).subscribe(
      res => {
        this.reportList = res['retTreeList'];
        this.nodes=[];// 这个不能删，作用域有用
        this.recursiveCheckNode(this.nodes, this.reportList);
        console.log(this.nodes);
      },
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
      },
    );
  }
  recursiveCheckNode(nodes, reports) {
    for(let report of reports){
      let node = {
        title: report.reportName,
        key: report.reportId,
        expanded: true,
        isLeaf: report.type !== '0',
        checked: report.checked === 'T' && report.type !== '0',
        children: []
      };
      nodes.push(node);
      if (!node.isLeaf && report.children) {
        this.recursiveCheckNode(node.children, report.children);
      }
    }
  }

  // 初始化报表树
  getTree() {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      Report: {
        spaceId: spaceID,
      },
    };
    this.spaceService.qryReportTree(params).subscribe(
      res => {
        this.nodes=[];// 这个不能删，作用域有用
        this.recursiveNode(this.nodes, res['retTreeList']);
      },
      err => {
        if (err instanceof HttpResponse) {
          this.message.error(err.body.retMsg);
        }
      },
    );
  }

  recursiveNode(nodes, reports) {
    for(let report of reports){
      let node = {
        title: report.reportName,
        key: report.reportId,
        expanded: true,
        isLeaf: report.type !== '0',
        children:[]
      };
      nodes.push(node);
      if (!node.isLeaf && report.children) {
        this.recursiveNode(node.children, report.children);
      }
    }
  }
}
