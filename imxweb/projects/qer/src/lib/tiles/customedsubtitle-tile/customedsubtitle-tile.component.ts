import { Component, OnInit } from '@angular/core';
import { ProjectConfig, QerProjectConfig } from 'imx-api-qer';
import { SnackBarService } from 'qbm';
import { ProjectConfigurationService } from '../../project-configuration/project-configuration.service';

@Component({
  selector: 'imx-customedsubtitle-tile',
  templateUrl: './customedsubtitle-tile.component.html',
  styleUrls: ['./customedsubtitle-tile.component.scss']
})
export class CustomedsubtitleTileComponent implements OnInit {
  public projectConfig: ProjectConfig;
  public showAskForNotifications: boolean;

  selectedColor: string;


  constructor(
    private readonly projectConfigurationService: ProjectConfigurationService,
    private readonly snackbar: SnackBarService,
  ) { }

  public async ngOnInit(): Promise<void> {
    this.projectConfig = await this.projectConfigurationService.getConfig();
    this.showAskForNotifications = this.doAskForNotifications();

  }

  public async requestNotificationPermission(): Promise<void> {
    const permission = await Notification.requestPermission();

    const snackbarMessage = permission === 'granted'
      ? '#LDS#You will receive notifications from this website.'
      : '#LDS#You will not receive any notifications from this website.';
    this.snackbar.open({ key: snackbarMessage }, '#LDS#Close');

    this.showAskForNotifications = this.doAskForNotifications();
  }

  private doAskForNotifications(): boolean {
    return this.projectConfig?.VI_Common_EnableNotifications
      && typeof (Notification) !== 'undefined'
      && Notification.permission !== 'granted'
      && Notification.permission !== 'denied';
  }

}


