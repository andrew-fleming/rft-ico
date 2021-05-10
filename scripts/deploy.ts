import { ethers }  from "hardhat";
import { mainConfig } from "./config"

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`)

    const RFTContract = await ethers.getContractFactory("RFT");
    const rftContract = await RFTContract.deploy(...mainConfig)
    console.log(`Contract address: ${rftContract.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })