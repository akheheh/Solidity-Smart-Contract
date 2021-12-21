//SPDX-License-Identifier: MIT

//Just a simple smart contract which can view and update a string

pragma solidity ^0.8.9;

contract BlockApp {
    string public str;

    constructor(string memory initialStr) {
        str = initialStr;
    }

    function updateStr(string memory newStr) public {
        str = newStr;
    }
}