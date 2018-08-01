#!/bin/bash

#echo "solname:"
#read solname

#az account list -o table

#echo "subscription:"
#read sub

#az group create -n $solname -l westeurope
#az ad sp create-for-rbac -n $solname --role="Contributor" --scopes /subscriptions/$sub/resourceGroups/$solname

#echo "password:"
#read password
#az aks create -g $solname -n $solname --service-principal http://$solname --client-secret $password

#az aks get-credentials -n $solname -g $solname
