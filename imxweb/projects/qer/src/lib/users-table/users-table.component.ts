import { Component, OnInit } from '@angular/core';
import { EuiLoadingService } from '@elemental-ui/core';
import { TranslateService } from '@ngx-translate/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { UsersTableService } from './users-table.service';
import { UserObject } from './users-table.service';
@Component({
  selector: 'ccc-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent {

  public users: UserObject[] = [];
  constructor(
    public readonly translate: TranslateService,
    private usersTableService: UsersTableService,
    private readonly busyService: EuiLoadingService){}

  public async ngOnInit(): Promise<void>{
    let OverlayRef: OverlayRef;
    setTimeout(() => (OverlayRef = this.busyService.show()));
    try{
      this.users = await this.usersTableService.fetchUsersData();
    }finally{
      setTimeout(() => this.busyService.hide(OverlayRef));
    }
  }
}