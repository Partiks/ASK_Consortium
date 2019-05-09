pragma solidity ^0.5;
contract Payment {
	address payable transferFrom;
	address payable transferTo;
	uint paymentAmount;
	
	constructor() public {
		transferFrom = msg.sender;
	}
	
	event TransferFund(address _transferTo, address _transferFrom, uint amount);
	
	function transferFund(address payable _transferTo) public payable returns (bool){
		transferTo = _transferTo;
		transferTo.transfer(msg.value);
		emit TransferFund(transferTo, transferFrom, msg.value);
		return true;
	}

	function getBalanceOfCurrentAccount(address payable ad) public payable returns (uint) {
		transferFrom = ad;
		return transferFrom.balance;
	}
}
