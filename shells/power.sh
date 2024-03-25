snarkjs powersoftau new bn128 $1 $2.ptau -v
snarkjs powersoftau contribute $2.ptau $21.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 $21.ptau $2final.ptau -v
snarkjs groth16 setup $2.r1cs $2final.ptau $2.zkey
snarkjs zkey contribute $2.zkey $21.zkey --name="1st Contributor Name" -v
snarkjs zkey export verificationkey $21.zkey verification_key.json
snarkjs groth16 prove $21.zkey witness.wtns proof.json public.json