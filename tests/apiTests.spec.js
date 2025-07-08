import { expect } from '@playwright/test';
import { test } from '../src/fixtures/index'
import {  ToDoBuilder } from '../src/builder/todo.builder'


let token;
let randomCreate

test.beforeAll(async ({ api }) =>{
	randomCreate = new ToDoBuilder().addTitle().addDescription().addStatus().generate();
	token = await api.challenger.post();
	console.log(token)
});


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

	test('27 /todos (200) ANY',{
		tag: ['@GET'],}, 
		async ({ api }) => {
			const acceptHeader = '*/*'
            const response = await api.todos.getContentType(token, acceptHeader);
            expect (response.status()).toBe(200);
            const responseHeader = response.headers()
            expect (responseHeader['content-type']).toBe('application/json')
    });

});

test.describe('Метод POST', () => {

	test ('09 /todos (201)', {
		tag: ['@POST'],},	
		async ({ api }) => {
			const response = await api.todos.post(token, randomCreate.title, randomCreate.description, randomCreate.status);
            const body = await response.json();
            await expect (response.status()).toBe(201);
            await expect (body.title).toBe(randomCreate.title);;
	});

	test('10 /todos(400) doneStatus',{
		tag: ['@POST'],}, 
		async ({ api }) => {
			const response = await api.todos.post(token, randomCreate.title, randomCreate.description, 'tttt');
            const body = await response.json();
            await expect (response.status()).toBe(400);
            await expect (body.errorMessages).toEqual(['Failed Validation: doneStatus should be BOOLEAN but was STRING']);
    });

	test('11 /todos(400) title too long',{
		tag: ['@POST'],}, 
		async ({ api }) => {
			const wrongData = 'Issue a POST request to create a todo but fail length validation on the `title` field because your title exceeds maximum allowable characters.Issue a POST request to create a todo but fail length validation on the `title` field because your title exceeds maximum allowable characters.'
            const response = await api.todos.post(token, wrongData, randomCreate.description, randomCreate.status);
            await expect (response.status()).toBe(400);
            expect(response.statusText()).toBe('Bad Request')
    });

	test('12 /todos(400) description too long',{
		tag: ['@POST'],}, 
		async ({ api }) => {
			const wrongData = 'Issue a POST request to create a todo but fail length validation on the `title` field because your title exceeds maximum allowable characters.Issue a POST request to create a todo but fail length validation on the `title` field because your title exceeds maximum allowable characters.Issue a POST request to create a todo but fail length validation on the `title` field because your title exceeds maximum allowable characters.Issue a POST request to create a todo but fail length validation on the `title` field because your title exceeds maximum allowable characters.Issue a POST request to create a todo but fail length validation on the `title` field because your title exceeds maximum allowable characters.Issue a POST request to create a todo but fail length validation on the `title` field because your title exceeds maximum allowable characters.'
            const response = await api.todos.post(token, randomCreate.title, wrongData, randomCreate.status);
            await expect (response.status()).toBe(400);
            expect(response.statusText()).toBe('Bad Request')
    });

	test('13 /todos(201) max out content',{
		tag: ['@POST'],}, 
		async ({ api }) => {
			const title = 'Lorem ipsum dolor sit amet, consectetur efficitur.';
		    const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur luctus luctus felis. Etiam tempor suscipit augue, in euismod nisi tempus vitae. Duis in laoreet sem. Pellentesque erat felis aliquam.'
		    const response = await api.todos.post(token, title, description, randomCreate.status);
		    const body = await response.json();
		    expect (response.status()).toBe(201);
            expect (body.title.length).toBe(50);
            expect (body.description.length).toBe(200);
    });

	test('14 /todos(413) content too long',{
		tag: ['@POST'],}, 
		async ({ api }) => {
			const description = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna. Vestibulum ullamcorper mauris at ligula. Fu';
		    const response = await api.todos.post(token, randomCreate.title, description, randomCreate.status);
            expect (response.status()).toBe(413);
            expect(response.statusText()).toBe('Request Entity Too Large')
    });

	test('15 /todos/{id} (400) extra',{
		tag: ['@POST'],}, 
		async ({ api }) => {
			const title = '';
            const response = await api.todos.post(token, title, randomCreate.description, randomCreate.status);
            expect (response.status()).toBe(400);
			expect(response.statusText()).toBe('Bad Request')
    });

	test('18 /todos/{id} (404)',{
		tag: ['@POST'],}, 
		async ({ api }) => {
			const id = 44;
            const response = await api.todos.post(token, id, randomCreate.title, randomCreate.description, randomCreate.status);
            expect (response.status()).toBe(404);
            expect (response.statusText()).toBe('Not Found');
    });

	test('Доп. Создание задания с невалидным title',{
		tag: ['@POST'],}, 
		async ({ api }) => {
			const title = 'Lorem ipsum dolor sit amet, consectetur efficiturqq.';
		    const response = await api.todos.post(token, title, randomCreate.description, randomCreate.status);
		    const body = await response.json();
		    expect (response.status()).toBe(400);
			expect(response.statusText()).toBe('Bad Request')
    });

	test('Доп. Создание задания с невалидным description',{
		tag: ['@POST'],}, 
		async ({ api }) => {
			const description = 'LLLorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur luctus luctus felis. Etiam tempor suscipit augue, in euismod nisi tempus vitae. Duis in laoreet sem. Pellentesque erat felis aliquam.'
		    const response = await api.todos.post(token, randomCreate.title, description, randomCreate.status);
		    const body = await response.json();
		    expect (response.status()).toBe(400);
			expect(response.statusText()).toBe('Bad Request')
    });
});

