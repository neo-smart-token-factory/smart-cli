const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deployando contratos com a conta:", deployer.address);
  console.log("Saldo da conta:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  // Taxa de criação inicial (0.01 ETH)
  const creationFee = hre.ethers.parseEther("0.01");

  // Deploy do contrato principal
  const NeoSmartFactory = await hre.ethers.getContractFactory("NeoSmartFactory");
  const factory = await NeoSmartFactory.deploy(creationFee);

  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  console.log("\n✅ NeoSmartFactory deployado em:", factoryAddress);
  console.log("Taxa de criação configurada:", hre.ethers.formatEther(creationFee), "ETH");

  // Verificar deploy em redes de teste
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nAguardando confirmações antes de verificar...");
    await factory.deploymentTransaction().wait(5);

    try {
      await hre.run("verify:verify", {
        address: factoryAddress,
        constructorArguments: [creationFee],
      });
      console.log("✅ Contrato verificado no Etherscan");
    } catch (error) {
      console.log("❌ Erro na verificação:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

