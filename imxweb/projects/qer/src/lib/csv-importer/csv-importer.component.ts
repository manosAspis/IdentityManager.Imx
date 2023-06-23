import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'imx-csv-importer',
  templateUrl: './csv-importer.component.html',
  styleUrls: ['./csv-importer.component.scss']
})
export class CsvImporterComponent implements OnInit {
  csvData: any[] = []; // To store the parsed CSV data
  headers: string[] = []; // To store the column headers

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.readCSV(file);
    }
  }

  readCSV(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result as string;
      const rows = csvData.trim().split('\n');
      this.headers = rows[0].split(',').map(header => header.trim());
      this.csvData = rows.slice(1).map(row => {
        const data = row.split(',').map(value => value.trim());
        const rowData: any = {};
        for (let i = 0; i < this.headers.length; i++) {
          rowData[this.headers[i]] = data[i];
        }
        return rowData;
      });
    };
    reader.readAsText(file);
  }  
}
