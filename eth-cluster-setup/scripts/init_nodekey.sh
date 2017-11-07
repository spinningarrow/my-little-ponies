#!/bin/bash

bootnode --genkey ./data/bootnode.key
bootnode --writeaddress --nodekey ./data/bootnode.key > ./data/bootnode.pub
