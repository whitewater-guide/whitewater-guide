#!/bin/bash

if [ ! -d "node_modules" ]; then
   echo "node_modules directory not found"
   yarn
fi

npm start