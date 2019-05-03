//https://ethereum.stackexchange.com/questions/9142/how-to-convert-a-string-to-bytes32
//https://ethereum.stackexchange.com/questions/2519/how-to-convert-a-bytes32-to-string
pragma solidity >=0.4.0 <0.6.0;
contract AirlineConsortium{
    struct airline{
        bytes32 username;
        uint balance;
        bool registered;
        bytes32 password;
    }
    struct open{
        address requester;
        bytes32 departure;
        bytes32 arrival;
        uint seats;
        bytes32 date;
        bytes32 flight_date;
        bytes32 status;
    }
    struct offer{
        bytes32 departure;
        bytes32 arrival;
        uint seats;
        bytes32 date;
        bytes32 flight_date;
        address seller;
        address buyer;
        bytes32 status;
    }
    struct buy{
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
    mapping(address=>open)  request_transaction;
    mapping(address=>offer) response_transaction;
    mapping(address=>buy) confirm_transaction;
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
    modifier onlyRegisteredUser(address responder){
        require(airlines[msg.sender].registered== true && airlines[responder].registered==true);
        _;
    }
    function open_transaction(string memory departure, string memory arrival,uint seats,string memory flight_date,string memory date) public onlyRegisteredUser(msg.sender) returns(bytes32 availability){
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
    function offer_transaction(address buyer,string memory departure, string memory arrival,uint seats,string memory flight_date,string memory date) public onlyRegisteredUser(msg.sender){
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
    function buy_transaction(address seller,string memory departure, string memory arrival,uint seats,string memory flight_date,string memory date) public onlyRegisteredUser(msg.sender){
        if (bytes(departure).length>0 && bytes(arrival).length>0 && bytes(date).length>0 && bytes(flight_date).length>0){
            //airlines[msg.sender].seat-=seats;
            //airlines[responder].seat+=seats;
            if (seats>0){
                confirm_transaction[msg.sender].seller=seller;
                confirm_transaction[msg.sender].buyer=msg.sender;
                confirm_transaction[msg.sender].departure=convert_to_bytes(departure);
                confirm_transaction[msg.sender].arrival=convert_to_bytes(arrival);
                confirm_transaction[msg.sender].seats=seats;
                confirm_transaction[msg.sender].flight_date=convert_to_bytes(flight_date);
                confirm_transaction[msg.sender].date=convert_to_bytes(date);
            }
        }
        else{
            revert();
        }
    }
    function registerUser(address toUser,string memory  name, string memory password,uint balance)public{
        if (bytes(name).length>0){
            airlines[toUser].username= convert_to_bytes(name);
            airlines[toUser].password=convert_to_bytes(password);
            airlines[toUser].balance=balance;
            airlines[toUser].registered=true;
        }
        else{
            revert();
        }

    }
    function convert_to_bytes(string memory name) public returns(bytes32 result){
        assembly {
        result := mload(add(name, 32))
        }
        return result;
    }
    function convert_to_string(bytes32 x) public returns (string memory bytesStringTrimmed){
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
    function getBalance() public returns(string memory username){
        string memory s= convert_to_string(airlines[msg.sender].username);
        return s;
    }
}
