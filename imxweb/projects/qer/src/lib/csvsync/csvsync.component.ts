import { Component, OnInit } from '@angular/core';
import { QerService } from '../qer.service';

@Component({
  selector: 'imx-csvsync',
  templateUrl: './csvsync.component.html',
  styleUrls: ['./csvsync.component.scss']
})
export class CsvsyncComponent implements OnInit {
  csvData: any[] = [];
  headers: string[] = [];
  tables: string[] = [];
  selectedTable: string = '';
  columnMapping: { [key: string]: string } = {};
  mockColumns: string[] = [];

  constructor(private importDataService: QerService) {}

  ngOnInit() {
    this.tables = this.importDataService.getTables();
    this.mockColumns = this.importDataService.getMockColumns();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result as string;
        const lines = data.split('\n');
        this.headers = lines[0].split(',');
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',');
          if (row.length > 1) {
            this.csvData.push(row);
          }
        }
      };
      reader.readAsText(file);
    }
  }

  isMappingComplete() {
    for (let header of this.headers) {
      if (!this.columnMapping[header]) {
        return false;
      }
    }
    return true;
  }

  importToDatabase() {
    // Implement your logic to import the modified data to MS SQL database.
    // You can call your API to send the data and map the headers with the database columns.
    console.log('Selected Table:', this.selectedTable);
    console.log('Data:', this.csvData);
    console.log('Column Mapping:', this.columnMapping);
  }
}
