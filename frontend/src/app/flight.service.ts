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

	getAllSouthFlights(){
	console.log(this.http.get(`${this.uri}/flights/south`));
	return this.http.get(`${this.uri}/flights/south`);
	}

	getSpecificDeltaFlight(de, arr, fd){
		console.log("----FLIGHT SERVICE ------" + de + arr + fd);
		//console.log(`${this.uri}/flights/delta/specific/${de}/${arr}/${fd}`);
		//console.log(this.http.get(`${this.uri}/flights/delta/specific/${de}/${arr}/${fd}`));
		return this.http.get(`${this.uri}/flights/delta/specific/${de}/${arr}/${fd}`);
	}

	updateSpecificDeltaFlight(de, arr, fd, seats){
		return this.http.get(`${this.uri}/flights/delta/specific/${de}/${arr}/${fd}/${seats}`);
	}

	updateSpecificSouthFlight(de, arr, fd, seats){
		return this.http.get(`${this.uri}/flights/south/specific/${de}/${arr}/${fd}/${seats}`);
	}

	getSpecificSouthFlight(de, arr, fd){
		return this.http.get(`${this.uri}/flights/delta/specific/${de}/${arr}/${fd}`);
		/*const flight = {
			departure: de,
			arrival: arr,
			flight_date: f_date,
			available_seats: 0
		};
		return this.http.post(`${this.uri}/flights/south/specific`, flight); */
	}

	getDeltaFlightById(id){
		return this.http.get(`${this.uri}/flights/delta/${id}`);
	}

	getSouthFlightById(id){
		return this.http.get(`${this.uri}/flights/south/${id}`);
	}

/*
	addDeltaFlight(){
		console.log("ADD_SOUTH_FLIGHT_SERVICE --------");
		const flight = {
		departure: de,
		arrival: arr,
		available_seats: seats
		};
		return this.http.post(`${this.uri}/flights/delta/add`, flight);
	}

	updateDeltaFlight(id, n_de, n_arr, n_seats){
		const flight = {
		departure: n_de,
		arrival: n_arr,
		available_seats: n_seats
		};
		console.log("SOUTH_FLIGHT_UPDATE_SERVICES ----");
		console.log(flight);
		console.log(`${id}`);
	  console.log(`${this.uri}/flights/delta/update/${id}`);
		return this.http.post(`${this.uri}/flights/delta/update/${id}`, flight);
	}

	deleteDeltaFlight(id){
		return this.http.get(`${this.uri}/flights/delta/delete/${id}`);
	}

	addSouthFlight(de, arr, seats){
		console.log("ADD_SOUTH_FLIGHT_SERVICE --------");
		const flight = {
		departure: de,
		arrival: arr,
		available_seats: seats
		};
		return this.http.post(`${this.uri}/flights/south/add`, flight);
	}

	updateSouthFlight(id, n_de, n_arr, n_seats){
		const flight = {
		departure: n_de,
		arrival: n_arr,
		available_seats: n_seats
		};
		console.log("SOUTH_FLIGHT_UPDATE_SERVICES ----");
		console.log(flight);
		console.log(`${id}`);
		console.log(`${this.uri}/flights/south/update/${id}`);
		return this.http.post(`${this.uri}/flights/south/update/${id}`, flight);
	}

	deleteSouthFlight(id){
		return this.http.get(`${this.uri}/flights/south/delete/${id}`);
	} 
*/
}
