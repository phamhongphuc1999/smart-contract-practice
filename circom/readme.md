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