test.describe('Метод PUT', () => {
	test('16 /todos/{id} (400)',{
		tag: ['@PUT'],}, 
		async ({ api }) => {
			const id = 100;
			const response = await api.todos.put(token, id, randomCreate.title, randomCreate.description, randomCreate.status);
            expect (response.status()).toBe(400);
    });

	test('19 /todos/{id} full (200)',{
		tag: ['@PUT'],}, 
		async ({ api }) => {
			const id = 1;
            const response = await api.todos.put(token, id, randomCreate.title, randomCreate.description, randomCreate.status);
            expect (response.status()).toBe(200);
            const body = await response.json();
            expect (body.title).toBe(randomCreate.title);
    });

	test('20 /todos/{id} partial (200)',{
		tag: ['@PUT'],}, 
		async ({ api }) => {
			const id = 1;
            const response = await api.todos.put(token, id, randomCreate.title);
            expect (response.status()).toBe(200);
            const body = await response.json();
            expect (body.title).toBe(randomCreate.title);
    });

	test('21 /todos/{id} no title (400)',{
		tag: ['@PUT'],}, 
		async ({ api }) => {
			const id = 1;
            const response = await api.todos.put(token, id, randomCreate.description, randomCreate.status);
            expect (response.status()).toBe(400);
            expect (response.statusText()).toBe('Bad Request');
    });

	test('22 /todos/{id} no amend id (400)',{
		tag: ['@PUT'],}, 
		async ({ api }) => {
			const id = 1;
            const newId = 2;
            const response = await api.todos.put(token, id, newId, randomCreate.title, randomCreate.description, randomCreate.status);
            expect (response.status()).toBe(400);
            expect (response.statusText()).toBe('Bad Request');
    });

	test('Доп задание, обновление задания где слишком длинный title',{
        tag: ['@PUT'],},  
		async ({api}) => {
			const id = '1'
            const title = 'Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque.';
            const response = await api.todos.put(token, title, randomCreate.status, randomCreate.description, id);
            expect (response.status()).toBe(400);
            expect(response.statusText()).toBe('Bad Request')
            });

	test('Доп задание, обновление задания где слишком длинный description',{
        tag: ['@PUT'],},  
		async ({api}) => {
			const id = '1'
            const description = 'Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna. Vestibulum ullamcorper mauris at ligula. Fu';
            const response = await api.todos.put(token, randomCreate.title, randomCreate.status, description, id);
            expect (response.status()).toBe(400);
            expect(response.statusText()).toBe('Bad Request')
            });

	test('Доп задание, обновление задания с максимально длинным заголовком и описанием',{
        tag: ['@PUT'],},  
		async ({api}) => {
			const id = '1'
			const title = 'g elit. Aenean commodo ligula eget dolor. Aenean m';
            const description = 'assa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.';
			const response = await api.todos.post(token, title, description, randomCreate.status);
		    const body = await response.json();
		    expect (response.status()).toBe(201);
            expect (body.title.length).toBe(50);
            expect (body.description.length).toBe(200);
		});

	test('Доп задание, создание задачи через PUT c слишком длинным описанием',{
        tag: ['@PUT'],},  
		async ({api}) => {
            const description = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna. Vestibulum ullamcorper mauris at ligula. Fu';
		    const id = '444';
            const response = await api.todos.put(token, randomCreate.title, randomCreate.description, randomCreate.status, id);
			expect (response.status()).toBe(400);
            expect(response.statusText()).toBe('Bad Request')
            });
});

test.describe('Метод PATCH', () => {
	
    test('42 /heartbeat(500)',{
		 tag: ['@PATCH'],}, 
		 async ({ api }) => {
			const response = await api.heartbeat.getPatchStatusCode(token);
            expect (response.status()).toBe(500);
            expect (response.statusText()).toBe('Internal Server Error');
    })
});

test.describe('Метод DELETE', () => {

	test('41 /heartbeat (405)',{
        tag: ['@DELETE'],},  
		async ({api}) => {
            const response = await api.heartbeat.getDeleteStatusCode(token);
			expect (response.status()).toBe(405);
            expect(response.statusText()).toBe('Method Not Allowed')
            });

	test('58 /todos/{id} (200) all',{
        tag: ['@DELETE'],},  
		async ({api}) => {
			const id = '1';
            const response = await api.todos.delete(token, id);
			expect (response.status()).toBe(200);
            expect(response.statusText()).toBe('OK')
            });

	test('Доп. Удаление задачи без указания id',{
        tag: ['@DELETE'],},  
		async ({api}) => {
			const id = '';
            const response = await api.todos.delete(token, id);
			expect (response.status()).toBe(404);
            expect(response.statusText()).toBe('Not Found')
            });

});




