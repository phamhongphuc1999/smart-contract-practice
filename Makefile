PROJECT_NAME=smart_contract_practice

# colors
GREEN = $(shell tput -Txterm setaf 2)
YELLOW = $(shell tput -Txterm setaf 3)
WHITE = $(shell tput -Txterm setaf 7)
RESET = $(shell tput -Txterm sgr0)
GRAY = $(shell tput -Txterm setaf 6)
TARGET_MAX_CHAR_NUM = 20

## Compile circom. | Run
compile:
	circom $(FILE) --r1cs --wasm

## Compute witness with WebAssembly.
witness:
	node $(PATH)/generate_witness.js $(PATH)/$(NAME).wasm input.json witness.wtns

## Genrate a proof.
power:
	@chmod +x ./shells/power.sh
	@./shells/power.sh $(POWER) $(NAME)

## Verify a proof.
verify:
	snarkjs groth16 verify verification_key.json public.json proof.json

## Compile a smart contract.
solidity:
	snarkjs zkey export solidityverifier $(NAME)1.zkey verifier.sol

## Generate parameters for smart contract.
generate:
	snarkjs generatecall

## Clear.
clear:
	rm -rf $(NAME)_js
	rm proof.json
	rm public.json
	rm verification_key.json
	rm $(NAME).ptau
	rm $(NAME)1.ptau
	rm $(NAME)final.ptau
	rm $(NAME).zkey
	rm $(NAME)1.zkey
	rm $(NAME).r1cs
	rm witness.wtns
	rm verifier.sol

## Shows help. | Help
help:
	@echo ''
	@echo 'Usage:'
	@echo ''
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
		    if (index(lastLine, "|") != 0) { \
				stage = substr(lastLine, index(lastLine, "|") + 1); \
				printf "\n ${GRAY}%s: \n\n", stage;  \
			} \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			if (index(lastLine, "|") != 0) { \
				helpMessage = substr(helpMessage, 0, index(helpMessage, "|")-1); \
			} \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
	@echo ''

format:
	black .