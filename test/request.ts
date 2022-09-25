import { INestApplication } from '@nestjs/common';
import * as superTestRequest from 'supertest';
export class TestRequst {
  private request: superTestRequest.SuperTest<superTestRequest.Test>;

  constructor(app: INestApplication) {
    this.request = superTestRequest(app.getHttpServer());
  }

  async get(url: string): Promise<superTestRequest.Test> {
    return this.request.get(url);
  }

  async post(url: string, data: any): Promise<superTestRequest.Test> {
    return this.request.post(url).send(data);
  }

  async patch(url: string, data: any): Promise<superTestRequest.Test> {
    return this.request.patch(url).send(data);
  }

  async delete(url: string): Promise<superTestRequest.Test> {
    return this.request.delete(url);
  }
}
