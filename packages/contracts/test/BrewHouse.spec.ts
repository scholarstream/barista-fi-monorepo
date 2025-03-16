import { expect } from 'chai';
import hre from 'hardhat';
import { BrewHouse, MockERC20 } from '../typechain-types';

const prepareDeploy = async (): Promise<{
  brewHouse: BrewHouse;
  assetToken: MockERC20;
}> => {
  const MockERC20Factory = await hre.ethers.getContractFactory('MockERC20');
  const assetToken = await MockERC20Factory.deploy('Test Token', 'TTK');

  const BrewHouseFactory = await hre.ethers.getContractFactory('BrewHouse');
  const brewHouse = await BrewHouseFactory.deploy(assetToken.getAddress());

  return { brewHouse, assetToken };
};

describe('BrewHouse', () => {
  it('should deploy with correct asset', async () => {
    const { brewHouse, assetToken } = await prepareDeploy();

    expect(await brewHouse.asset()).to.equal(await assetToken.getAddress());
    expect(await brewHouse.name()).to.equal('BrewHouse');
    expect(await brewHouse.symbol()).to.equal('BREW');
  });

  it('should allow deposits and track shares correctly', async () => {
    const [owner] = await hre.ethers.getSigners();
    const { brewHouse, assetToken } = await prepareDeploy();

    const depositAmount = hre.ethers.parseUnits('10', 18);

    await assetToken.mint(owner.address, depositAmount);
    await assetToken.approve(await brewHouse.getAddress(), depositAmount);

    // Track balances before deposit
    const initialVaultBalance = await assetToken.balanceOf(
      await brewHouse.getAddress(),
    );
    const initialUserBalance = await assetToken.balanceOf(owner.address);
    const initialTotalSupply = await brewHouse.totalSupply();

    await brewHouse.deposit(depositAmount, owner.address);

    // Track balances after deposit
    const finalVaultBalance = await assetToken.balanceOf(
      await brewHouse.getAddress(),
    );
    const finalUserBalance = await assetToken.balanceOf(owner.address);
    const finalTotalSupply = await brewHouse.totalSupply();
    const userShares = await brewHouse.balanceOf(owner.address);

    // Assertions
    expect(finalVaultBalance).to.equal(initialVaultBalance + depositAmount);
    expect(finalUserBalance).to.equal(initialUserBalance - depositAmount);
    expect(finalTotalSupply).to.equal(initialTotalSupply + depositAmount);
    expect(userShares).to.equal(depositAmount);
  });

  it('should allow withdrawals and track shares correctly', async () => {
    const [owner] = await hre.ethers.getSigners();
    const { brewHouse, assetToken } = await prepareDeploy();

    const depositAmount = hre.ethers.parseUnits('10', 18);

    await assetToken.mint(owner.address, depositAmount);
    await assetToken.approve(await brewHouse.getAddress(), depositAmount);
    await brewHouse.deposit(depositAmount, owner.address);

    // Track balances before withdrawal
    const initialVaultBalance = await assetToken.balanceOf(
      await brewHouse.getAddress(),
    );
    const initialUserBalance = await assetToken.balanceOf(owner.address);
    const initialTotalSupply = await brewHouse.totalSupply();
    const initialUserShares = await brewHouse.balanceOf(owner.address);

    await brewHouse.withdraw(depositAmount, owner.address, owner.address);

    // Track balances after withdrawal
    const finalVaultBalance = await assetToken.balanceOf(
      await brewHouse.getAddress(),
    );
    const finalUserBalance = await assetToken.balanceOf(owner.address);
    const finalTotalSupply = await brewHouse.totalSupply();
    const finalUserShares = await brewHouse.balanceOf(owner.address);

    // Assertions
    expect(finalVaultBalance).to.equal(initialVaultBalance - depositAmount);
    expect(finalUserBalance).to.equal(initialUserBalance + depositAmount);
    expect(finalTotalSupply).to.equal(initialTotalSupply - depositAmount);
    expect(finalUserShares).to.equal(0);
  });

  it('should correctly convert assets to shares and vice versa', async () => {
    const { brewHouse, assetToken } = await prepareDeploy();
    const depositAmount = hre.ethers.parseUnits('10', 18);

    expect(await brewHouse.convertToShares(depositAmount)).to.equal(
      depositAmount,
    );
    expect(await brewHouse.convertToAssets(depositAmount)).to.equal(
      depositAmount,
    );
  });
});
