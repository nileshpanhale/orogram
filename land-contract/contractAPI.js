const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
const ETx = require('ethereumjs-tx').Transaction;
const Common = require('@ethereumjs/common').default;
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9001'));

/**
 * @dev deployed contract address and ABI on network
 */
const contractAddr = '0x7A5e7Afe2bB7fc5ca3f9B234B1e34e0420993aFa';
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_id",
          "type": "string"
        }
      ],
      "name": "safeMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "landDetails",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "mongoId",
              "type": "string"
            }
          ],
          "internalType": "struct LandNFT.landNFT",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "balOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "deleteNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

/**
 * @dev account address and private key from which we deploy smart contract
 */
const owner = "0xa1AC6ae647Bdd7F67208D156b86262405b307BFb";
let pvt = "62d4e27275b5410634a291ee16a431a77d04027ade935767689d54b7eb799c31";
pvt = Buffer.from(pvt, 'hex');

/**
 * @dev deployed contract instance
 */
const contract = new web3.eth.Contract(contractABI, contractAddr, { from: owner });
const common = Common.custom({ chainId: 2023 });


/**
 * @dev returns Account authority as a minter
 */

async function checkBal(account) {

  let bal = await contract.methods.balanceOf(account).call();
  bal = Math.trunc(bal);
  bal = bal / (10 ** 8);
  return bal;

};

/**
 * Token mint function call
 */
async function mintNFT(receiver, mongoID) {
    
    let nonce = await web3.eth.getTransactionCount(owner, 'pending');
    const mintFunction = contract.methods.safeMint(receiver, mongoID).encodeABI();
    const NetworkId = await web3.eth.net.getId();
    
    /**
    * Raw_transaction instance to specify all parameters for ethereumjs-tx Transation
    */
    const rawTx = {
        "from": owner,
        "to": contractAddr,
        "data": mintFunction,
        "nonce": nonce,
        "value": "0x00000000000000",
        "gasLimit": web3.utils.toHex(210000),
        "gasPrice": 00,
        "chainId": NetworkId
    };

    /**
     * @dev initiate transaction with Raw_trasansaction instance for ethereumjs-tx Transaction
     */
    let transaction = new ETx(rawTx, { common });

    /**
     * @dev sign the transaction with private key to change blockchain status
     */
    // pvt = Buffer.from(pvt, 'hex')
    transaction.sign(pvt);
    
    /**
     * @dev send the signed transaction to smart contract
     */
    return await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    // web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, hash) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         console.log("Mint Transaction Hash : " + hash);
    //         console.log("=========================");
    //         console.log("Land NFT minting successful.");
    //         return hash;
    //     }
    // });
};

/**
 * @dev Token transfer function call returns transaction hash
 * @param sender is the transaction initiator who send tokens to receiver
 * @param pvtKey is sender accounts private key used to sign the transaction initiated by sender
 * @param receiver is the token receivers public key
 * @param amt is the token value to be sent to receiver
 * @returns successful transaction hash or an error if any
 */
async function Transfer(sender, pvtKey, receiver, amt) {

    let nonce = await web3.eth.getTransactionCount(sender, 'pending');
    amt = Math.trunc(amt * 10 ** 8);
    const amount = web3.utils.toHex(amt);
    const transferFunction = contract.methods.transfer(receiver, amount).encodeABI();
    const NetworkId = await web3.eth.net.getId();
    
    /**
    * Raw_transaction instance to specify all parameters for ethereumjs-tx Transation
    */
    const rawTx = {
        "from": sender,
        "to": contractAddr,
        "data": transferFunction,
        "nonce": nonce,
        "value": "0x00000000000000",
        "gasLimit": web3.utils.toHex(210000),
        "gasPrice": 00,
        "chainId": NetworkId
    };

    /**
     * @dev initiate transaction with Raw_trasansaction instance for ethereumjs-tx Transaction
     */
    let transaction = new ETx(rawTx, { common });

    /**
     * @dev sign the transaction with private key to change blockchain status
     */
    const pvt = Buffer.from(pvtKey, 'hex');
    transaction.sign(pvt);

    /**
    * @dev send the signed transaction to smart contract
    */
    return await web3.eth.sendSignedTransaction("0x" + transaction.serialize().toString('hex'));
  
};

/**
 * exports all functions
 */
module.exports = { mintNFT, Transfer, checkBal };