#!/bin/sh

echo "Config: Current Chunk $1, Number of chunks: $2"

# Calculate how many test files should each chunk have
I=$( expr "$2" '+' "1")
CHUNK_SIZE=$((`./node_modules/jest/bin/jest.js --listTests | wc -l` / $I))

echo "Chunk size: $CHUNK_SIZE"

# Get the list of the tests that will run
TEST_START_INDEX=$( expr "$CHUNK_SIZE" '*' "$1")
TEST_FILES=$(./node_modules/.bin/jest --listTests | head -n $TEST_START_INDEX | tail -n $CHUNK_SIZE)

echo "======= TEST FILES ======="
echo $TEST_FILES

# Run each chunk
NODE_ENV=test docker-compose up -d postgres && ./node_modules/jest/bin/jest.js --config ./jest.config.js --ci --coverage --runInBand --forceExit $TEST_FILES
