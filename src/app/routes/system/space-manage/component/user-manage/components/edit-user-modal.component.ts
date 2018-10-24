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
    // console.log(event);
    console.log(this.treeCom.getCheckedNodeList());
  }

  ngOnInit() {
    this.initRoleList();
    this.initReportTree();
  }

  updateChecked(user) {
    this.adminChecked = !this.adminChecked;
    this.user.is_space_admin = this.adminChecked?'T':'F';
  }


  // 修改用户
  editUser() {
    let spaceID = localStorage.getItem('spaceID');
    this.user.roleList = this.user.roleList.filter(role=>role.checked);
    let params = {
      SpaceUser: {
        space_id: spaceID,
        user_id: this.user.user_id,
        status: 'T',
        roleList: this.user.RoleList,
        reportList: this.reportList,
      },
    };
    this.spaceService.editUser(params).subscribe(res => {
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
    let params = {
      Report: {
        spaceId: spaceID,
      },
    };
    this.spaceService.qryReportTree(params).subscribe(res => {
      console.log('遍历完整报表树开始');
      this.recursiveNode(this.nodes, res['retTreeList']);
      console.log(this.nodes);
      console.log('遍历完整报表树结束');
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
        // disabled: true,
      });
      nodes.push(node);
      if (!node.isLeaf && report.children) {
        this.recursiveNode(node.children, report.children);
      }
    });
  }

  // 回显用户的角色
  initRoleList(){
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      pageSize: 100,
      curPage: 0,
      totalPage: 0,
      totalRow: 0,
      SpaceRole: {
        space_id: spaceID,
      },
    };
    this.spaceService.getRoleList(params).subscribe(res => {
      this.roles = res['retList'];
      this.roles.forEach(role=>{
        role.checked = false;
        this.user.roleList.forEach(i=>{
          if(role.role_id===i.role_id){
            role.checked = true;
          }
        });
      });
    });
  }
}
