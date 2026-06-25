import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando con cuenta:", deployer.address);

  const CredentialRegistry = await ethers.getContractFactory("CredentialRegistry");
  const registry = await CredentialRegistry.deploy(deployer.address);
  await registry.waitForDeployment();

  console.log("CredentialRegistry desplegado en:", await registry.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
