import { Component, Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { CsvsyncService } from '../csvsync.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'imx-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  estimatedRemainingTime: string;
  processedRows = 0;
  totalRows: number = 0;
  progress: number = 0;
  numberOfErrors: number;


  private estimatedRemainingTimeSubscription: Subscription;
  private processedRowsSubscription: Subscription;
  private totalRowsSubscription: Subscription;
  private progressSubscription: Subscription;
  private numberOfErrorsSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public csvsyncService: CsvsyncService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {console.log('Received data in the dialog component:', this.data);
  }



  dialogClose(): void {

    if (this.data.processing) {
      this.data.cancelAction = true;
      this.data.cancelCheck = true;
    } else {
      this.data.cancelCheck = false;
    }
  
    this.data.importError = false;
    this.data.importErrorMsg = '';
    this.data.hardError = '';
  
    this.dialogRef.close(true);

    this.estimatedRemainingTimeSubscription.unsubscribe();
    this.processedRowsSubscription.unsubscribe();
    this.totalRowsSubscription.unsubscribe();
    this.progressSubscription.unsubscribe();
    this.numberOfErrorsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // Subscribe to estimatedRemainingTime$ and processedRows$
    this.estimatedRemainingTimeSubscription = this.csvsyncService.estimatedRemainingTime$.subscribe((value) => {
      this.estimatedRemainingTime = value;
    });

    this.processedRowsSubscription = this.csvsyncService.processedRows$.subscribe((value) => {
      this.processedRows = value;
    });

    this.totalRowsSubscription = this.csvsyncService.totalRows$.subscribe((value) => {
      this.totalRows = value;
    });

    this.progressSubscription = this.csvsyncService.progress$.subscribe((value) => {
      this.progress = value;
    });

    this.numberOfErrorsSubscription = this.csvsyncService.numberOfErrors$.subscribe((value) => {
      this.numberOfErrors = value;
    });

  }

}
