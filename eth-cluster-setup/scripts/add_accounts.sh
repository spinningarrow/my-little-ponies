#!/bin/bash

geth account new --datadir ./data/miner --password ./conf/password > ./data/account.txt
geth account new --datadir ./data/miner --password ./conf/password >> ./data/account.txt
