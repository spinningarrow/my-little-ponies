pragma solidity ^0.4.11;

library ConvertLib{
  function convert(int amount, int conversionRate) constant returns (int convertedAmount)
  {
    return amount * conversionRate;
  }
}
