<div align="center">
  <h1>Smart contract practice</h1>
</div>

---

## Run

- Install packages

```shell
yarn install
```

- Create your environment

```shell
cp .env_example .env
```

- Compile contracts

```shell
yarn rmCompile
```

- Run test

```shell
yarn test
```

## Circom usage

I use docker for configing and running circom. If you cause segment fault error on build docker's process, you should change node version, v21.7.3 fit for me.

- Start docker

```shell
docker compose up -d
```

- Exe to docker container

```shell
docker exec -it ubuntu-circom /bin/bash
```

- Setup

```shell
cd workspaces/circom
chmod +x ./shells/setup.sh
source ./shells/setup.sh
```

- Try to compile and generate proof, you can follow command line written in `Makefile`.

#### Step 1: compile circom

```shell
make compile name=circom-file-name
```

#### Step 2: compute witness

```shell
make witness name=circom-file-name
```

#### Step 3: provide power

```shell
make power power=power name=circom-file-name
```

You can select enough power by this [link](https://github.com/iden3/snarkjs)

#### Step 4: generate proof

```shell
make proof name=circom-file-name
```

#### Step 5: try to verify your proof

```shell
make verify
```

## Reference

- https://solidity-by-example.org/data-locations/
- https://docs.soliditylang.org/en
- https://solidity-by-example.org/app/multi-sig-wallet/
- https://medium.com/@AyoAlfonso/implement-account-abstraction-aa-to-rotate-private-keys-while-maintaining-the-same-pubkey-address-b5c01f4d3cbb
- https://vivianblog.hashnode.dev/how-to-create-a-zero-knowledge-dapp-from-zero-to-production#heading-6-test-circuits
- https://medium.com/@cresowallet/social-recovery-fa64ef484396
- https://github.com/thomas-waite/zkSocialRecovery
