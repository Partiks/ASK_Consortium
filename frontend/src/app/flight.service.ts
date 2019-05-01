import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
	
	uri = 'http://localhost:4000';

  	constructor(private http: HttpClient) {  }


  	getAllDeltaFlights(){
  		console.log(this.http.get(`${this.uri}/flights/delta`));
  		return this.http.get(`${this.uri}/flights/delta`);
  	}

  	getDeltaFlightById(id){
  		return this.http.get(`${this.uri}/flights/delta/${id}`);
  	}

  	addDeltaFlight(de, arr, price, seats){
  		console.log("ADD_SOUTH_FLIGHT_SERVICE --------");
  		const flight = {
  		departure: departure,
  		arrival: arr,
  		price: price,
  		seats_available: seats
  		};
  		return this.http.post(`${this.uri}/flights/delta/add`, flight);
  	}

  	updateDeltaFlight(id, n_de, n_arr, n_price, n_seats){
  		const flight = {
  		departure: n_de,
  		arrival: n_arr,
  		price: n_price,
  		seats_available: n_seats
  		};
  		console.log("SOUTH_FLIGHT_UPDATE_SERVICES ----");
  		console.log(item);
  		console.log(`${id}`);
  	  console.log(`${this.uri}/flights/delta/update/${id}`);
  		return this.http.post(`${this.uri}/flights/delta/update/${id}`, flight);
  	}

  	deleteDeltaFlight(id){
  		return this.http.get(`${this.uri}/flights/delta/delete/${id}`);
  	}

  	getAllSouthFlights(){
  		console.log(this.http.get(`${this.uri}/flights/south`));
  		return this.http.get(`${this.uri}/flights/south`);
  	}

  	getSouthFlightById(id){
  		return this.http.get(`${this.uri}/flights/south/${id}`);
  	}

  	addSouthFlight(de, arr, price, seats){
  		console.log("ADD_SOUTH_FLIGHT_SERVICE --------");
  		const flight = {
  		departure: departure,
  		arrival: arr,
  		price: price,
  		seats_available: seats
  		};
  		return this.http.post(`${this.uri}/flights/south/add`, flight);
  	}

  	updateSouthFlight(id, n_de, n_arr, n_price, n_seats){
  		const flight = {
  		departure: n_de,
  		arrival: n_arr,
  		price: n_price,
  		seats_available: n_seats
  		};
  		console.log("SOUTH_FLIGHT_UPDATE_SERVICES ----");
  		console.log(item);
  		console.log(`${id}`);
  	  console.log(`${this.uri}/flights/south/update/${id}`);
  		return this.http.post(`${this.uri}/flights/south/update/${id}`, flight);
  	}

  	deleteSouthFlight(id){
  		return this.http.get(`${this.uri}/flights/south/delete/${id}`);
  	}
}
