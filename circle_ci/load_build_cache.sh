#!/bin/bash
mkdir -p node_modules; mkdir -p bower_components;
cp -rf ~/node_cache/ ./node_modules/ | true
cp -rf ~/bower_cache/ ./bower_components/ | true