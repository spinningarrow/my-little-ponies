pragma solidity ^0.4.11;

import "./ConvertLib.sol";

contract MetaCoin {
  struct Post {
    string title;
    string content;
    uint timestamp;
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

  mapping (uint => Post) posts;
  mapping (uint => Answer) answers;
  mapping (address => int) balances;

  event Transfer(address indexed _from, address indexed _to, int256 _value);
  event CreatePost(uint id);

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

  function getBalance(address addr) public constant returns (int) {
    return balances[addr];
  }

  function postQuestion(string title, string content) public returns (bool) {
    numOfPosts += 1;
    posts[numOfPosts].title = title;
    posts[numOfPosts].content = content;
    return true;
  }

  function getPost(uint postID) constant public returns (string content, uint timestamp) {
    content = posts[postID].content;
    timestamp = posts[postID].timestamp;
  }

  function getLatestPost() constant public returns (string content, uint timestamp, uint numberOfPosts) {
    content = posts[numOfPosts].content;
    timestamp = posts[numOfPosts].timestamp;
    numberOfPosts = numOfPosts;
  }

  function getNumberOfPosts() constant public returns (uint) {
    return numOfPosts;
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

  function chooseAnswer(uint postId, uint answerId) public returns (bool) {
    return true;
  }
}
