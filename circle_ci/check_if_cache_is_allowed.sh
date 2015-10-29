#!/bin/bash

BRANCH=$1

if [ "$BRANCH" == "release" ] || [ "$BRANCH" == "master" ]
then
  echo "Branch is marked a main branch, destroying cache and forcing rebuild"
  sudo rm -rf ~/docker_cache
  sudo rm -rf ~/node_cache
  sudo rm -rf ~/bower_cache
else
 echo "Branch is a marked as a development branch, allowing cache for build"
fi