pragma solidity ^0.4.11;

import "./ConvertLib.sol";

contract MetaCoin {
  struct Post {
    string content;
    address createdBy;
    mapping (address => bool) isVoted;
  }

  uint numOfPosts;

  mapping (uint => Post) posts;
  mapping (uint => uint) likes;
  mapping (address => int) balances;
  mapping (address => bool) isCredited;

  event Transfer(address indexed _from, address indexed _to, int256 _value);
  event CreatePost(uint id);

  function MetaCoin() {
    numOfPosts = 0;
  }

  function isUserCredited() constant returns (bool) {
    return isCredited[msg.sender];
  }

  function creditForFirstTime() returns (bool) {
    if (!isCredited[msg.sender]) {
      balances[msg.sender] = 100;
      isCredited[msg.sender] = true;
    }

    return true;
  }

  function sendCoin(address receiver, int amount) returns (bool) {
    balances[msg.sender] -= amount;
    balances[receiver] += amount;
    Transfer(msg.sender, receiver, amount);
    return true;
  }

  function getBalanceInEth(address addr) constant returns (int) {
    return ConvertLib.convert(getBalance(addr), 2);
  }

  function getBalance(address addr) public constant returns (int) {
    return balances[addr];
  }

  function postQuestion(string content) public returns (bool) {
    numOfPosts += 1;
    posts[numOfPosts].content = content;
    posts[numOfPosts].createdBy = msg.sender;
    return true;
  }

  function getPost(uint postID) constant public returns (string content) {
    content = posts[postID].content;
  }

  function getLatestPost() constant public returns (string content) {
    content = posts[numOfPosts].content;
  }

  function getNumberOfPosts() constant public returns (uint) {
    return numOfPosts;
  }

  function likePost(uint postID) public returns (bool) {
    if (!posts[postID].isVoted[msg.sender]) {
      balances[posts[postID].createdBy] += 10;
      posts[postID].isVoted[msg.sender] = true;
      likes[postID] += 1;
    }

    return true;
  }

  function getLikes(uint postID) public constant returns (uint) {
    return likes[postID];
  }
}
