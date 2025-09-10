#!/bin/bash

echo "Testing AI endpoints..."
echo "======================="

echo "1. Testing diagnostic endpoint:"
curl -s http://localhost:9002/api/diagnostic | jq . || curl -s http://localhost:9002/api/diagnostic

echo -e "\n\n2. Testing detailed AI endpoint:"
curl -s http://localhost:9002/api/test-ai-detailed | jq . || curl -s http://localhost:9002/api/test-ai-detailed

echo -e "\n\n3. Testing ask-das-ai endpoint:"
curl -s -X POST http://localhost:9002/api/ai/ask-das-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}' | jq . || curl -s -X POST http://localhost:9002/api/ai/ask-das-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

echo -e "\n\nDone."
