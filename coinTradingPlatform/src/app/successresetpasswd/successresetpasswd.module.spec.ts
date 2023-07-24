import { SuccessresetpasswdModule } from './successresetpasswd.module';

describe('SuccessresetpasswdModule', () => {
  let successresetpasswdModule: SuccessresetpasswdModule;

  beforeEach(() => {
    successresetpasswdModule = new SuccessresetpasswdModule();
  });

  it('should create an instance', () => {
    expect(successresetpasswdModule).toBeTruthy();
  });
});
