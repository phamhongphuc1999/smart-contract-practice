// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SimpleAuction {
  address payable public beneficiary;
  uint public auctionEndTime;

  address public highestBidder;
  uint public highestBid;

  mapping(address => uint) pendingReturns;
  bool ended;

  event HighestBidIncreased(address bidder, uint amount);
  event AuctionEnded(address winner, uint amount);

  /// The auction has already ended.
  error AuctionAlreadyEnded();
  /// There is already a higher or equal bid.
  error BidNotHighEnough(uint highestBid);
  /// The auction has not ended yet.
  error AuctionNotYetEnded();
  /// The function auctionEnd has already been called.
  error AuctionEndAlreadyCalled();

  constructor(uint biddingTime, address payable beneficiaryAddress) {
    beneficiary = beneficiaryAddress;
    auctionEndTime = block.timestamp + biddingTime;
  }

  function bid() external payable {
    if (block.timestamp > auctionEndTime) revert AuctionAlreadyEnded();
    if (msg.value <= highestBid) revert BidNotHighEnough(highestBid);
    if (highestBid != 0) {
      pendingReturns[highestBidder] += highestBid;
    }
    highestBidder = msg.sender;
    highestBid = msg.value;
    emit HighestBidIncreased(msg.sender, msg.value);
  }

  function withdraw() external returns (bool) {
    uint amount = pendingReturns[msg.sender];
    if (amount > 0) {
      pendingReturns[msg.sender] = 0;
      if (!payable(msg.sender).send(amount)) {
        pendingReturns[msg.sender] = amount;
        return false;
      }
    }
    return true;
  }

  function auctionEnd() external {
    if (block.timestamp < auctionEndTime) revert AuctionNotYetEnded();
    if (ended) revert AuctionEndAlreadyCalled();
    ended = true;
    emit AuctionEnded(highestBidder, highestBid);
    beneficiary.transfer(highestBid);
  }
}
