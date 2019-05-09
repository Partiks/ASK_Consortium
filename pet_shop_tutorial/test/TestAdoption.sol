pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption{
	// The address of the adoption contract to be tested
	Adoption adoption = Adoption(DeployedAddresses.Adoption());

	// The id of the pet that will be used for testing
	uint expectedPetId = 8;

	// The expected owner of adopted pet is this contract
	address expectedAdopter = address(this);

	function testUserCanAdoptPet() public {
		uint returnedId = adoption.adopt(expectedPetId);

		Assert.equal(returnedId, expectedPetId, "Error. Pet not macthed with expected pet adoption id.");
	}

	function testGetAdopterAddressByPetId() public {
		address adopter = adoption.adopters(expectedPetId);

		Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract.");
	}

	function testGetAllAdopters() public {
		address[16] memory adopters = adoption.getAdopters();

		Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner address is not this contract's address");
	}




}