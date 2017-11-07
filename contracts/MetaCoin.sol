pragma solidity ^0.4.11;

import "./ConvertLib.sol";

contract MetaCoin {
  struct Post {
    uint timestamp;
    string content;
  }

  uint numOfPosts;

  mapping (uint => Post) public posts;
  mapping (address => uint) balances;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  function MetaCoin() {
    balances[tx.origin] = 10000;
    numOfPosts = 0;
  }

  function sendCoin(address receiver, uint amount) returns (bool sufficient) {
    if (balances[msg.sender] < amount) return false;
    balances[msg.sender] -= amount;
    balances[receiver] += amount;
    Transfer(msg.sender, receiver, amount);
    return true;
  }

  function getBalanceInEth(address addr) returns (uint) {
    return ConvertLib.convert(getBalance(addr), 2);
  }

  function getBalance(address addr) public returns (uint) {
    return balances[addr];
  }

  function createPost(string content) public returns (bool sufficient) {
    posts[numOfPosts].timestamp = now;
    posts[numOfPosts].content = content;
    numOfPosts++;
    return true;
  }

  function getPost(uint postID) public returns (string content, uint timestamp) {
    return (posts[postID].content, posts[postID].timestamp);
  }

  function getLatestPost() constant returns (string content, uint timestamp, uint numberOfPosts) {
    content = posts[numOfPosts - 1].content;
    timestamp = posts[numOfPosts - 1].timestamp;
    numberOfPosts = numOfPosts;
  }

  function getNumberOfPosts() public constant returns (uint numOfPosts) {
    return numOfPosts;
  }
}
