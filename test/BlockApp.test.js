//Local testing to ensure contract is actually working via mocha

//Import the assert module for testing ops
const assert = require('assert');
//Import Web3 module because wtf would you be doing without it for a blockchain app
const Web3 = require('web3');
//Use the ganache module to give us a local provider for web3
const ganache = require('ganache-cli');
//Import the application binary interface and bytecode to work with the blockchain
const {abi, evm} = require('../compile');

//Setup our web3 connection with the ganache provider
const web3 = new Web3(ganache.provider());

//Global variables for our contract and accounts
let contract, accounts;

//Setup for each assertion:
//set accounts to our play accounts, and our contract to our compiled binary
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    contract = await new web3.eth.Contract(abi)
    //Next, prepare our contract for deployment, with contract bytecode and first argument(s)
    .deploy({
        data: evm.bytecode.object,
        arguments: ['First Log']
    })
    //Finally, send it from our first account (the wallet) with a high gas limit
    .send({
        from: accounts[0],
        gas: '1000000'
    })
    //console.log(contract.methods);
});

//Describing our test assertions
describe('Contract Basics', () => {
    //Assertion to confirm contract deployment was valid
    it('has been deployed', () => {
        assert.ok(contract.options.address);
    })

    //Assertion to confirm intiial value of str variable is what we set it to
    it('can view string', async () => {
        const str = await contract.methods.str().call();
        assert.equal('First Log', str);
    });

    //Assertion to confirm updating function works and updates the string to the specified value
    it('can update string', async () => {
        const updateStr = await contract.methods.updateStr('Updated Log').send({
            from: accounts[0]
        });

        const str = await contract.methods.str().call();
        assert.equal('Updated Log', str);
    })
})