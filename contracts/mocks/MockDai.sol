pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockDai is ERC20 {
    constructor() ERC20("MockDai", "mDAI") {}

    function mint(address to, uint256 amt) external {
        _mint(to, amt);
    }
}