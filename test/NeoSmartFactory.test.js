const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NeoSmartFactory", function () {
  let factory;
  let owner;
  let user1;
  let user2;
  const creationFee = ethers.parseEther("0.01");

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const NeoSmartFactory = await ethers.getContractFactory("NeoSmartFactory");
    factory = await NeoSmartFactory.deploy(creationFee);
    await factory.waitForDeployment();
  });

  describe("Deploy", function () {
    it("Deve fazer deploy com taxa de criação correta", async function () {
      expect(await factory.creationFee()).to.equal(creationFee);
    });

    it("Deve definir o owner como criador autorizado", async function () {
      expect(await factory.authorizedCreators(owner.address)).to.be.true;
    });
  });

  describe("Criação de Token", function () {
    it("Deve criar um token ERC20", async function () {
      const tokenConfig = {
        name: "Test Token",
        symbol: "TST",
        totalSupply: ethers.parseEther("1000000"),
        decimals: 18,
        mintable: true,
        burnable: true,
        pausable: false,
      };

      await expect(
        factory.connect(user1).createToken(tokenConfig, { value: creationFee })
      )
        .to.emit(factory, "TokenCreated")
        .withArgs(
          (protocolId) => protocolId !== undefined,
          (tokenAddress) => tokenAddress !== ethers.ZeroAddress,
          tokenConfig.name,
          tokenConfig.symbol
        );
    });

    it("Deve rejeitar criação sem taxa suficiente", async function () {
      const tokenConfig = {
        name: "Test Token",
        symbol: "TST",
        totalSupply: ethers.parseEther("1000000"),
        decimals: 18,
        mintable: false,
        burnable: false,
        pausable: false,
      };

      await expect(
        factory.connect(user1).createToken(tokenConfig, { value: ethers.parseEther("0.001") })
      ).to.be.revertedWith("Insufficient fee");
    });
  });

  describe("Criação de Protocolo Completo", function () {
    it("Deve criar um protocolo completo com token, vesting e recompensas", async function () {
      const tokenConfig = {
        name: "Complete Protocol",
        symbol: "CPT",
        totalSupply: ethers.parseEther("1000000"),
        decimals: 18,
        mintable: true,
        burnable: true,
        pausable: false,
      };

      const vestingConfigs = [
        {
          beneficiary: user1.address,
          totalAmount: ethers.parseEther("200000"),
          startTime: Math.floor(Date.now() / 1000),
          duration: 365 * 24 * 60 * 60, // 1 ano
          cliff: 90 * 24 * 60 * 60, // 90 dias
          revocable: false,
        },
      ];

      const tx = await factory
        .connect(user1)
        .createProtocol(tokenConfig, vestingConfigs, true, {
          value: creationFee,
        });

      const receipt = await tx.wait();
      
      // Verificar eventos
      const protocolCreatedEvent = receipt.logs.find(
        (log) => log.eventName === "ProtocolCreated"
      );
      expect(protocolCreatedEvent).to.not.be.undefined;

      const protocolId = await factory.protocolCounter() - 1n;
      const protocol = await factory.getProtocol(protocolId);
      
      expect(protocol.creator).to.equal(user1.address);
      expect(protocol.name).to.equal(tokenConfig.name);
      expect(protocol.tokenAddress).to.not.equal(ethers.ZeroAddress);
      expect(protocol.vestingAddress).to.not.equal(ethers.ZeroAddress);
      expect(protocol.rewardsAddress).to.not.equal(ethers.ZeroAddress);
      expect(protocol.active).to.be.true;
    });
  });

  describe("Criação de NFT", function () {
    it("Deve criar uma coleção NFT", async function () {
      const tx = await factory.connect(user1).createNFT(
        "Test Collection",
        "TSTC",
        "https://api.example.com/metadata/",
        true,
        { value: creationFee }
      );

      await expect(tx).to.not.be.reverted;
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });
  });

  describe("Gerenciamento", function () {
    it("Deve permitir owner atualizar taxa de criação", async function () {
      const newFee = ethers.parseEther("0.02");
      await factory.setCreationFee(newFee);
      expect(await factory.creationFee()).to.equal(newFee);
    });

    it("Deve permitir owner autorizar criadores", async function () {
      await factory.authorizeCreator(user1.address);
      expect(await factory.authorizedCreators(user1.address)).to.be.true;
    });

    it("Deve permitir owner retirar fundos", async function () {
      // Criar um token para acumular taxa
      const tokenConfig = {
        name: "Test Token",
        symbol: "TST",
        totalSupply: ethers.parseEther("1000000"),
        decimals: 18,
        mintable: false,
        burnable: false,
        pausable: false,
      };

      await factory.connect(user1).createToken(tokenConfig, { value: creationFee });

      const balanceBefore = await ethers.provider.getBalance(owner.address);
      const tx = await factory.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter).to.be.gt(balanceBefore - gasUsed);
    });
  });
});

