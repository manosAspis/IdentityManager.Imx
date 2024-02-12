import { Component, Inject, OnInit } from '@angular/core';
import { EUI_SIDESHEET_DATA } from '@elemental-ui/core';

@Component({
  selector: 'imx-data-explorer-plus-details',
  templateUrl: './data-explorer-plus-details.component.html',
  styleUrls: ['./data-explorer-plus-details.component.scss']
})
export class DataExplorerPlusDetailsComponent implements OnInit {

  constructor(@Inject(EUI_SIDESHEET_DATA) public data: any) {
    console.log("Received in side sheet:", data.xKey, data.xSubKey);

  }

  ngOnInit(): void {
  }

}
