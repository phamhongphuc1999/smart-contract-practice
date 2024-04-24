import './Verifier.sol';
import 'hardhat/console.sol';

contract Guardian is Verifier {
  uint[] private guardians;
  uint256 public counter;
  uint256 public threshold;

  constructor() {
    counter = 0;
    threshold = 2;
  }

  function getGuardian(uint index) public view returns (uint) {
    return guardians[index];
  }

  function addGuardian(uint _guradian) external {
    guardians.push(_guradian);
  }

  function verifyGuardian(
    uint[2] calldata _pA,
    uint[2][2] calldata _pB,
    uint[2] calldata _pC,
    uint[2] calldata _pubSignals
  ) external payable {
    bool isValid = verifyProof(_pA, _pB, _pC, _pubSignals);
    require(isValid, 'Proof is invalid');
    uint256 _len = guardians.length;
    bool isGuardian = false;
    for (uint256 i = 0; i < _len; i++) {
      if (_pubSignals[1] == guardians[i]) {
        isGuardian = true;
      }
    }
    require(isGuardian, "Verifier isn't a guardian");
    counter += 1;
  }
}
