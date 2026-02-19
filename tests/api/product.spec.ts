import { test, expect } from '@fixtures/apis.fixture';
import productData from '@data/product.data.json';
import type { ProductData } from '@types';

test.describe('@product API: Product Discovery by Category', () => {

  for (const data of (productData as ProductData[]).filter((p) => p.shouldExist)) {
    test(`Happy Path: ${data.productName} exists in ${data.apiCategory}`, async ({ productController }) => {
      const res = await productController.getProductsByCategory(data.apiCategory!);
      expect(res.status(), 'Response status should be success').toBe(200);

      const body = await res.json();
      const items = body.Items;

      const product = items.find(
        (p: { title: string }) => p.title.toLowerCase() === data.productName.toLowerCase()
      );

      expect(product, `Product details for '${data.productName}' should be returned`).toBeDefined();
      expect(product, `Product details for '${data.productName}' should match`).toMatchObject({
        cat: data.apiCategory,
        title: data.productName,
        price: expect.any(Number),
        desc: expect.any(String),
        img: expect.any(String),
        id: expect.any(Number),
      });
    });
  }

  for (const data of (productData as ProductData[]).filter((p) => !p.shouldExist)) {
    test(`Negative Path: ${data.productName} not in ${data.apiCategory}`, async ({ productController }) => {
      const res = await productController.getProductsByCategory(data.apiCategory!);
      expect(res.status(), 'Response status should be success').toBe(200);

      const body = await res.json();
      const items = body.Items;

      const product = items.find(
        (p: { title: string }) => p.title.toLowerCase() === data.productName.toLowerCase()
      );

      expect(product, `Product details for '${data.productName}' should not be found`).toBeUndefined();
    });
  }
});
