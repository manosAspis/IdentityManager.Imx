import { Injectable } from '@angular/core';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService } from 'qbm';

export interface HelloWorldConfig {
  Message: string;
}

@Injectable({
  providedIn: 'root'
})

export class ProjectHelloWorldService {

  constructor(private readonly config: AppConfigService) { }

  public async getHelloWorld(): Promise<HelloWorldConfig> {
    try {
      const data = await this.config.apiClient.processRequest(this.getHelloWorldDescriptor());
      const helloWorld = data as HelloWorldConfig;
      return helloWorld;
    } catch (error) {
      console.error('Failed to fetch "Hello World" string:', error);
      throw error;
    }
  }
  
  
  private getHelloWorldDescriptor(): MethodDescriptor<HelloWorldConfig> {
    const parameters = [];
    return {
      path: `/portal/helloworld`,
      parameters,
      method: 'GET',
      headers: {
        'imx-timezone': TimeZoneInfo.get()
      },
      credentials: 'include',
      observe: 'response',
      responseType: 'json',
    };
  }
}

