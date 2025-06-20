import { ChallengerService, ChallengesService, TodosService } from '../services/index';

export class Api {
	constructor(request) {
		this.request = request;
		this.challenger = new ChallengerService(request);
		this.challenges = new ChallengesService(request);
		this.todos = new TodosService(request);
	}
}