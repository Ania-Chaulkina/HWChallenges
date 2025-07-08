import { expect } from '@playwright/test';
import { test } from '../src/fixtures/index'
import { Api, URL } from '../src/fixtures/index';
import {  ToDoBuilder } from '../src/builder/todo.builder'

let token;

test.beforeAll(async ({ api }) =>{
	let randomCreate;
	randomCreate = new ToDoBuilder().addTitle().addDescription().addStatus().generate();
	token = await api.challenger.post();
	console.log(token)
});

/*test.beforeAll(async ({ request }) => {
		const api = new Api(request);
		const response = await api.challenger.post();
		
		const headers = await response.headers();
		token = headers['x-challenger'];
		console.log(`${URL}/gui/challenges/${token}`);
	});*/

test.describe('Метод GET', () => {

	test('02 /challendes(200)', {
		tag: ['@GET'],},
		async ({ api }) => {
		const response = await api.challenges.get(token);

        expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body.challenges.length).toBe(59);
	});

    test('03 /todos(200)', {
		tag: ['@GET'],},
		async ({ api }) => {
		const response = await api.todos.get(token);

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(body.todos).not.toBeNull()
	});

	test('04 /todos(404)', {
		tag: ['@GET'],}, 
		async ({ api }) => {
		const response = await api.todos.getNotFound(token);
        await expect (response.status()).toBe(404);
    });

	test('05 /todos/{id} (200)', {
		tag: ['@GET'],},
		async ({ api }) => {
		const id = 5;
        const response = await api.todos.getId(token, id);
        await expect (response.status()).toBe(200);
        const body = await response.json();
        expect (body.todos[0].title).toBe('pay invoices');
    });

	test('06 /todos/id (404)', {
		tag: ['@GET'],},
		async ({ api }) => {
		const id = 100;
		const response = await api.todos.getId(token, id);
        await expect (response.status()).toBe(404);
    });
	
	test('07 /todos (200) ? filter', {
		tag: ['@GET'],},
		async ({ api }) => {
		const filter = '?doneStatus=true';
		const response = await api.todos.get(token, filter);
		await expect (response.status()).toBe(200);
		const body = await response.json();
		await expect (body.todos.length).toBe(0);
    });

	test('25 /todos(200) XML',{
    tag: ['@GET'],}, 
	async ({ api }) => {
    const acceptHeader = 'application/xml'
    const response = await api.todos.getContentType(token, acceptHeader);
    expect (response.status()).toBe(200);
    const responseHeader = response.headers()
    expect (responseHeader['content-type']).toBe('application/xml')
    });

	test('26 /todos(200) JSON',{
    tag: ['@GET'],}, 
	async ({ api }) => {
    const acceptHeader = 'application/json'
    const response = await api.todos.getContentType(token, acceptHeader);
    expect (response.status()).toBe(200);
    const responseHeader = response.headers()
    expect (responseHeader['content-type']).toBe('application/json')
    });

});

test.describe.only('Метод POST', () => {

	test ('09 /todos (201)', {
	tag: ['@POST'],},	
	async ({ api }) => {
    const response = await api.todos.post(token, randomCreate.title, randomCreate.description, randomCreate.status);
    const body = await response.json();
    await expect (response.status()).toBe(201);
    await expect (body.title).toBe(randomCreate.title);;
	});

	test('10 /todos(400)',{
    tag: ['@POST'],}, 
	async ({ api }) => {
    const response = await api.todos.post(token, randomCreate.title, randomCreate.description, 'tttt');
    const body = await response.json();
    await expect (response.status()).toBe(400);
    await expect (body.errorMessages).toEqual(['Failed Validation: doneStatus should be BOOLEAN but was STRING']);
    })


});



