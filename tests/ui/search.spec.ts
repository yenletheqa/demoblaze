import { test, expect } from '@fixtures/pages.fixture';
import searchData from '@data/product.data.json';

type ProductData = {
    productName: string;
    uiCategory: 'Phones' | 'Laptops' | 'Monitors';
    shouldExist: boolean;
    productPrice: string;
};

test.describe('UI: Product Discovery via Category Navigation', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.open();
    });

    for (const data of (searchData as ProductData[]).filter(d => d.shouldExist)) {
        test(`Product is discoverable: ${data.productName} in ${data.uiCategory}`, async ({ homePage }) => {
            await homePage.selectCategory(data.uiCategory);
            const isFound = await homePage.findProduct(data.productName);
            expect(isFound).toBeTruthy();
            expect(homePage.productPrice(data.productPrice)).toBeVisible();
            expect(homePage.productDescription(data.productName)).toBeVisible();
        });
    }

    for (const data of (searchData as ProductData[]).filter(d => !d.shouldExist)) {
        test(`Negative: ${data.productName} is not listed under ${data.uiCategory}`, async ({ homePage }) => {
            await homePage.selectCategory(data.uiCategory);
            const isFound = await homePage.findProduct(data.productName);
            expect(isFound).toBeFalsy();
        });
    }
});