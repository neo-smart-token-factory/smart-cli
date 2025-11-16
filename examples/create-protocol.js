/**
 * Exemplo de uso da NΞØ SMART FACTORY
 * 
 * Este script demonstra como criar um protocolo completo usando a factory
 */

const { ethers } = require("hardhat");

async function main() {
  // Obter signers
  const [deployer, creator] = await ethers.getSigners();
  console.log("Criador:", creator.address);

  // Endereço da factory (ajustar após deploy)
  const FACTORY_ADDRESS = "0x..."; // Substituir pelo endereço deployado
  
  const factory = await ethers.getContractAt("NeoSmartFactory", FACTORY_ADDRESS);
  const creationFee = await factory.creationFee();
  
  console.log("\n🏭 NΞØ SMART FACTORY");
  console.log("Taxa de criação:", ethers.formatEther(creationFee), "ETH");

  // ============================================
  // EXEMPLO 1: Criar um Protocolo Completo
  // ============================================
  
  console.log("\n📦 Criando protocolo completo...");

  const tokenConfig = {
    name: "Meu Protocolo DeFi",
    symbol: "MPD",
    totalSupply: ethers.parseEther("1000000"), // 1M tokens
    decimals: 18,
    mintable: true,   // Permite criar mais tokens
    burnable: true,   // Permite queimar tokens
    pausable: false,  // Não pode pausar
  };

  // Configurar vestings para equipe e investidores
  const vestingConfigs = [
    {
      beneficiary: creator.address,
      totalAmount: ethers.parseEther("200000"), // 200K tokens
      startTime: Math.floor(Date.now() / 1000), // Agora
      duration: 365 * 24 * 60 * 60, // 1 ano
      cliff: 90 * 24 * 60 * 60, // 90 dias de cliff
      revocable: false,
    },
    {
      beneficiary: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", // Exemplo
      totalAmount: ethers.parseEther("100000"), // 100K tokens
      startTime: Math.floor(Date.now() / 1000),
      duration: 730 * 24 * 60 * 60, // 2 anos
      cliff: 180 * 24 * 60 * 60, // 6 meses de cliff
      revocable: true,
    },
  ];

  // Criar protocolo com sistema de recompensas habilitado
  const tx = await factory
    .connect(creator)
    .createProtocol(tokenConfig, vestingConfigs, true, {
      value: creationFee,
    });

  console.log("⏳ Aguardando confirmação...");
  const receipt = await tx.wait();

  // Obter protocol ID do evento
  const protocolCreatedEvent = receipt.logs.find(
    (log) => log.fragment?.name === "ProtocolCreated"
  );
  
  if (protocolCreatedEvent) {
    const protocolId = protocolCreatedEvent.args[0];
    console.log("✅ Protocolo criado! ID:", protocolId.toString());

    // Obter informações do protocolo
    const protocol = await factory.getProtocol(protocolId);
    
    console.log("\n📊 Informações do Protocolo:");
    console.log("  Nome:", protocol.name);
    console.log("  Símbolo:", protocol.symbol);
    console.log("  Token:", protocol.tokenAddress);
    console.log("  Vesting:", protocol.vestingAddress);
    console.log("  Recompensas:", protocol.rewardsAddress);
    console.log("  Criado em:", new Date(Number(protocol.createdAt) * 1000).toLocaleString());

    // ============================================
    // EXEMPLO 2: Interagir com o Token
    // ============================================
    
    const token = await ethers.getContractAt("NeoERC20", protocol.tokenAddress);
    const balance = await token.balanceOf(creator.address);
    console.log("\n💰 Saldo do criador:", ethers.formatEther(balance), "tokens");

    // ============================================
    // EXEMPLO 3: Interagir com o Vesting
    // ============================================
    
    if (protocol.vestingAddress !== ethers.ZeroAddress) {
      const vesting = await ethers.getContractAt("NeoVesting", protocol.vestingAddress);
      const schedules = await vesting.getBeneficiarySchedules(creator.address);
      
      console.log("\n🔒 Schedules de Vesting:", schedules.length);
      
      for (const scheduleId of schedules) {
        const releasable = await vesting.getReleasableAmount(scheduleId);
        console.log("  Schedule:", scheduleId);
        console.log("  Liberável:", ethers.formatEther(releasable), "tokens");
      }
    }

    // ============================================
    // EXEMPLO 4: Interagir com Recompensas
    // ============================================
    
    if (protocol.rewardsAddress !== ethers.ZeroAddress) {
      const rewards = await ethers.getContractAt("NeoRewards", protocol.rewardsAddress);
      
      // Criar badges
      console.log("\n🏅 Criando badges...");
      const badgeTx1 = await rewards
        .connect(creator)
        .createBadge(
          "Early Adopter",
          "Usuário que adotou o protocolo nos primeiros dias",
          "https://api.exemplo.com/badges/early-adopter.json"
        );
      await badgeTx1.wait();
      
      const badgeTx2 = await rewards
        .connect(creator)
        .createBadge(
          "Liquidity Provider",
          "Forneceu liquidez ao protocolo",
          "https://api.exemplo.com/badges/liquidity-provider.json"
        );
      await badgeTx2.wait();

      // Conceder badge
      const badgeId = 0; // Primeiro badge criado
      await rewards.connect(creator).awardBadge(creator.address, badgeId);
      console.log("✅ Badge concedido!");

      // Distribuir recompensa
      console.log("\n🎁 Distribuindo recompensa...");
      await rewards
        .connect(creator)
        .distributeReward(
          creator.address,
          ethers.parseEther("1000"),
          "Recompensa por ser early adopter"
        );
      console.log("✅ Recompensa distribuída!");
    }
  }

  // ============================================
  // EXEMPLO 5: Criar apenas um Token
  // ============================================
  
  console.log("\n\n🪙 Criando token simples...");
  
  const simpleTokenConfig = {
    name: "Token Simples",
    symbol: "SMP",
    totalSupply: ethers.parseEther("500000"),
    decimals: 18,
    mintable: false,
    burnable: true,
    pausable: false,
  };

  const tokenAddress = await factory
    .connect(creator)
    .createToken(simpleTokenConfig, { value: creationFee });
  
  console.log("✅ Token criado em:", tokenAddress);

  // ============================================
  // EXEMPLO 6: Criar uma Coleção NFT
  // ============================================
  
  console.log("\n\n🖼️  Criando coleção NFT...");
  
  const nftAddress = await factory
    .connect(creator)
    .createNFT(
      "Minha Coleção NFT",
      "MCN",
      "https://api.exemplo.com/nft/",
      true, // mintable
      { value: creationFee }
    );
  
  console.log("✅ NFT criado em:", nftAddress);

  // Interagir com o NFT
  const nft = await ethers.getContractAt("NeoERC721", nftAddress);
  
  // Mint alguns NFTs
  console.log("\n🎨 Mintando NFTs...");
  await nft.connect(creator).mint(
    creator.address,
    "https://api.exemplo.com/nft/1.json"
  );
  await nft.connect(creator).mint(
    creator.address,
    "https://api.exemplo.com/nft/2.json"
  );
  
  const totalSupply = await nft.totalSupply();
  console.log("✅ Total de NFTs mintados:", totalSupply.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

