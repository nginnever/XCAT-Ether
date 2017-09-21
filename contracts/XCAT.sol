pragma solidity ^0.4.15;

/**
 * @title XCAT
 * @dev Ethereum locking script
 */
contract XCAT {
  address public locker;
  bytes32 public hashedSecret;
  uint256 public lockedFunds;
  uint256 public lockTime;

  function buy(bytes32 _hash, uint256 _lockTime) payable {
    require(now < _lockTime);
    require(_hash != 0);

    lockTime = _lockTime;
    lockedFunds = msg.value;
    locker = msg.sender;
  }

  function initiate(bytes32 _hash, uint256 _lockTime) payable {
    require(now < _lockTime);
    require(_hash != 0);

    locker = msg.sender;
    lockedFunds = msg.value;
    lockTime = _lockTime;
    hashedSecret = _hash;

    }

  function releasePreimage(bytes _preimage) {
    bytes32 test = sha256(sha256(_preimage));
    if(test == hashedSecret){
      msg.sender.transfer(lockedFunds);
    }
  }

  function releaseTime() {
    if(now >= lockTime) {
      locker.transfer(lockedFunds);
    }
  }
}
