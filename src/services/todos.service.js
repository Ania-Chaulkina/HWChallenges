import { test } from '@playwright/test';
import{URL} from '../fixtures/config';

export class TodosService {
    constructor(request) {
        this.request = request;
    }

    async getId(token, id) {
        return test.step("Получаем задание по id", async () => {
        const response = await this.request.get(`${URL}todos/${id}`, {
            headers: {
                    'x-challenger': token,
                },
            });
            return response;
        });
    };

    async getNotFound(token) {
        return test.step("Выполняем неверный запрос списка заданий", async () => {
            const response = await this.request.get(`${URL}todo`, {
                headers: {
                    'x-challenger': token,
                }
            });
            return response;
        });
    };

    async get(token, filter ='', acceptHeader) {
        return test.step('Получение списка задач', async () =>{
            const response = this.request.get(`${URL}todos${filter}`, 
            {
                headers: {
                    'x-challenger': token,
                    'Accept': acceptHeader,
                }
            }
            )
            return response;     
        })
    };

    async getContentType(token, acceptHeader) {
        return test.step("Получение XML,JSON", async () => {
            const response = await this.request.get(`${URL}todos`, {
                headers: {
                    'x-challenger': token,
                    'Accept': acceptHeader,
                }
            });
            return response;
        });
    };

    async post(token, title ='', description ='', status = '', id ='') {
        return test.step('Создаем задачу', async () => {
            const response = await this.request.post(`${URL}todos${id}`, {
                    headers: {
                        'x-challenger': token,
                    },
                    data:{
                        'title': title,
                        'description': description,
                        'doneStatus': status
                    }
                })
            return response;
        })
    }


    async put(token, id, title, description, status) {
        return test.step('Вносим изменения', async () => {
            const response = await this.request.put(`${URL}todos/${id}`, {
                    headers: {
                        'x-challenger': token,
                    },
                    data:{
                        'title': title,
                        'doneStatus': status,
                        'description': description
                    }
                })
            return response;
        })
    }

    async delete(token, id) {
        return test.step("Удаляем задание", async () => {
            const response = await this.request.delete(`${URL}todos/${id}`, {
                headers: {
                    'x-challenger': token,
                }
            });
            return response;
        });
    }

    



}

    