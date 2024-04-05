import { PurchasecryptoModule } from './purchasecrypto.module';

describe('PurchasecryptoModule', () => {
  let purchasecryptoModule: PurchasecryptoModule;

  beforeEach(() => {
    purchasecryptoModule = new PurchasecryptoModule();
  });

  it('should create an instance', () => {
    expect(purchasecryptoModule).toBeTruthy();
  });
});
