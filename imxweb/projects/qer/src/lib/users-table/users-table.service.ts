import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { EuiLoadingService } from '@elemental-ui/core';
import { CollectionLoadParameters, DisplayColumns, EntitySchema, IClientProperty, ValType, MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { QerApiService } from '../qer-api-client.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { AppConfigService, DataSourceToolbarFilter, DataSourceToolbarSettings } from 'qbm';

export interface UserObject {
  FirstName: string;
  LastName: string;
  Role: string;
  Department: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsersTableService {

  users: UserObject[] = [];
  constructor(private readonly config: AppConfigService){}
 
  public async fetchUsersData(): Promise<UserObject[]> {
    try {
      const response = await this.config.apiClient.processRequest<UserObject[]>(this.getUsersDataDescriptor());
      this.users = response;
      return response;
    } catch (error) {
      console.error('Error fetching users data:', error);
      return [];
    }
  }

  private getUsersDataDescriptor(): MethodDescriptor<UserObject> {
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
