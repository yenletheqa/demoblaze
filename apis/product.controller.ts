import { APIRequestContext } from '@playwright/test';

export class ProductController {
    constructor(private request: APIRequestContext) {}

    async getProductsByCategory(category: 'phone' | 'notebook' | 'monitor') {
        return await this.request.post('/bycat', {
            data: { cat: category }
        });
    }
}