import { Component } from '@angular/core';
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
  selector: 'help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss']
})

export class HelpPageComponent {

  displayedColumns: string[] = ['headCoe', 'contactInfo', 'serviceNow', 'confluence'];
  dataSource = ELEMENT_DATA;
  contactInfo = [];
  longFirstLink:boolean = false;
  longSecondLink:boolean = false;


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

  data.contactInfo.split(", ").forEach(i => {
    i.split(": ").forEach(j => {
      this.contactInfo.push(j)
    })
  })

  if (this.contactInfo[1].length > 30) {
    this.longFirstLink = true;
  }
  if (this.contactInfo[3].length > 30) {
    this.longSecondLink = true;
  }
    
  return data;
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

 /*private do_put(inputParameterName: any): MethodDescriptor<EntityCollectionData> {

    return {

      path: "/ApiServer/ING_ITShopCustomizer/CCC_Test",
      parameters: [
        {
          name: 'inputParameterName',
          value: inputParameterName,
          in: 'body'
        },
      ],

      method: 'POST',
      headers: {
        'imx-timezone': TimeZoneInfo.get()
      },

      credentials: 'include',
      observe: 'response',
      responseType: 'json',
    };

  }*/
}



