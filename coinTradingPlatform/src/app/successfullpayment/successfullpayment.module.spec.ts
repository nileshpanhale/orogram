import { SuccessfullpaymentModule } from './successfullpayment.module';

describe('SuccessfullpaymentModule', () => {
  let successfullpaymentModule: SuccessfullpaymentModule;

  beforeEach(() => {
    successfullpaymentModule = new SuccessfullpaymentModule();
  });

  it('should create an instance', () => {
    expect(successfullpaymentModule).toBeTruthy();
  });
});
