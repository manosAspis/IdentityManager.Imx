import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoeContactComponent } from './coe-contact/coe-contact.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { PopupSupportWindowComponent } from './popup-support-window/popup-support-window.component';


@NgModule({
  declarations: [
    CoeContactComponent,
    InstructionsComponent,
    ChangelogComponent,
    PopupSupportWindowComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CoeContactComponent,
    InstructionsComponent,
    ChangelogComponent,
    PopupSupportWindowComponent
  ]
})
export class SupportModule { }
