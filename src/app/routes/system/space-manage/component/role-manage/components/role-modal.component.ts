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
  roleId = '';
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
    this.getTree();
    // this.openFolder('first', null);
    // this.initData();
  }

  checkTreeNode(event: NzFormatEmitEvent): void {
    // console.log(event);
    console.log(this.treeCom.getCheckedNodeList());
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

  // 创建角色，查询勾选用户，展示树
  createRole() {
    let spaceID = localStorage.getItem('spaceID');
    this.users.forEach(user => {
      user.isSpaceAdmin = 'F';
    });
    this.reportList = [];
    this.treeCom.getCheckedNodeList().forEach(node => {
      this.reportList.push({ reportId: node.key });
    });
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

  initData() {
    if (this.roleId === '') {
      return;
    }
    // 查询角色对应的用户列表
    let params1 = {
      SpaceRole: {
        roleId: this.roleId,
      },
    };
    this.spaceService.qryUserListByRole(params1).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.users = res['retList'];
        this.users.forEach(user => user.checked = true);
      } else {
        this.message.error('查询角色对应的用户列表失败！');
      }
    });
    // 查询角色对应的报表列表
    let spaceID = localStorage.getItem('spaceID');
    let params3 = {
      SpaceRoleReport: {
        spaceId: spaceID,
        roleId: this.roleId,
      },
    };
    this.spaceService.qryReportListByRole(params3).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.reportList = res['roleReportList'];
        this.reportList.forEach(report=>{
          if(report.type==='1'){
            this.recursiveCheckNode(this.nodes,report);
          }
        });
      } else {
        this.message.error('查询角色对应的报表列表失败！');
      }
    });
  }

  getTree() {
    // 查询完整报表树
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      Report: {
        spaceId: spaceID,
      },
    };
    this.spaceService.qryAllReportList(params).subscribe(res => {
      this.recursiveNode(this.nodes,res['retTreeList']);
      // const a = res['retTreeList'];
      // this.tree(a);
      // this.nodes = a;
      // console.log(this.nodes);
    });
  }

  recursiveNode(nodes,reports) {
    reports.forEach(report => {
      let node = new NzTreeNode({
        title: report.reportName,
        key: report.reportId,
        expanded: true,
        isLeaf: report.type !== '0',
      });
      nodes.push(node);
      if(!node.isLeaf && report.children){
        this.recursiveNode(node.children,report.children);
      }
    });
  }
  // tree(data: Array<any>){
  //   data.map(value => {
  //     value.title= value.reportName;
  //       value.key= value.reportId;
  //       value.expanded= true;
  //       value.isLeaf= value.type!=='0';
  //       if(value['children']){
  //         this.tree(value['children']);
  //       }
  //   })
  // }

  recursiveCheckNode(nodes,report) {
    nodes.forEach(node => {
      if(node.key === report.reportId){
        node.isChecked = true;
        console.log('checked '+ node.title)
        // node.setChecked(true);
      }
      if(!node.isLeaf && report.children){
        this.recursiveCheckNode(node.children,report);
      }
    });
  }
}
