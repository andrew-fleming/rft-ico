import { ethers } from "hardhat";
import { expect, assert } from "chai";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("RFT-ICO Contract", () => {

    let res: any;
    let rftContract: Contract;
    let daiContract: Contract;
    let nftContract: Contract;
    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let carol: SignerWithAddress;
    let dave: SignerWithAddress;

    before(async() => {

        let config: object = {

        }

        const RFT = await ethers.getContractFactory("RFT");
        [owner, alice, bob, carol, dave] = await ethers.getSigners();
        const instance = await RFT.deploy()
    })
})