import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TransactionService {
	uri = 'http://localhost:4000';

  	constructor(private http: HttpClient) {  }

  	getAllTransactions(){
  		return this.http.get(`${this.uri}/transactions`);
  	}

  	addRequestTransaction(requester, depart, arr, seats, req_date){
  		var day = new Date();
		var d = day.getDate();
		if (d < 10) {
		  var dd = '0' + String(d);
		}
		var m = day.getMonth() + 1; //January is 0!
		if (m < 10) {
		  var mm = 0 + String(m);
		}

		var yyyy = day.getFullYear();


		var today = mm + '/' + dd + '/' + String(yyyy);
		console.log(" REQUEST TRANSACTION HIJO MIJO");
		console.log(today);
		var filler = "-"
  		
  		const transaction = {
  			requester: requester,
  			departure: depart,
  			arrival: arr,
  			req_date: req_date,
  			seats: seats,
  			date: today
  		}

  		console.log("ADDING TRANSACTION TO DATABASE");
  		console.log(transaction);
  		return this.http.post(`${this.uri}/transactions/add`, transaction);
  	}

  	addSeatsTransaction(seller, buyer, depart, arr, seats, seat_price, req_date){
  		var day = new Date();
		var d = day.getDate();
		if (d < 10) {
		  var dd = '0' + String(d);
		}
		var m = day.getMonth() + 1; //January is 0!
		if (m < 10) {
		  var mm = 0 + String(m);
		}

		var yyyy = day.getFullYear();


		var today = mm + '/' + dd + '/' + String(yyyy);
		console.log("NORMAL TRANSACTION HIJO MIJO");
		console.log(today);
  		
  		const transaction = {
  			departure: depart,
  			arrival: arr,
  			req_date: req_date,
  			seller: seller,
  			buyer: buyer,
  			seats: seats,
  			seat_price: seat_price,
  			date: today
  		}

  		console.log("ADDING TRANSACTION TO DATABASE");
  		console.log(transaction);
  		return this.http.post(`${this.uri}/transactions/add`, transaction);
  	}

}
