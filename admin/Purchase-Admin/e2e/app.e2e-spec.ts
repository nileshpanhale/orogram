import { PurchaseAdminPage } from './app.po';

describe('purchase-admin App', () => {
  let page: PurchaseAdminPage;

  beforeEach(() => {
    page = new PurchaseAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
