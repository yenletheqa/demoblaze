export type ProductData = {
  productName: string;
  uiCategory?: 'Phones' | 'Laptops' | 'Monitors';
  apiCategory?: 'phone' | 'notebook' | 'monitor';
  shouldExist: boolean;
  productPrice?: string;
};
