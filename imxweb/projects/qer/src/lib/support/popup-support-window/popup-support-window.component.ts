import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Inject } from '@angular/core';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService, AuthenticationService } from 'qbm';

export interface PeriodicElement {
  contactInfo: string;
  headCoe: string;
  serviceNow: string;
  confluence: string;
}

let ELEMENT_DATA: PeriodicElement[] = [
  {headCoe: '', contactInfo: '', serviceNow: '', confluence: ''},
  
];


@Component({
  selector: 'ccc-popup-support-window',
  templateUrl: './popup-support-window.component.html',
  styleUrls: ['./popup-support-window.component.scss']
})



export class PopupSupportWindowComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  constructor(
    private dialogRef: MatDialogRef<PopupSupportWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService
  ) { }

  ngOnInit(): void {
    //alert(this.getFeatureConfigDescriptor);
    this.getCustom();
  }
  

  closeWindow() {
    localStorage.setItem('newsLast', this.data.newsDBdate);
    this.dialogRef.close();
  }

  public async getCustom(): Promise<String> {
    const data = await this.config.apiClient.processRequest(this.getFeatureConfigDescriptor());
    //ELEMENT_DATA = [data];
    //this.dataSource = ELEMENT_DATA;
    alert(data);
    return data;
   }

  private getFeatureConfigDescriptor(): MethodDescriptor<String> {
    const parameters = [];
    return {
      path: `/portal/GetNews`,
      parameters,
      method: 'GET',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json',
    };
  }
}