import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRetrieveServiceService } from './users-retrieve-service.service';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({

  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    UsersRetrieveServiceService
  ]
})
export class UsersRetrieveModule { }
