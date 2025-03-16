import { expect } from 'chai';
import hre from 'hardhat';
import { HelloWorld } from '../typechain-types';

const prepareDeploy = async (initialMessage: string): Promise<HelloWorld> => {
  const HelloWorldFactory = await hre.ethers.getContractFactory('HelloWorld');
  const helloWorld = await HelloWorldFactory.deploy(initialMessage);
  return helloWorld;
};

describe('HelloWorld', () => {
  it('should deploy with correct initial message', async () => {
    const initialMessage = 'lorem ipsum';
    const helloWorld = await prepareDeploy(initialMessage);

    expect(await helloWorld.message()).to.equal(initialMessage);
  });

  it('should update message correctly', async () => {
    const initialMessage = 'lorem ipsum';
    const helloWorld = await prepareDeploy(initialMessage);
    const newMessage = 'dolor sit amet';

    await helloWorld.setMessage(newMessage);

    expect(await helloWorld.message()).to.equal(newMessage);
  });
});
