pragma solidity ^0.4.11;

import "./ConvertLib.sol";

contract MetaCoin {
  struct Post {
    uint id;
    string title;
    string content;
    uint timestamp;
    address createdBy;
  }

  struct Answer {
    uint postId;
    uint id;
    string content;
    address createdBy;
    uint timestamp;
  }

  uint numOfPosts;
  uint numOfAnswers;

  mapping (uint => Post) public posts;
  mapping (uint => Answer) public answers;
  mapping (address => int) balances;

  event Transfer(address indexed _from, address indexed _to, int256 _value);

  function MetaCoin() {
    numOfPosts = 0;
    numOfAnswers = 0;
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

  function getBalance(address addr) constant public returns (int) {
    return balances[addr];
  }

  function postQuestion(string title, string content) public returns (bool) {
    posts[numOfPosts].id = numOfPosts;
    posts[numOfPosts].title = title;
    posts[numOfPosts].content = content;
    posts[numOfPosts].timestamp = now;
    posts[numOfPosts].createdBy = msg.sender;
    numOfPosts++;
    return true;
  }

  function getPost(uint postID) constant public returns (string content, uint timestamp) {
    content = posts[postID].content;
    timestamp = posts[postID].timestamp;
  }

  function getLatestPost() constant public returns (string content, uint timestamp, uint numberOfPosts) {
    content = posts[numOfPosts - 1].content;
    timestamp = posts[numOfPosts - 1].timestamp;
    numberOfPosts = numOfPosts;
  }

  function getNumberOfPosts() constant public returns (uint num) {
    num = numOfPosts;
  }

  function postAnswer(uint postId, string answer) public returns (bool) {
    answers[numOfAnswers].id = numOfAnswers;
    answers[numOfAnswers].postId = postId;
    answers[numOfAnswers].content = answer;
    answers[numOfAnswers].createdBy = msg.sender;
    answers[numOfAnswers].timestamp = now;
    numOfAnswers++;
    return true;
  }
}
