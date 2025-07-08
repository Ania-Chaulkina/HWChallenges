import { test } from '@playwright/test';
import{URL} from '../fixtures/config';

export class Heartbeat {
    constructor (request) {
        this.request = request;
    }
        async getPatchStatusCode(token) {
            return test.step('Проверяем статус кода PATH', async () => {
                const response = this.request.patch(`${URL}heartbeat`,
                    {
                        headers: {
                            'x-challenger': token,
                        }
                    }
                )
                return response;
            });
        };

        async getDeleteStatusCode(token) {
            return test.step('Проверяем статус кода DELETE', async () => {
                const response = this.request.delete(`${URL}heartbeat`,
                    {
                        headers: {
                            'x-challenger': token,
                        }
                    }
                )
                return response;
            });
        };
}