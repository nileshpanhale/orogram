import { SellcryptoAdminModule } from './sell-crypto-admin.module';

describe('SellcryptoAdminModule', () => {
  let sellcryptoAdminModule: SellcryptoAdminModule;

  beforeEach(() => {
    sellcryptoAdminModule = new SellcryptoAdminModule();
  });

  it('should create an instance', () => {
    expect(sellcryptoAdminModule).toBeTruthy();
  });
});
