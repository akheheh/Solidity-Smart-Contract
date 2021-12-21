//We'll need the path and fs libraries to locate and read our contract, and solc to compile it.
const path = require('path');
const fs = require('fs');
const solc = require('solc');

//Get the contract path, using resolve instead of join
const contractPath = path.resolve(__dirname, 'contracts', 'BlockApp.sol');

//get filestream
const source = fs.readFileSync(contractPath, 'utf-8');

//set the config which we will compile into our exportable contract 
const config = {
    language: 'Solidity',
    sources: {
        'BlockApp.sol': {
            content: source
        }
    },

    settings: {
        outputSelection: {
            //Ensure everything possible is actually exported
            '*': {
                '*': ['*']
            }
        }
    }
};

//Compile the config to a JSON representation of our contract
const compiled = solc.compile(JSON.stringify(config));

//Then conver it to a JS object
const contract = JSON.parse(compiled).contracts["BlockApp.sol"].BlockApp;

//log for debugging
//console.log(contract);

//Export contract
module.exports = contract;