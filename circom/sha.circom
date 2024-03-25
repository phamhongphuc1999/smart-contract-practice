pragma circom 2.0.0;
include "../node_modules/circomlib/circuits/poseidon.circom";

template Guardians(){
    signal input address;
    signal output out;

    component poseidon = Poseidon(1);

    poseidon.inputs[0] <== address;
    out <== poseidon.out;
}

component main = Guardians();