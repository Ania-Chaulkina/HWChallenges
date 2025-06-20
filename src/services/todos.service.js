import { test } from '@playwright/test';
import{URL} from '../fixtures/config';

export class TodosService {
    constructor(request) {
        this.request = request;
    }

    async get(token) {
        return test.step('post /challenges', async () => {
            const response = await this.request.get(`${URL}todos`, {
                headers: {
                    'x-challenger': token,
                },
            });
            return response;
        });

   
    }
}