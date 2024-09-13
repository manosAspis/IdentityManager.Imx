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
 * Copyright 2023 One Identity LLC.
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AttestationCasesService } from '../decision/attestation-cases.service'
import { AttestationDecisionLoadParameters } from '../decision/attestation-decision-load-parameters';
import { DashboardService, PendingItemsType, UserModelService } from 'qer';
import { AttestationFeatureGuardService } from '../attestation-feature-guard.service';
import { AppConfigService } from 'qbm';

@Component({
  templateUrl: './dashboard-plugin.component.html'
})
export class DashboardPluginComponent implements OnInit {

  public pendingItems: PendingItemsType;
  public attEnabled: boolean;
  public pendingOtherCases: any;
  public pendingExplorerCases: any;
  allCases: number;
  DataExplorerPlusAttestations: any[];

  constructor(
    private readonly config: AppConfigService,
    public readonly router: Router,
    private readonly dashboardSvc: DashboardService,
    private readonly userModelSvc: UserModelService,
    private readonly attFeatureGuard: AttestationFeatureGuardService
  ) { }

  public async ngOnInit(): Promise<void> {

    const busy = this.dashboardSvc.beginBusy();

    try {
      this.pendingExplorerCases = await this.config.apiClient.processRequest<any>(this.GetDataExplorerPlusCountAttestations());
      this.pendingItems = await this.userModelSvc.getPendingItems();
      this.pendingOtherCases = this.pendingItems?.OpenAttestation - this.pendingExplorerCases;
      this.attEnabled = (await this.attFeatureGuard.getAttestationConfig()).IsAttestationEnabled;
    } finally {
      busy.endBusy();
    }
  }

  public goToAttestationInquiries(): void {
    this.router.navigate(['attestation', 'decision'], {queryParams: {inquiries:true}});
  }

  private GetDataExplorerPlusCountAttestations(): MethodDescriptor<void> {
    return {
      path: `/portal/dataexplorerplus/countattestations`,
      parameters: [],
      method: 'GET',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json',
    };
  }
}
