import { Component, OnInit, ViewChild } from '@angular/core';
import { SpaceManageService } from '../../../space-manage.service';
import { NzFormatEmitEvent, NzMessageService, NzModalRef, NzTreeNode } from 'ng-zorro-antd';

@Component({
  selector: 'edit-add-user',
  templateUrl: './edit-user-modal.html',
})

export class EditUserModalComponent implements OnInit {

  adminChecked;
  user;
  reportList = [];
  roles=[];

  constructor(
    private spaceService: SpaceManageService,
    private message: NzMessageService,
    private modalRef: NzModalRef) {
  }

  @ViewChild('treeCom') treeCom;
  nodes = [];

  checkTreeNode(event: NzFormatEmitEvent): void {
    console.log(event);
    console.log(this.treeCom.getCheckedNodeList());
  }

  ngOnInit() {
    this.initRoleList();
    this.initReportTree();
  }

  updateChecked(checked) {
    checked = !checked;
  }


  // 修改用户
  editUser() {
    let spaceID = localStorage.getItem('spaceID');
    this.roles = this.roles.filter(role=>role.checked);
    this.reportList = [];
    this.treeCom.getCheckedNodeList().forEach(node => this.reportList.push({ reportId: node.key }));
    let params = {
      SpaceUser: {
        spaceId: spaceID,
        userId: this.user.userId,
        status: 'T',
        roleList: this.roles,
        reportList: this.reportList,
        isSpaceAdmin:(this.adminChecked===true)?'T':'F'
      },
    };
    this.spaceService.modUser(params).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.message.success('修改用户成功！');
        this.modalRef.destroy('ok');
      } else {
        this.message.error('修改用户失败！');
      }
    });
  }

  // 回显用户自定义报表树
  initReportTree(){
    let spaceID = localStorage.getItem('spaceID');
    let params3 = {
      SpaceUserReport: {
        spaceId: spaceID,
        userId: this.user.userId,
      },
    };
    this.spaceService.qryReportListByUser(params3).subscribe(res => {
      if (res['retCode'] === '00000') {
        this.reportList = res['retTreeList'];
        this.recursiveCheckNode(this.nodes, this.reportList);
      } else {
        this.message.error('查询用户对应的报表树失败！');
      }
    });
  }
  recursiveCheckNode(nodes, reports) {
    reports.forEach(report => {
      let node = new NzTreeNode({
        title: report.reportName,
        key: report.reportId,
        expanded: true,
        isLeaf: report.type !== '0',
        checked: (report.checked === 'T') && (report.type !== '0'),
      });
      nodes.push(node);
      if (!node.isLeaf && report.children) {
        this.recursiveCheckNode(node.children, report.children);
      }
    });
  }

  // 回显用户的角色列表
  initRoleList(){
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
      this.roles.forEach(role=>{
        role.checked = false;
        this.user.roleList.forEach(i=>{
          if(role.roleId===i.roleId){
            role.checked = true;
          }
        });
      });
    });
  }
}
