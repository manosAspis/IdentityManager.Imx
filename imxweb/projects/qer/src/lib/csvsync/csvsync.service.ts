import { Injectable } from '@angular/core';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

export interface PreActionElement{
  message: string;
  permission: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CsvsyncService {

  constructor(public dialog: MatDialog) { }
  

  public startValidateMethod(endpoint: string, startobject: any): MethodDescriptor<PreActionElement> {
    return {
      path: `/portal/bulkactions/${endpoint}/startvalidate`,
      parameters: [
        {
          name: 'startobject',
          value: startobject,
          in: 'body'
        },
      ],
      method: 'POST',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json'
    };
  }
  
  public startImportMethod(endpoint: string, startobject: any): MethodDescriptor<PreActionElement> {
    return {
      path: `/portal/bulkactions/${endpoint}/startimport`,
      parameters: [
        {
          name: 'startobject',
          value: startobject,
          in: 'body'
        },
      ],
      method: 'POST',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json'
    };
  }
  
  public endImportMethod(endpoint: string, startobject: any): MethodDescriptor<PreActionElement> {
    return {
      path: `/portal/bulkactions/${endpoint}/endimport`,
      parameters: [
        {
          name: 'startobject',
          value: startobject,
          in: 'body'
        },
      ],
      method: 'POST',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json'
    };
  }

}
