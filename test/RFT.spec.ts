import { ethers } from "hardhat";
import chai, { expect, assert } from "chai";
import { Contract, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { solidity } from "ethereum-waffle";

chai.use(solidity);

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
    const sharePrice: BigNumber = ethers.utils.parseEther("25");
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

    describe("Mock Contracts Setup", async() => {
        it("should initialize mock contracts", async() => {
            expect(daiContract).to.be.ok
            expect(nftContract).to.be.ok
        })

        it("should print the mock contract names", async() => {
            expect(await daiContract.name()).to.eq("MockDai")
            expect(await nftContract.name()).to.eq("My NFT")
        })

        it("should show icoEnd variable as zero", async() => {
            expect(await rftContract.icoEnd()).to.eq(0)
        })

        it("should show minted dai for all actors", async() =>{
            expected = ethers.utils.parseEther("25000")

            res = await daiContract.balanceOf(alice.address)
            expect(res.toString())
                .to.eq(expected)

            res = await daiContract.balanceOf(bob.address)
            expect(res.toString())
                .to.eq(expected)

            res = await daiContract.balanceOf(carol.address)
            expect(res.toString())
                .to.eq(expected)

            res = await daiContract.balanceOf(dave.address)
            expect(res.toString())
                .to.eq(expected)
        })

        it("attributes should match deployment params", async() => {
            expect(await rftContract.icoShareSupply())
                .to.eq(shareSupply)
            expect(await rftContract.icoSharePrice())
                .to.eq(sharePrice)
            expect(await rftContract.tokenId())
                .to.eq(tokenId)
        })
    })

    describe("RFT ICO", async() => {
        it("should start ICO", async() => {
            await nftContract.approve(rftContract.address, tokenId)
            expect(await rftContract.startIco())
                .to.be.ok
            
            expect(Number(await rftContract.icoEnd()))
                .to.be.greaterThan(0)
        })

        it("should mint share to investor", async() => {
            // Ensure supply starts at 0
            expect(await rftContract.totalSupply())
                .to.eq(0)

            // Approve and buy shares
            let shares = 1
            await daiContract.connect(alice).approve(rftContract.address, daiAmount)
            await rftContract.connect(alice).buyShares(shares)

            expect(await rftContract.totalSupply())
                .to.eq(shares)

            // Check alice's dai balance
            expect(await daiContract.balanceOf(alice.address))
                .to.eq(ethers.utils.parseEther("24975"))

            // Check alice's rft shares balance
            expect(await rftContract.balanceOf(alice.address))
                .to.eq(("1"))
        })

        it("should revert tx without allowance", async() => {
            let shares = 1
            await expect(rftContract.connect(bob).buyShares(shares))
                .to.be.revertedWith('transfer amount exceeds allowance');
        })

        it("should allow all investors to buy shares and subtract dai correctly", async() => {
            let shares1 = 15
            let expected1 = "24625"
            let shares2 = 6
            let expected2 = "24850"
            let shares3 = 40
            let expected3 = "24000"

            await daiContract.connect(bob).approve(rftContract.address, daiAmount)
            await daiContract.connect(carol).approve(rftContract.address, daiAmount)
            await daiContract.connect(dave).approve(rftContract.address, daiAmount)

            await rftContract.connect(bob).buyShares(shares1)
            await rftContract.connect(carol).buyShares(shares2)
            await rftContract.connect(dave).buyShares(shares3)

            expect(await daiContract.balanceOf(bob.address))
                .to.eq(ethers.utils.parseEther(expected1))

            expect(await daiContract.balanceOf(carol.address))
                .to.eq(ethers.utils.parseEther(expected2))

            expect(await daiContract.balanceOf(dave.address))
                .to.eq(ethers.utils.parseEther(expected3))
        })

        it("should account for all shares purchased by investors", async() => {
            expect(await rftContract.balanceOf(bob.address))
                .to.eq("15")

            expect(await rftContract.balanceOf(carol.address))
                .to.eq("6")

            expect(await rftContract.balanceOf(dave.address))
                .to.eq("40")
        })
    })




})