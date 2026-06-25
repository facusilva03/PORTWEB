import hre from "hardhat";

async function main() {
  const network = await hre.network.connect();
  const [deployer] = await network.ethers.getSigners();

  const contrato = await network.ethers.getContractAt(
    "CredentialRegistry",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    deployer
  );

  const tx = await contrato.agregarEmisor("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  await tx.wait();

  console.log("✅ Emisor autorizado: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
}

main().catch(console.error);