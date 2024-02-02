import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';

import { MenuItem, MenuService } from 'qbm';


@Injectable({ providedIn: 'root' })
export class DataExplorerPlusService {
  constructor(
    private readonly router: Router,
    private readonly menuService: MenuService,
  ) {
    this.setupMenu();
  }

  public onInit(routes: Route[]): void {
    this.addRoutes(routes);
  }

  private addRoutes(routes: Route[]): void {
    const config = this.router.config;
    routes.forEach((route) => {
      config.unshift(route);
    });
    this.router.resetConfig(config);
  }

  private setupMenu(): void {
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
