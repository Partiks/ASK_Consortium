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

  	addUser(uname, password, emp, balance){
  		const user={
  			username: uname,
  			password: password,
        employer: emp,
  			balance: balance
  		};
  		return this.http.post(`${this.uri}/users/add`, user);
  	}

	updateUser(uname, password, emp, balance){
		console.log("REACHED USER UPDATE SERVICE");
	  	const user = {
		  	username: uname,
		  	password: password,
        employer: emp,
		  	balance: balance,
	  	};
	  	console.log("USER UPDATE_SERVICES ----");
	  	return this.http.post(`${this.uri}/users/update/${uname}`, user);
  	}


}