import { test, expect } from '@fixtures/pages.fixture';
import searchData from '@data/product.data.json';
import type { ProductData } from '@types';

test.describe('@product UI: Product Discovery via Category Navigation', () => {

  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  for (const data of (searchData as ProductData[]).filter((d) => d.shouldExist)) {
    test(`Product is discoverable: ${data.productName} in ${data.uiCategory}`, async ({ homePage }) => {
      await homePage.selectCategory(data.uiCategory!);
      const isFound = await homePage.findProduct(data.productName);
      expect(isFound, `Product '${data.productName}' should be found`).toBeTruthy();
      expect(homePage.productPrice(data.productPrice!), 'Product price should be displayed').toBeVisible();
      expect(homePage.productDescription(data.productName), 'Product description should be displayed').toBeVisible();
    });
  }

  for (const data of (searchData as ProductData[]).filter((d) => !d.shouldExist)) {
    test(`Negative: ${data.productName} is not listed under ${data.uiCategory}`, async ({ homePage }) => {
      await homePage.selectCategory(data.uiCategory!);
      const isFound = await homePage.findProduct(data.productName);
      expect(isFound, `Product '${data.productName}' should NOT be found`).toBeFalsy();
    });
  }
});
