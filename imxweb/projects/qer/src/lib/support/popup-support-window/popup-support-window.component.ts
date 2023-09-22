import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Inject } from '@angular/core';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService, AuthenticationService } from 'qbm';

@Component({
  selector: 'ccc-popup-support-window',
  templateUrl: './popup-support-window.component.html',
  styleUrls: ['./popup-support-window.component.scss']
})


export class PopupSupportWindowComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<PopupSupportWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getCustom();
  }
  

  closeWindow() {
    localStorage.setItem('newsLast', this.data.newsDBdate);
    this.dialogRef.close();
  }

  public async getCustom(): Promise<String> {
    const data = await this.config.apiClient.processRequest(this.getFeatureConfigDescriptor());
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