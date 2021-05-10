type DeployParams = Array<string | number>

const name: string = "Tokenized NFT";
const symbol: string = "tNFT";
const nftAddress: string = "0x60F80121C31A0d46B5279700f9DF786054aa5eE5";
const tokenId: number = 823623;
const icoSharePrice: number = 5;
const icoShareSupply: number = 100;
const daiAddress: string = "0x6b175474e89094c44da98b954eedeac495271d0f" // Mainnet

export const mainConfig: DeployParams = [
    name,
    symbol,
    nftAddress,
    tokenId,
    icoSharePrice,
    icoShareSupply,
    daiAddress
]