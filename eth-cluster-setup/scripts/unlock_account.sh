#!/bin/bash

# Unlock main account to run migraiton
geth --exec 'web3.personal.unlockAccount("0xdd04b5cc92e8e21f70e313083cceefc99859f57d","12345678", 6000)' attach http://localhost:8545
