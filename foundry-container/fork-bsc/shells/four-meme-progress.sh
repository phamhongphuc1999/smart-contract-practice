#!/usr/bin/env bash

RPC="http://127.0.0.1:8545"

HELPER="0xF251F83e40a78868FcfA3FA4599Dad6494E46034"
TOKEN="0x48FC55854700CC7aa055EB4bE583769c779d4444"

DECIMAL=1000000000000000000

echo "Calculating..."

# Call contract (output as JSON)
RAW=$(cast call \
  $HELPER \
  "getTokenInfo(address)(address,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,bool)" \
  $TOKEN \
  --rpc-url $RPC \
  --json)

# Parse fields
offers=$(echo "$RAW" | jq -r '.[7]')
maxOffers=$(echo "$RAW" | jq -r '.[8]')
funds=$(echo "$RAW" | jq -r '.[9]')
maxFunds=$(echo "$RAW" | jq -r '.[10]')
liquidityAdded=$(echo "$RAW" | jq -r '.[11]')
quote=$(echo "$RAW" | jq -r '.[1]')

# Convert to human-readable
offers_h=$(echo "scale=4; $offers / $DECIMAL" | bc)
maxOffers_h=$(echo "scale=4; $maxOffers / $DECIMAL" | bc)
funds_h=$(echo "scale=4; $funds / $DECIMAL" | bc)
maxFunds_h=$(echo "scale=4; $maxFunds / $DECIMAL" | bc)

# Progress (%)
progress=$(echo "scale=3; ($maxOffers - $offers) * 100 / $maxOffers" | bc)

echo "--------------------------------"
echo "Token:          $TOKEN"
echo "Quote:          $quote"
echo "LiquidityAdded: $liquidityAdded"
echo "--------------------------------"
echo "Offers:     $offers_h / $maxOffers_h"
echo "Funds:      $funds_h / $maxFunds_h"
echo "Progress:   $progress %"
echo "--------------------------------"
