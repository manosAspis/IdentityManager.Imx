import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvDataService {
  public csvData: any[] = [];

  public setCsvData(data: any[]) {
    this.csvData = data;
  }
}
