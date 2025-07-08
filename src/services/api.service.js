import { ToDoBuilder } from "../builder/todo.builder";
import { ChallengerService, ChallengesService, TodosService } from "./index";

export class ApiPage {
    constructor(request) {
        this.request = request;
        this.challenger = new ChallengerService(request);
        this.todos = new TodosService(request);
        this.challenges = new ChallengesService(request);
    }
}