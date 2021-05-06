pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RFT is ERC20 {
    uint256 public icoSharePrice;
    uint256 public icoShareSupply;
    uint256 public icoEnd;

    uint256 public tokenId;
    IERC721 public nft;
    IERC20 public dai;

    address public admin;

    constructor(
        string memory _name,
        string memory _symbol,
        address _nftAddress,
        uint256 _tokenId,
        uint256 _icoSharePrice,
        uint256 _icoShareSupply,
        address _daiAddress 
    ) ERC20 (
        _name,
        _symbol
    ) {
        nft = IERC721(_nftAddress);
        tokenId = _tokenId;
        icoSharePrice = _icoSharePrice;
        icoShareSupply = _icoShareSupply;
        dai = IERC20(_daiAddress);
        admin = msg.sender;
    }

    function startIco() external {
        require(msg.sender == admin, "You are not the admin");
        nft.transferFrom(msg.sender, address(this), tokenId);
        icoEnd = block.timestamp + 7 * 86400; // *86400 = Seconds in a day
    }

    function buyShares(uint256 shareAmt) external {
        require(icoEnd > 0, "The ICO has not started");
        require(block.timestamp <= icoEnd, "The ICO ended already");
        require(totalSupply() + shareAmt <= icoShareSupply, "Not enough shares");
        uint daiAmount = shareAmt * icoSharePrice;
        dai.transferFrom(msg.sender, address(this), daiAmount);
        _mint(msg.sender, shareAmt);
    }

    function withdrawProfits() external {
        require(msg.sender == admin, "You are not the admin");
        require(block.timestamp > icoEnd, "The ICO has not finished yet");
        uint daiBal = dai.balanceOf(address(this));
        if(daiBal > 0){
            dai.transfer(admin, daiBal);
        }
        
        uint unsoldShares = icoShareSupply - totalSupply();
        if(unsoldShares > 0){
            _mint(admin, unsoldShares);
        }
    }

}