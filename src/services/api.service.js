
import { ChallengerService, ChallengesService, TodosService,Heartbeat } from "./index";

export class ApiPage {
    constructor(request) {
        this.request = request;
        this.challenger = new ChallengerService(request);
        this.todos = new TodosService(request);
        this.challenges = new ChallengesService(request);
        this.heartbeat = new Heartbeat(request);
    }
}