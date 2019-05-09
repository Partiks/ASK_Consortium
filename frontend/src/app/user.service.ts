import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
	providedIn: 'root'
})

export class UserService{

	uri = 'http://localhost:4000';

	constructor(private http: HttpClient) {  }

	getAllUsers(){
		return this.http.get(`${this.uri}/users`);
	}

	getUserByUname(uname){
		return this.http.get(`${this.uri}/users/${uname}`);
	}

	getAllUserItems(uname){
		return this.http.get(`${this.uri}/users/${uname}/items`);
	}

	getUserBalance(uname){
		return this.http.get(`${this.uri}/users/${uname}/balance`);
	}

	addUser(uname, password, emp, bal){
		//var bal = this.getUserBalance(uname);
		const user={
			username: uname,
			password: password,
			employer: emp,
			balance: bal
		};
		return this.http.post(`${this.uri}/users/add`, user);
	}

	updateUser(uname, password, emp, bal){
		console.log("REACHED USER UPDATE SERVICE");
		//var bal = this.getUserBalance(uname);
			const user = {
				username: uname,
				password: password,
				employer: emp,
				balance: bal
			};
			console.log("USER UPDATE_SERVICES ----");
			return this.http.post(`${this.uri}/users/update/${uname}`, user);
		}


}