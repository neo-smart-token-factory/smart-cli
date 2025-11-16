// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NeoSmartFactory is ERC721, Ownable {
    uint256 public constant PRICE = 0.05 ether; // Preço fixo
    uint256 public constant INITIAL_SUPPLY = 1;
    
    mapping(address => bool) public hasMinted;
    uint256 private _tokenIdCounter;

    constructor() ERC721("NeoSmartFactory", "NSF") {}

    function mint() external payable {
        require(msg.value == PRICE, "Must send fixed price");
        require(!hasMinted[msg.sender], "Already minted");
        
        hasMinted[msg.sender] = true;
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _mint(msg.sender, tokenId);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

