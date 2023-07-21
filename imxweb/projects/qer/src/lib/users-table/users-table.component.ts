import { Component, OnInit } from '@angular/core';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService } from 'qbm';
import { TranslateService } from '@ngx-translate/core';

interface UsersTableDataConfig {
  FirstNames: string;
  LastNames: string;
  Roles: string;
  Departments: string;
}

@Component({
  selector: 'imx-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})

export class UsersTableComponent implements OnInit {
  users: UsersTableDataConfig[] = [];

  constructor(private readonly config: AppConfigService, private readonly translate: TranslateService) {}

  ngOnInit(): void {
    this.getUsersTableData();
  }

  public async getUsersTableData(): Promise<void> {
    try {
      const response = await this.config.apiClient.processRequest<UsersTableDataConfig[]>(this.getUsersTableDataDescriptor());
      this.users = response;
    } catch (error) {
      console.error('Error fetching users data:', error);
    }
  }

  private getUsersTableDataDescriptor(): MethodDescriptor<UsersTableDataConfig> {
    const parameters = [];
    return {
      path: `/portal/userstable`,
      parameters,
      method: 'GET',
      headers: {
        'imx-timezone': TimeZoneInfo.get()
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json',
    };
  }
}