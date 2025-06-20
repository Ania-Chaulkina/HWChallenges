import { test, expect } from '@playwright/test';
import { Api, URL } from '../src/fixtures/index';

let token;
test.describe.only('HW API Challenge', () => {
	test.beforeAll(async ({ request }) => {
		const api = new Api(request);
		const response = await api.challenger.post();

		const headers = await response.headers();
		token = headers['x-challenger'];
		console.log(`${URL}/gui/challenges/${token}`);
	});

	test('Получить список челленджей get /challendes', async ({ request }) => {
		const api = new Api(request);
		const response = await api.challenges.get(token);

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body.challenges.length).toBe(59);
	});

    test('get /todos(200)', async ({ request }) => {
		const api = new Api(request);
		const response = await api.todos.get(token);

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body.todos.length).toBe(10);
	});

	test('get /todos(404)', async ({ request }) => {
		const response = await request.get(`${URL}todo`, {
			headers: {
				'x-challenger': token,
			},
		});
		expect(response.status()).toBe(404);	
	});

	test('get /todos/{id} (200)', async ({ request }) => {
		const response = await request.get(`${URL}todos/1`, {
			headers: {
				'x-challenger': token,
			},
		});
		expect(response.status()).toBe(200);
		const body = await response.json();
	});

	test('get /todos/id (404)', async ({ request }) => {
		const response = await request.get(`${URL}todos/100`, {
			headers: {
				'x-challenger': token,
			},
		});
		expect(response.status()).toBe(404);
	});
	
	test('get /todos (200) ? filter', async ({ request }) => {
		const response = await request.get(`${URL}todos?id=1`, {
			headers: {
				'x-challenger': token,
			},
		});
		expect(response.status()).toBe(200);
		const body = await response.json();
		console.log(body);
		expect(body.json.doneStatus).toBe(true);
		
	});

});



