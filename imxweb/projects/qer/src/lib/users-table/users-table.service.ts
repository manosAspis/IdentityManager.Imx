import { Injectable } from '@angular/core';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService } from 'qbm';

export interface UsersTableDataConfig {
  FirstNames: string;
  LastNames: string;
  Roles: string;
  Departments: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersTableService {
  users: UsersTableDataConfig[] = [];

  constructor(private readonly config: AppConfigService) { }

  public async getUsersTableData(): Promise<UsersTableDataConfig[]> {
    try {
      const response = await this.config.apiClient.processRequest<UsersTableDataConfig[]>(this.getUsersTableDataDescriptor());
      this.users = response;
      return response;
    } catch (error) {
      console.error('Error fetching users data:', error);
      return [];
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
