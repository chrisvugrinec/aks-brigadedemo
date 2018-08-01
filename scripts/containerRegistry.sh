#!/bin/bash

#echo "solname:"
#read solname

#az acr create -n $solname -g $solname -l westeurope --admin-enabled true --sku Basic
#password=$(az acr credential show -n $solname -g $solname --query "passwords[1].value")

# create registry secret in kube
#kubectl create secret docker-registry draft-pullsecret --docker-server=$solname.azurecr.io --docker-username=$solname --docker-password=$password --docker-email=chrisvugrinec@gmail.com


