//https://ethereum.stackexchange.com/questions/9142/how-to-convert-a-string-to-bytes32
//https://ethereum.stackexchange.com/questions/2519/how-to-convert-a-bytes32-to-string
pragma solidity >=0.4.0 <0.6.0;
contract AskAirlineConsortium{
	struct airline{
		bytes32 username;
		uint balance;
		bool registered;
		bytes32 password;
	}
	struct open_transaction{
		address requester;
		bytes32 departure;
		bytes32 arrival;
		uint seats;
		bytes32 date;
		bytes32 flight_date;
		bytes32 status;
	}
	struct offer_transaction{
		bytes32 departure;
		bytes32 arrival;
		uint seats;
		bytes32 date;
		bytes32 flight_date;
		address seller;
		address buyer;
		bytes32 status;
	}
	struct buy_transaction{
		bytes32 departure;
		bytes32 arrival;
		uint seats;
		bytes32 date;
		bytes32 flight_date;
		address seller;
		address buyer;
		bytes32 status;
	}
	address chairperson;
	//creating user object
	mapping (address=> airline)  airlines;
	mapping(address=>open_transaction)  request_transaction;
	mapping(address=>offer_transaction) response_transaction;
	mapping(address=>buy_transaction) confirm_transaction;
	constructor ()public{
		chairperson=msg.sender;
		airlines[chairperson].username="Chairperson";
		//airlines[chairperson].balance=bal;
		airlines[chairperson].registered=true;
	}
	modifier onlyRegistered(){
		require(airlines[msg.sender].registered==true);
		_;
	}
	modifier onlyRegisteredUsers(address payable responder){
		require(airlines[msg.sender].registered == true && airlines[responder].registered == true);
		_;
	}
	function request(string memory departure, string memory arrival,uint seats,string memory flight_date,string memory date) public onlyRegistered {
		if (bytes(departure).length>0 && bytes(arrival).length>0 && bytes(date).length>0 &&bytes(flight_date).length>0){
			//airlines[msg.sender].seat-=seats;
			//airlines[responder].seat+=seats;
			if (seats>0){
				request_transaction[msg.sender].requester=msg.sender;
				request_transaction[msg.sender].departure=convert_to_bytes(departure);
				request_transaction[msg.sender].arrival=convert_to_bytes(arrival);
				request_transaction[msg.sender].seats=seats;
				request_transaction[msg.sender].flight_date=convert_to_bytes(flight_date);
				request_transaction[msg.sender].date=convert_to_bytes(date);
			}
		}
		else{
			revert();
		}
	}
	function offer(address payable buyer,string memory departure, string memory arrival,uint seats,string memory flight_date,string memory date) public onlyRegisteredUsers(buyer){
		if (bytes(departure).length>0 && bytes(arrival).length>0 && bytes(date).length>0 && bytes(flight_date).length>0){
			//airlines[msg.sender].seat-=seats;
			//airlines[responder].seat+=seats;
			if (seats>0){
				response_transaction[msg.sender].seller=msg.sender;
				response_transaction[msg.sender].buyer=buyer;
				response_transaction[msg.sender].departure=convert_to_bytes(departure);
				response_transaction[msg.sender].arrival=convert_to_bytes(arrival);
				response_transaction[msg.sender].seats=seats;
				response_transaction[msg.sender].flight_date=convert_to_bytes(flight_date);
				response_transaction[msg.sender].date=convert_to_bytes(date);
			}
		}
		else{
			revert();
		}
	}
	function buy(address payable seller,string memory departure, string memory arrival,uint seats,string memory flight_date,string memory date) public payable onlyRegisteredUsers(seller){
		if (bytes(departure).length>0 && bytes(arrival).length>0 && bytes(date).length>0 && bytes(flight_date).length>0 && seats>0 && msg.sender.balance > seats ){
			//airlines[msg.sender].seat-=seats;
			//airlines[responder].seat+=seats;
			confirm_transaction[msg.sender].seller=seller;
			confirm_transaction[msg.sender].buyer=msg.sender;
			confirm_transaction[msg.sender].departure=convert_to_bytes(departure);
			confirm_transaction[msg.sender].arrival=convert_to_bytes(arrival);
			confirm_transaction[msg.sender].seats=seats;
			confirm_transaction[msg.sender].flight_date=convert_to_bytes(flight_date);
			confirm_transaction[msg.sender].date=convert_to_bytes(date);
			settlePayment(seller);
		}
		else{
			revert();
		}
	}

	function settlePayment(address payable seller) public payable{
		seller.transfer(msg.value);
	}

	function registerUser(string memory  name, string memory password)public{
		if (bytes(name).length>0 && bytes(password).length>0){
			airlines[msg.sender].username= convert_to_bytes(name);
			airlines[msg.sender].password=convert_to_bytes(password);
			airlines[msg.sender].registered=true;
		}
		else{
			revert();
		}

	}
	function convert_to_bytes(string memory name) internal pure returns(bytes32 result){
		assembly {
		result := mload(add(name, 32))
		}
		return result;
	}
	function convert_to_string(bytes32 x) internal pure returns (string memory bytesToStr){
		bytes memory bytesString = new bytes(32);
		uint charCount = 0;
		for (uint j = 0; j < 32; j++) {
			byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
			if (char != 0) {
				bytesString[charCount] = char;
				charCount++;
			}
		}
		bytes memory bytesStringTrimmed = new bytes(charCount);
		for(uint j = 0; j < charCount; j++) {
			bytesStringTrimmed[j] = bytesString[j];
		}
		return string(bytesStringTrimmed);

	}

	function getBalance() view public returns(uint s){
		//string memory s= convert_to_string(airlines[msg.sender].username);
		s = msg.sender.balance;
		return s;
	}
}
