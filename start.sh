#!/bin/bash 

echo "Creating accounts..."
node ./scripts/create-accounts.js

JSON=`cat ./scripts/output/accounts.json`
RESULT='{"keys":[]}'
NUM=1

echo $JSON | jq -r '.[].passphrase' | while read -r passphrase; 
    do 
        echo "Creating keys for account $NUM"
        KEYS=$(./bin/run keys:create --passphrase "$passphrase" --no-encrypt --chainid 1 | jq .keys)
        RESULT=$(echo $RESULT | jq ".keys += $KEYS")
        echo $RESULT > ./scripts/output/validators.json
        NUM=$((NUM+1))
    done 

echo "Creating genesis assets..."
node ./scripts/generate-assets.js

./bin/run genesis-block:create --output ./scripts/output/ --assets-file ./scripts/output/genesis_assets.json

echo "Done!"

