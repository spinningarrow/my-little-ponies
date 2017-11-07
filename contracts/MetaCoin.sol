pragma solidity ^0.4.11;

import "./ConvertLib.sol";

contract MetaCoin {
  struct Post {
    uint id;
    uint timestamp;
    string content;
    address createdBy;
  }

  struct Answer {
    uint postID;
    string content;
    address createdBy;
    uint timestamp;
  }

  uint numOfPosts;

  mapping (uint => Post) public posts;
  mapping (uint => Answer[]) public answers;
  mapping (address => int) balances;

  event Transfer(address indexed _from, address indexed _to, int256 _value);

  function MetaCoin() {
    numOfPosts = 0;
  }

  function sendCoin(address receiver, int amount) returns (bool sufficient) {
    balances[msg.sender] -= amount;
    balances[receiver] += amount;
    Transfer(msg.sender, receiver, amount);
    return true;
  }

  function getBalanceInEth(address addr) returns (int) {
    return ConvertLib.convert(getBalance(addr), 2);
  }

  function getBalance(address addr) public returns (int) {
    return balances[addr];
  }

  function createPost(string content) public returns (uint id) {
    posts[numOfPosts].id = id;
    posts[numOfPosts].content = content;
    posts[numOfPosts].createdBy = msg.sender;
    posts[numOfPosts].timestamp = now;
    id = numOfPosts;
    numOfPosts++;
  }

  function getPost(uint postID) public returns (string content, uint timestamp) {
    content = posts[postID].content;
    timestamp = posts[postID].timestamp;
  }

  function getLatestPost() constant returns (string content, uint timestamp, uint numberOfPosts) {
    content = posts[numOfPosts - 1].content;
    timestamp = posts[numOfPosts - 1].timestamp;
    numberOfPosts = numOfPosts;
  }

  function getNumberOfPosts() public constant returns (uint num) {
    num = numOfPosts;
  }

  function createAnswer(uint postID, string content) returns (uint id) {
  }
}
