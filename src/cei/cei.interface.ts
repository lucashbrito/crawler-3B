export interface WalletInterface {
  institution: string;
  account: string;
  stockWallet: StockWalletInterface[];
  nationalTreasuryWallet: {}[];
}

export interface StockWalletInterface {
  company: string;
  stockType: string;
  code: string;
  isin: string;
  price: string;
  quantity: string;
  quotationFactor: string;
  totalValue: string;
}

export interface NationalTreasuryWalletInterface {
  company: string;
  stockType: string;
  code: string;
  isin: string;
  price: string;
  quantity: string;
  quotationFactor: string;
  totalValue: string;
}
