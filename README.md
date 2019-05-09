CSE 510 or 526 - Blockchain Application Development Project Lab - 2 Airlines ASK Consortium

Team Members:
- Ankit Kumar Sinha (50286874) (ankitsin)
- Parth Rasikkumar Patel (50290764) (parthras)

-> The full web stack with integration with Ganache (GUI) blockchain is working. We've tested it with Ganache GUI blockchain.

Web Application Part 1 Setup:
1. There are two folders: frontend and backend. Frontend hosts the Angular frontend files and backend hosts the NodeJS server and blockchain smart contract and other files.
	NOTE: Angular CLI version: 7.3.4, Node version: 10.15.2, npm version: 6.4.1, solc version: 0.5.8, web3 version: 1.0.0-beta.48

2. Install NodeJS node package management (npm) and MongoDB on whichever machine you are trying to execute the application.
 (Make sure the MongoDB is running in the background and listening on port 27017.)

3. Create one database named "ask_consortium" and four collections named "Delta_Flights_DB", "Southwest_Flights_DB", "users", and "transactions" in the MongoDB database using any tool or mongo's CLI. Then add the following two entries to the Delta_Flights_DB collection for testing the web app:
{
	"departure" : "BUF",
	"arrival" : "NYC",
	"flight_date" : "05-01-2019",
	"available_seats" : 72
}

{
	"departure" : "BUF",
	"arrival" : "ROC",
	"flight_date" : "05-01-2019",
	"available_seats" : 14
}

4. Go to the "BACKEND" folder and install the dependencies of the NodeJS server backend and blockchain solc and web3 packages by running the following commands:
	- cd backend
	- npm install -g @angular/cli
	- npm install --save-dev babel-watch
	- npm install express
	- npm install mongoose
	- npm install cors
	- npm install --save-dev @babel/core
	- npm install --save-dev @babel/preset-env
	- npm install --save body-parser
	- npm install web3@1.0.0-beta.48
	- npm install solc

	- Then start the Ganache GUI application and click on "Quickstart" to start the Blockchain RPC server on port 7545

5. Run the following command to compile the smart contract "AskAirlineConsortium" to compile it while in the "backend" folder so that we can use the .bin and .abi files to deploy the smart contract in our nodejs code:
	- node_modules/.bin/solcjs --abi --bin blockchain/AskAirlineConsortium.sol

6. Go to the "frontend" folder and install the dependencies of the Angular frontend application by running the following commands:
	- cd frontend
	- ng add @angular/material
	NOTE: We've selected the material deep purple and amber theme while setting up angular material package and this time. Feel free to try out new themes though :)

7. Go to the "backend" application folder and run the following command to start the NodeJS backend server and deploy the ASK:
	- cd backend
	- npm run dev

8. Go to the "frontend" application folder and run the following command to start the angular frontend server:
	- ng serve --open

9. After angular has successfully compiled, you should be greeted with the login page where register yourself as "a_delta" and "b_south" to mimic the operation of two airlines registering. Please use the exact names "a_delta" and "b_south" as usernames because currently the code is supposed to run with transactions enabling between these two accounts only. Login as b_south and create a request for seats by clicking on "Request seats from ASK Airlines" button and fill the details according to the dummy flights data we inserted in step 3. 
Now, Delta airlines has the flight seats available and you can login using "a_delta" account and offer seats to the requesting Southwest airlines by clicking on Offer Seats button. Then you can login again using "b_south" account of Southwest airlines and buy the seats from them. All three - request, response (offer seats), and buy transactions are recorded on Blockchain using AskAirlineConsortium.sol smart contract and the balance of respective airlines accounts are updated. Please note that here we've fixed the price of each seat to be of 1 ether. So, if you request for and buy 10 seats for example, then the requester's balance (here b_south's account) will be deducted of 10 ethers and seller account's balance (here a_delta) will be added 10 ethers. You can try and click on buy and offer on already transacted requests and responses but you'll see that the application throws an error. You can create multiple requests per airlines and offer multiple seats to different destinations and dates using the application.

-> Rules/Characteristics of Angular Marketplace:
	- Any airline can register itself into the ASK Consortium but only superuser can unregister.
	- Requester cannot offer or buy his/her own request seats.
	- The seller airlines who responded with available seats cannot buy it's own seats.

-> We've included Part 1 pet shop tutorial code in folder - "pet_shop_tutorial" in the root directory of the folder

-> If any further explanation is required in the project, feel free to contact us at our email IDs: parthras@buffalo.edu or ankitsin@buffalo.edu.


References:
- https://medium.com/codingthesmartway-com-blog/angular-6-mean-stack-crash-course-part-1-front-end-project-setup-and-routing-89bec8332cea
- https://codingthesmartway.com/mean-stack-crash-course/
- https://material.angular.io/
- https://material.angular.io/components/
- https://dzone.com/articles/angular-5-material-design-login-application
- https://stackoverflow.com/questions/41949461/how-to-get-value-from-specific-key-in-nodejs-json
- https://angular.io/guide/lifecycle-hooks
- https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
- https://solidity.readthedocs.io/en/v0.5.3/introduction-to-smart-contracts.html
- https://medium.com/coinmonks/ethereum-land-marketplace-dapp-tutorial-part-1-create-and-deploy-a-smart-contract-351bc0d62be2
- https://cse.buffalo.edu/~bina/cse426/spring2019/Lectures/Ballot.sol
- https://solidity.readthedocs.io/en/v0.5.4/solidity-by-example.html#safe-remote-purchase
- https://dzone.com/articles/ethereum-hello-world-example-using-solc-and-web3
- https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html?highlight=deploy%20send%20contractAddress
