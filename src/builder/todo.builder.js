import { faker } from '@faker-js/faker'

export class ToDoBuilder {
   
    addTitle () {
        this.title = faker.book.title();
        return this;
    };
    addDescription () {
        this.description = faker.food.description();
        return this;
    };
    addStatus() {
        this.status = faker.datatype.boolean();
        return this; 
    };

    generate() {
        return {
            title: this.title,
            description: this.description,
            status: this.status
        }
    };
}

