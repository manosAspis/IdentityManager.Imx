import { Component, OnInit } from '@angular/core';
import { UsersRetrieveServiceService, UsersData } from '../admin/users-retrieve-service.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { EuiLoadingService } from '@elemental-ui/core';

@Component({
  selector: 'imx-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  public items: UsersData[] = [];
  public columnHeaders: string[] = ['Firstname', 'Lastname', 'Roles', 'Department'];

  constructor(
    private usersRetrieveService: UsersRetrieveServiceService,
    private readonly busyService: EuiLoadingService,
  ) { }

  public async ngOnInit(): Promise<void> {
    let overlayRef: OverlayRef;
    setTimeout(() => (overlayRef = this.busyService.show()));
    try {
      // Fetch data from /portal/usersretrieve API
      this.items = await this.usersRetrieveService.getUsers();
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef));
    }
  }
}
