import { Page, Locator, errors } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    readonly loginLink: Locator
    readonly welcomeText: Locator
    readonly categoryLinks: (category: string) => Locator;
    readonly productName: (productName: string) => Locator;
    readonly productPrice: (productPrice: string) => Locator;
    readonly productDescription: (productName: string) => Locator;
    readonly productContainer: Locator;
    readonly nextButton: Locator;
    readonly prevButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.loginLink = page.getByRole('link', { name: 'Log in' });
        this.welcomeText = page.locator('#nameofuser');
        this.productContainer = page.locator('#tbodyid');
        this.nextButton = page.locator('#next2');
        this.prevButton = page.locator('#prev2');

        // Dynamic locators
        this.categoryLinks = (category: string) =>
            page.getByRole('link', { name: `${category}` });
        this.productName = (productName: string) =>
            page.getByRole('link', { name: `${productName}` });
        this.productPrice = (productPrice: string) =>
            page.getByRole('heading', { name: `${productPrice}` });
        this.productDescription = (productName: string) =>
            this.page.locator('.card-block')
                .filter({ has: this.page.getByRole('link', { name: productName }) })
                .locator('p');
    }

    async open() {
        await this.page.goto('/');
    }

    async openLoginModal() {
        await this.loginLink.click();
    }

    async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
        await this.categoryLinks(category).click();
        await this.page.waitForLoadState('load');
    }

    /**
    * Search for a product across multiple pages using the Next and Previous buttons.
    * - Tries the Next button first; if not available, tries the Previous button.
    * - Stops and returns true if the product is found on any page.
    * - Stops and returns false if all pages have been searched.
    * - Compares the displayed product container text after each click to prevent infinite loops.    
    */
    async findProduct(productName: string): Promise<boolean> {
        let prevText = await this.getContainerText();
        let skippingNext = false; // trying to click Next first

        while (true) {
            if (await this.isProductVisible(productName)) return true;

            let clicked = false;

            // Try Next button first
            if ((await this.nextButton.count()) > 0 && !skippingNext) {
                const visible = await this.nextButton.evaluate(btn => window.getComputedStyle(btn).display !== 'none');
                if (visible) {
                    await this.nextButton.scrollIntoViewIfNeeded();
                    await this.nextButton.click();
                    clicked = true;
                }
            }

            // If Next button is not available, click Previous button instead 
            // and stop trying Next on subsequent iterations
            if (!clicked && (await this.prevButton.count()) > 0) {
                const visible = await this.prevButton.evaluate(btn => window.getComputedStyle(btn).display !== 'none');
                if (visible) {
                    await this.prevButton.scrollIntoViewIfNeeded();
                    await this.prevButton.click();
                    clicked = true;
                    skippingNext = true;
                }
            }

            if (!clicked) return false; // no other pages to navigate

            // The Previous button can still be clickable even when there are no more previous pages.
            // Verify that the page content actually changes after the click.
            // Timeout should be configured based on network/environment; 5000ms is generally sufficient.
            await this.waitForContentChange(prevText);

            const newText = await this.getContainerText();
            if (newText == prevText) return false; // no change -> stop
            prevText = newText;
        }
    }

    /** Get visible text of product container */
    private async getContainerText(): Promise<string> {
        return await this.productContainer.textContent();
    }

    /** Check if product is visible */
    private async isProductVisible(productName: string): Promise<boolean> {
        await this.page.waitForLoadState('load');
        const item = this.productName(productName);
        return await item.isVisible();
    }

    /** Wait until product container content changes after click */
    private async waitForContentChange(prevText: string): Promise<boolean> {
        try {
            await this.page.waitForFunction(
                (prev) => document.querySelector('#tbodyid').textContent !== prev,
                prevText,
                { timeout: parseInt(process.env.PAGE_RENDER_TIMEOUT || '5000') }
            );
            return true;
        } catch (e) {
            if (e instanceof errors.TimeoutError) {
                return false;
            }
            throw e;
        }
    }
}