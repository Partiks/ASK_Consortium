var Migrations = artifacts.require("Migrations");
//var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  //deployer.deploy(Adoption);
};

/*module.exports = function(deployer){
	deployer.deploy(Adoption);
} */
	