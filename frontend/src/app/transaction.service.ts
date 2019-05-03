import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TransactionService {
    uri = 'http://localhost:4000';

	constructor(private http: HttpClient) {  }

	getAllTransactions(){
		//console.log("------- PARTIKS TRANSACTION TEST ------");
		//console.log(this.http.get(`${this.uri}/transactions`));
		//console.log("------- PARTIKS TRANSACTION TEST OVER ------");
		return this.http.get(`${this.uri}/transactions`);
	}

    getTransactionById(id){
        return this.http.get(`${this.uri}/transactions/${id}`);
    }

	addRequestTransaction(requester, depart, arr, seats, flight_date){

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
		var today = mm + '-' + dd + '-' + String(yyyy);
		console.log(" REQUEST TRANSACTION HIJO MIJO");
		console.log(today);
		var filler = "-"
		
		const transaction = {
			requester: requester,
			departure: depart,
			arrival: arr,
			flight_date: flight_date,
            seller: filler,
            buyer: filler,
			seats: seats,
			date: today,
            status: 'Open'
		}

		console.log("ADDING TRANSACTION TO DATABASE");
		console.log(transaction);
		return this.http.post(`${this.uri}/transactions/add/request`, transaction);
	}

	addOfferTransaction(tr){
		console.log("OFFER TRANSACTION ---- ");
		delete tr['__v'];
		delete tr['_id'];
		console.log(tr);
		console.log(`${this.uri}/transactions/add/offer`);
		return this.http.post(`${this.uri}/transactions/add/offer`, tr);
	}



	addSeatsTransaction(seller, buyer, depart, arr, seats, flight_date){
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
        var today = mm + '-' + dd + '-' + String(yyyy);
        console.log("NORMAL TRANSACTION HIJO MIJO");
        console.log(today);
		
		const transaction = {
            requester: buyer,
			departure: depart,
			arrival: arr,
			flight_date: flight_date,
			seller: seller,
			buyer: buyer,
			seats: seats,
			date: today,
            status: 'Sold'
		}

		console.log("ADDING TRANSACTION TO DATABASE");
		console.log(transaction);
		return this.http.post(`${this.uri}/transactions/add`, transaction);
	}

	deleteTransactionById(id){
		return this.http.get(`${this.uri}/transactions/delete/${id}`);
	}
}
