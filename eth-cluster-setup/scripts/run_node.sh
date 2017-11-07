#!/bin/bash

geth --networkid 47889 --rpc --rpcaddr "0.0.0.0" --rpcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpccorsdomain "*" --bootnodes "enode://$(cat /root/bootnode.pub)@$(getent hosts bootnode | cut -d' ' -f1):30301"
