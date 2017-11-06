## Requirements

- Node 8+

## Run

1. Start a private ethereum network locally

    Follow https://github.com/vincentchu/eth-private-net

    On the REPL for alice, start RPC using this:

	```
	admin.startRPC('localhost', 8101, '*', 'admin,db,eth,debug,miner,net,shh,txpool,personal,web3')
	```

2. Start the frontend

    - npm install
	- npx truffle develop
		- compile
		- migrate
	- npm run dev

    Go to http://localhost:8080

Reference: https://github.com/truffle-box/webpack-box
