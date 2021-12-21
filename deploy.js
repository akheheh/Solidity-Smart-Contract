//Import web3 as usual
const Web3 = require('web3');
//Impor the truffle/wallet module to create a provider
const HDWalletProvider = require('@truffle/hdwallet-provider');
//Impor the bytecode and ABI of our contract
const {abi, evm} = require('./compile');

//Rinkeby endpoint and mnemonic for the wallet
const endpoint = 'https://rinkeby.infura.io/v3/edef01464e4c42c9b193bdc873fad36a';
const mnemonic = 'rebuild crane wet boat purity concert jacket short cave timber judge shine';

//Creating our provider
const provider = new HDWalletProvider(mnemonic, endpoint);

//New instance of web3
const web3 = new Web3(provider);

//Wrapping it all in an IIFE to have access to await
(async () => {
    //Get our accounts 
    const accounts = await web3.eth.getAccounts();
    //First account corresponds with our wallet address
    console.log(`Deploying from ${accounts[0]}`);

    //Create contract from abi
    const contract = await new web3.eth.Contract(abi)
    //Prepare contract for deployment
    .deploy({
        data: evm.bytecode.object,
        arguments: ["Contract deployment initialized"]
    })
    //Deploy contract to blockchain from wallet, with specificed gas limit
    .send({
        from: accounts[0],
        gas: '1000000'
    });

    console.log(`Contract deployed to ${contract.options.address}`);

    //Using methods of contract
    //Viewer will log our string variable
    let viewer = await contract.methods.str().call();
    //Log will be the initial value we sent to the blockchain
    console.log(viewer);

    //Now let's update the string with the contract's updateStr() method
    //Since this function is a transaction, we have to send (not call) it, with our updated value
    const updateStr = await contract.methods.updateStr("String updated").send({
        from: accounts[0]
    });

    //Next, call the str() function again with the updated value
    viewer = await contract.methods.str().call();
    console.log(viewer);
})();