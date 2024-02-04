import { Injectable, OnInit } from '@angular/core';
import { Router, Route } from '@angular/router';
import { MenuItem, MenuService, AppConfigService, AuthenticationService } from 'qbm';
import { OverlayRef } from '@angular/cdk/overlay';
import { EuiLoadingService } from '@elemental-ui/core';
import { SystemInfo } from 'imx-api-qbm';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';


@Injectable({ providedIn: 'root' })
export class DataExplorerPlusService {

  public systemInfo: SystemInfo;
  public viewReady: boolean;
  public userUid: string;
  dataSource: string[] = [];
  explores: number = 0;

  constructor(
    public readonly router: Router,
    private readonly busyService: EuiLoadingService,
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService,
    private readonly menuService: MenuService,
  ) {
    this.authentication.onSessionResponse.subscribe({
      next: sessionState => {
        if (sessionState?.IsLoggedOut === false) {
          this.setupMenuAfterAuthentication();
        }
      }
    });
  }

  public onInit(routes: Route[]): void {
    this.addRoutes(routes);
    let overlayRef: OverlayRef;
    setTimeout(() => overlayRef = this.busyService.show(), 0);

    try {
      this.viewReady = true;
    } finally {
      setTimeout(() => this.busyService.hide(overlayRef), 0);
    }
  }

  private addRoutes(routes: Route[]): void {
    const config = this.router.config;
    routes.forEach((route) => {
      config.unshift(route);
    });
    this.router.resetConfig(config);
  }

  calculateKeyCounts(): void {
    if (this.dataSource && this.dataSource.length > 0) {
      this.explores = this.dataSource.reduce((count, item) => {
        count += Object.keys(item).length;
        return count;
      }, 0);
    }
  }



  public async ExplorerList(): Promise<void> {
    const explorers = await this.config.apiClient.processRequest<string[]>(this.GetExplorers());
    console.log(explorers);
    this.dataSource = explorers;
  }


  private GetExplorers(): MethodDescriptor<void> {
    const parameters = [];
    return {
      path: `/portal/dataexplorerplus/configparms`,
      parameters,
      method: 'GET',
      headers: {
        'imx-timezone': TimeZoneInfo.get(),
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json',
    };
  }

  private setupMenuAfterAuthentication(): void {
    this.ExplorerList();
    this.calculateKeyCounts();
    if (1===1) {
      this.menuService.addMenuFactories((preProps: string[], features: string[]) => {

          const menu: MenuItem = {
            id: 'ROOT_DataExplorerPlus',
            title: '#LDS#Data Explorer +',
            sorting: '20',
            items: [
              {
                id: 'DATA-EXPLORER-PLUS_test',
                route: 'data-explorer-plus',
                title: '#LDS#Test menu item',
                sorting: '20-10',
              }
            ],
          };
          return menu;
        }
      );
    }
}
}
