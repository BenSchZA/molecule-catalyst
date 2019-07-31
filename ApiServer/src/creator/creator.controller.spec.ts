import { Test, TestingModule } from '@nestjs/testing';
import { CreatorController } from './creator.controller';

describe('Creator Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CreatorController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: CreatorController = module.get<CreatorController>(CreatorController);
    expect(controller).toBeDefined();
  });
});
