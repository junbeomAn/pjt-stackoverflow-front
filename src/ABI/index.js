export default  
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "_key",
				"type": "string"
			}
		],
		"name": "dealBreak",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_key",
				"type": "string"
			}
		],
		"name": "setQuestion",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_key",
				"type": "string"
			},
			{
				"name": "_recipient",
				"type": "address"
			}
		],
		"name": "setRecipientAndDealConclusion",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_key",
				"type": "string"
			}
		],
		"name": "getQuestion",
		"outputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]