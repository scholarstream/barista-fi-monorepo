import { expect } from 'chai';
import hre from 'hardhat';
import { BrewHouse } from '../typechain-types';

const prepareDeploy = async (initialMessage: string): Promise<BrewHouse> => {
  const BrewHouseFactory = await hre.ethers.getContractFactory('BrewHouse');
  const brewHouse = await BrewHouseFactory.deploy(initialMessage);
  return brewHouse;
};

describe('BrewHouse', () => {
  it('should deploy with correct initial message', async () => {
    const initialMessage = 'lorem ipsum';
    const brewHouse = await prepareDeploy(initialMessage);

    expect(await brewHouse.message()).to.equal(initialMessage);
  });

  it('should update message correctly', async () => {
    const initialMessage = 'lorem ipsum';
    const brewHouse = await prepareDeploy(initialMessage);
    const newMessage = 'dolor sit amet';

    await brewHouse.setMessage(newMessage);

    expect(await brewHouse.message()).to.equal(newMessage);
  });
});
