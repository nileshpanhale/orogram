import { TransactionRoutingModule } from './transaction-routing.module';

describe('TransactionRoutingModule', () => {
  let transactionRoutingModule: TransactionRoutingModule;

  beforeEach(() => {
    transactionRoutingModule = new TransactionRoutingModule();
  });

  it('should create an instance', () => {
    expect(transactionRoutingModule).toBeTruthy();
  });
});
