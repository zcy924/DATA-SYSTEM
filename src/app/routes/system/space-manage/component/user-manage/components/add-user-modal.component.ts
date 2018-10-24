import { Component, OnInit, ViewChild } from '@angular/core';
import { SpaceManageService } from '../../../space-manage.service';
import { NzFormatEmitEvent, NzMessageService, NzModalRef, NzTreeNode } from 'ng-zorro-antd';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user-modal.html'
})

export class AddUserModalComponent implements OnInit {

  userName;
  userNo;
  adminChecked;

  roles = [];
  reportList = [];

  constructor(
    private spaceService: SpaceManageService,
    private message: NzMessageService,
    private modalRef: NzModalRef,) { }

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
  }

  // 添加空间用户
  createUser() {
    let spaceID = localStorage.getItem('spaceID');
    let params = {
      SpaceRole: {
        user_name: this.userName,
        status: 'T',
        space_id: spaceID,
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
      });
    });
  }

  // 初始化报表树
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
        // disabled: report.checked === 'T',
      });
      nodes.push(node);
      if (!node.isLeaf && report.children) {
        this.recursiveNode(node.children, report.children);
      }
    });
  }

}
