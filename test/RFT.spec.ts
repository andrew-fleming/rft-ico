import { ethers } from "hardhat";
import { expect, assert } from "chai";
import { Contract, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("RFT-ICO Contract", () => {

    let res: any;
    let expected: any;
    let rftContract: Contract;
    let daiContract: Contract;
    let nftContract: Contract;
    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let carol: SignerWithAddress;
    let dave: SignerWithAddress;

    const tokenId: number = 1;
    const sharePrice: BigNumber = ethers.utils.parseEther("50");
    const shareSupply: number = 125;

    const daiAmount: BigNumber = ethers.utils.parseEther("25000");

    before(async() => {
        const MockDai = await ethers.getContractFactory("MockDai");
        const MockNFT = await ethers.getContractFactory("MockNFT");
        const RFTContract = await ethers.getContractFactory("RFT");
        
        [owner, alice, bob, carol, dave] = await ethers.getSigners();

        daiContract = await MockDai.deploy();
        nftContract = await MockNFT.deploy("My NFT", "mNFT");
        await nftContract.mintNFT(owner.address, tokenId);

        const rftParams: Array <string | BigNumber | number> = [
            "NFT Shares",
            "nShare",
            nftContract.address,
            tokenId,
            sharePrice,
            shareSupply,
            daiContract.address
        ]

        // RFT Contract Deployment
        rftContract = await RFTContract.deploy(...rftParams)

        await Promise.all([
            daiContract.mint(alice.address, daiAmount),
            daiContract.mint(bob.address, daiAmount),
            daiContract.mint(carol.address, daiAmount),
            daiContract.mint(dave.address, daiAmount)
        ])
    })

    describe("Mocks Setup", async() => {
        it("should initialize mock contracts", async() => {
            expect(daiContract).to.be.ok
            expect(nftContract).to.be.ok
        })

        it("should print the mock contract names", async() => {
            expect(await daiContract.name()).to.equal("MockDai")
            expect(await nftContract.name()).to.equal("My NFT")
        })

        it("should show minted dai for all actors", async() =>{
            expected = ethers.utils.parseEther("25000")

            res = await daiContract.balanceOf(alice.address)
            expect(res.toString()).to.equal(expected)

            res = await daiContract.balanceOf(bob.address)
            expect(res.toString()).to.equal(expected)

            res = await daiContract.balanceOf(carol.address)
            expect(res.toString()).to.equal(expected)

            res = await daiContract.balanceOf(dave.address)
            expect(res.toString()).to.equal(expected)

        })
    })

    describe("RFT Contract Deployment Check", async() => {
        it("attributes should match deployment params", async() => {
            expect(await rftContract.icoShareSupply()).to.equal(shareSupply)
            expect(await rftContract.icoSharePrice()).to.equal(sharePrice)
            expect(await rftContract.tokenId()).to.equal(tokenId)
        })
    })


})