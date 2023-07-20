import { Injectable } from '@angular/core';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService } from 'qbm';

export interface UsersData {
  firstname: string;
  lastname: string;
  roles: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersRetrieveServiceService {
  constructor(private readonly config: AppConfigService) { }

  public async getUsers(): Promise<UsersData[]> {
    try {
      const data = await this.config.apiClient.processRequest(this.getUsersDescriptor());
      const users = data as UsersData[];
      return users;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  private getUsersDescriptor(): MethodDescriptor<UsersData[]> {
    const parameters = [];
    return {
      path: `/portal/usersretrieve`,
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
