pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockNFT is ERC721 {
    constructor(
        string memory name,
        string memory symbol
    ) ERC721 (
        name,
        symbol
    ) {}

    function mintNFT(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }


}