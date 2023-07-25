import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UsersTableService } from './users-table.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { UsersTableDataConfig } from './users-table.service';
import { EuiLoadingService } from '@elemental-ui/core';

@Component({
  selector: 'imx-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})

export class UsersTableComponent implements OnInit {
  
  public users: UsersTableDataConfig[] = [];

  constructor(
    private readonly translate: TranslateService, 
    private UsersTableService: UsersTableService,
    private readonly busyService: EuiLoadingService,
  ) {}

  public async ngOnInit(): Promise<void> {
    let OverlayRef: OverlayRef;
    setTimeout(() => (OverlayRef = this.busyService.show()));
    try {
      this.users = await this.UsersTableService.getUsersTableData();
    } finally {
      setTimeout(() => this.busyService.hide(OverlayRef));
    }
    
  }
}