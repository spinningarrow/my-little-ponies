pragma solidity ^0.4.11;

library ConvertLib{
  function convert(int amount, int conversionRate) returns (int convertedAmount)
  {
    return amount * conversionRate;
  }
}
