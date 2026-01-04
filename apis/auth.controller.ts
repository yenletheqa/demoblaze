import { APIRequestContext } from '@playwright/test';

export class AuthController {
    constructor(private request: APIRequestContext) { }

    async login(username: string, password: string) {
        return await this.request.post('/login', {
            data: {
                username: username,
                password: btoa(password)
            }
        });
    }

    async check(token: string) {
        return await this.request.post('/check', {
            data: {
                token: token
            }
        });
    }
}