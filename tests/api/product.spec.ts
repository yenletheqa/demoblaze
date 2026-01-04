import { test, expect } from '@fixtures/apis.fixture';
import productData from '@data/product.data.json';

type ProductData = {
    productName: string;
    apiCategory: 'phone' | 'notebook' | 'monitor';
    shouldExist: boolean;
    productPrice: string;
};

test.describe('API: Product Discovery by Category', () => {

    for (const data of (productData as ProductData[]).filter(p => p.shouldExist)) {
        test(`Happy Path: ${data.productName} exists in ${data.apiCategory}`, async ({ productController }) => {
            const res = await productController.getProductsByCategory(data.apiCategory);
            expect(res.status()).toBe(200);

            const body = await res.json();
            const items = body.Items;

            const product = items.find(
                (p: any) => p.title.toLowerCase() === data.productName.toLowerCase()
            );

            expect(product).toBeDefined();
            expect(product).toMatchObject({
                cat: data.apiCategory,
                title: data.productName,
                price: expect.any(Number),
                desc: expect.any(String),
                img: expect.any(String),
                id: expect.any(Number),
            });
        });
    }

    for (const data of (productData as ProductData[]).filter(p => !p.shouldExist)) {
        test(`Negative Path: ${data.productName} not in ${data.apiCategory}`, async ({ productController }) => {
            const res = await productController.getProductsByCategory(data.apiCategory);
            expect(res.status()).toBe(200);

            const body = await res.json();
            const items = body.Items;

            const product = items.find(
                (p: any) => p.title.toLowerCase() === data.productName.toLowerCase()
            );

            expect(product).toBeUndefined();
        });
    }
});