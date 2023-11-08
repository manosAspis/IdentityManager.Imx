import { Component, Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';

@Component({
  selector: 'imx-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {console.log('Received data in the dialog component:', this.data);}

  dialogClose(): void {
    // Here, you can handle any necessary logic when the user closes the dialog.
    // For example, you can set properties, call functions, or perform other actions.
  
    if (this.data.processing) {
      // If processing is in progress, handle cancellation or other actions.
      this.data.cancelAction = true;
      this.data.cancelCheck = true;
    } else {
      this.data.cancelCheck = false;
    }
  
    // Reset or update other properties as needed
    this.data.importError = false;
    this.data.importErrorMsg = '';
    this.data.hardError = '';
  
    // Close the dialog with a result (true or false)
    this.data.close(true); // You can pass any value you need here
  }

  ngOnInit(): void {
    console.log("Test", this.data.preActionMsg);
  }

}
