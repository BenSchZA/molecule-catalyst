import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsController } from './attachments.controller';

describe('Attachments Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AttachmentsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: AttachmentsController = module.get<AttachmentsController>(AttachmentsController);
    expect(controller).toBeDefined();
  });
});
