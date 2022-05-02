/*
 * ONE IDENTITY LLC. PROPRIETARY INFORMATION
 *
 * This software is confidential.  One Identity, LLC. or one of its affiliates or
 * subsidiaries, has supplied this software to you under terms of a
 * license agreement, nondisclosure agreement or both.
 *
 * You may not copy, disclose, or use this software except in accordance with
 * those terms.
 *
 *
 * Copyright 2021 One Identity LLC.
 * ALL RIGHTS RESERVED.
 *
 * ONE IDENTITY LLC. MAKES NO REPRESENTATIONS OR
 * WARRANTIES ABOUT THE SUITABILITY OF THE SOFTWARE,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, OR
 * NON-INFRINGEMENT.  ONE IDENTITY LLC. SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE
 * AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 *
 */

import { EntityData } from 'imx-qbm-dbts';
import { DataSourceToolbarSettings, IExtension } from 'qbm';
import { Subject } from 'rxjs/internal/Subject';

export class RequestRuleViolation implements IExtension {
  public static readonly id = 'cpl.UID_ComplianceRule';
  public subject: Subject<DataSourceToolbarSettings> = new Subject();

  public get inputData() {
    return this.dstSettings;
  }

  public set inputData(dstSettings: DataSourceToolbarSettings) {
    this.dstSettings = dstSettings;

    if (this.dstSettings.extendedData) {
      for (let i = 0; i < this.dstSettings.dataSource.Data.length; i++) {
        const item = this.dstSettings.dataSource.Data[i] as any;
        const element = this.dstSettings.extendedData[i];

        element.WorkflowHistory.Entities.forEach((wh: EntityData) => {
          if (wh.Columns['UID_ComplianceRule'].Value) {
            item.complianceRuleViolation = true;
          }
        });
      }
    }

    this.subject.next(this.dstSettings);
  }

  private dstSettings: DataSourceToolbarSettings;
}
