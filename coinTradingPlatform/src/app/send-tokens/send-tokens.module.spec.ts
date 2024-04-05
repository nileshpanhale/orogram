import { SendTokensModule } from './send-tokens.module';

describe('SendTokensModule', () => {
  let sendTokensModule: SendTokensModule;

  beforeEach(() => {
    sendTokensModule = new SendTokensModule();
  });

  it('should create an instance', () => {
    expect(sendTokensModule).toBeTruthy();
  });
});
