import { Component, OnInit } from '@angular/core';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService, AuthenticationService } from 'qbm';
import { ContactInterface, parseContactValues } from './contact-parser'


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
  selector: 'ccc-support-page',
  templateUrl: './support-page.component.html',
  styleUrls: ['./support-page.component.scss']
})

export class SupportPageComponent implements OnInit {

  displayedColumns: string[] = ['headCoe', 'contactInfo', 'serviceNow', 'confluence'];
  dataSource = ELEMENT_DATA;
  hyperlinks: ContactInterface[] = [];


  constructor(
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService
  ) {}

  public async ngOnInit(): Promise<void> {

    this.authentication.update();
    this.getCustom();

  }

 public async getCustom(): Promise<PeriodicElement> {
  const data = await this.config.apiClient.processRequest(this.getFeatureConfigDescriptor());
  ELEMENT_DATA = [data];
  this.dataSource = ELEMENT_DATA;
  this.hyperlinks = parseContactValues(data.contactInfo)

  return data;
 }

 isLink(value: string): boolean {
  const linkPattern = /^https:\/\//;
  return linkPattern.test(value);
 }

 private getFeatureConfigDescriptor(): MethodDescriptor<PeriodicElement> {
  const parameters = [];
  return {
    path: `/portal/SupportPageInfo`,
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