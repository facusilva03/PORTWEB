import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("CredentialRegistry", function () {
  let owner: any, emisor: any, estudiante: any, otro: any;
  let registry: any;

  const URI = "ipfs://QmTest";
  const Tipo = { Educacion: 0n, Trabajo: 1n, Proyecto: 2n, Impacto: 3n };

  beforeEach(async function () {
    [owner, emisor, estudiante, otro] = await ethers.getSigners();
    registry = await ethers.deployContract("CredentialRegistry", [owner.address]);
  });

  // ── Despliegue ────────────────────────────────────────────────────────────

  describe("Despliegue", function () {
    it("asigna el owner correcto", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("nombre y símbolo correctos", async function () {
      expect(await registry.name()).to.equal("DNIProfesional");
      expect(await registry.symbol()).to.equal("DNIPRO");
    });
  });

  // ── Gestión de emisores ───────────────────────────────────────────────────

  describe("Gestión de emisores", function () {
    it("el owner puede agregar un emisor", async function () {
      await registry.agregarEmisor(emisor.address);
      expect(await registry.emisoresAutorizados(emisor.address)).to.be.true;
    });

    it("emite EmisorAgregado al agregar", async function () {
      await expect(registry.agregarEmisor(emisor.address))
        .to.emit(registry, "EmisorAgregado")
        .withArgs(emisor.address);
    });

    it("no-owner no puede agregar emisor", async function () {
      await expect(
        registry.connect(otro).agregarEmisor(emisor.address)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("el owner puede quitar un emisor", async function () {
      await registry.agregarEmisor(emisor.address);
      await registry.quitarEmisor(emisor.address);
      expect(await registry.emisoresAutorizados(emisor.address)).to.be.false;
    });

    it("emite EmisorQuitado al quitar", async function () {
      await registry.agregarEmisor(emisor.address);
      await expect(registry.quitarEmisor(emisor.address))
        .to.emit(registry, "EmisorQuitado")
        .withArgs(emisor.address);
    });

    it("no-owner no puede quitar emisor", async function () {
      await registry.agregarEmisor(emisor.address);
      await expect(
        registry.connect(otro).quitarEmisor(emisor.address)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });

  // ── emitirCredencial ──────────────────────────────────────────────────────

  describe("emitirCredencial", function () {
    beforeEach(async function () {
      await registry.agregarEmisor(emisor.address);
    });

    it("revierte si el emisor no está autorizado", async function () {
      await expect(
        registry.connect(otro).emitirCredencial(estudiante.address, URI, Tipo.Educacion)
      ).to.be.revertedWith("No autorizado como emisor");
    });

    it("revierte si la dirección del estudiante es cero", async function () {
      await expect(
        registry.connect(emisor).emitirCredencial(ethers.ZeroAddress, URI, Tipo.Educacion)
      ).to.be.revertedWith("Direccion invalida");
    });

    it("mintea el token al estudiante", async function () {
      await registry.connect(emisor).emitirCredencial(estudiante.address, URI, Tipo.Educacion);
      expect(await registry.ownerOf(0n)).to.equal(estudiante.address);
    });

    it("asigna el tokenURI", async function () {
      await registry.connect(emisor).emitirCredencial(estudiante.address, URI, Tipo.Educacion);
      expect(await registry.tokenURI(0n)).to.equal(URI);
    });

    it("almacena los datos de la credencial", async function () {
      await registry.connect(emisor).emitirCredencial(estudiante.address, URI, Tipo.Trabajo);
      const cred = await registry.credenciales(0n);
      expect(cred.emisor).to.equal(emisor.address);
      expect(cred.tipo).to.equal(Tipo.Trabajo);
      expect(cred.revocada).to.be.false;
    });

    it("emite CredencialEmitida", async function () {
      await expect(
        registry.connect(emisor).emitirCredencial(estudiante.address, URI, Tipo.Proyecto)
      )
        .to.emit(registry, "CredencialEmitida")
        .withArgs(estudiante.address, 0n, Tipo.Proyecto, URI);
    });

    it("incrementa el tokenId para el siguiente mint", async function () {
      await registry.connect(emisor).emitirCredencial(estudiante.address, URI, Tipo.Educacion);
      await registry.connect(emisor).emitirCredencial(estudiante.address, URI, Tipo.Trabajo);
      expect(await registry.ownerOf(1n)).to.equal(estudiante.address);
    });
  });

  // ── revocarCredencial ─────────────────────────────────────────────────────

  describe("revocarCredencial", function () {
    beforeEach(async function () {
      await registry.agregarEmisor(emisor.address);
      await registry.connect(emisor).emitirCredencial(estudiante.address, URI, Tipo.Educacion);
    });

    it("el emisor puede revocar", async function () {
      await registry.connect(emisor).revocarCredencial(0n);
      const cred = await registry.credenciales(0n);
      expect(cred.revocada).to.be.true;
    });

    it("emite CredencialRevocada", async function () {
      await expect(registry.connect(emisor).revocarCredencial(0n))
        .to.emit(registry, "CredencialRevocada")
        .withArgs(0n, emisor.address);
    });

    it("non-emisor no puede revocar", async function () {
      await expect(
        registry.connect(otro).revocarCredencial(0n)
      ).to.be.revertedWith("Solo el emisor puede revocar");
    });

    it("no se puede revocar dos veces", async function () {
      await registry.connect(emisor).revocarCredencial(0n);
      await expect(
        registry.connect(emisor).revocarCredencial(0n)
      ).to.be.revertedWith("Ya estaba revocada");
    });
  });

  // ── esValida ──────────────────────────────────────────────────────────────

  describe("esValida", function () {
    beforeEach(async function () {
      await registry.agregarEmisor(emisor.address);
      await registry.connect(emisor).emitirCredencial(estudiante.address, URI, Tipo.Educacion);
    });

    it("retorna true para credencial válida", async function () {
      expect(await registry.esValida(0n)).to.be.true;
    });

    it("retorna false tras revocar", async function () {
      await registry.connect(emisor).revocarCredencial(0n);
      expect(await registry.esValida(0n)).to.be.false;
    });
  });

  // ── Soulbound (intransferible) ────────────────────────────────────────────

  describe("Soulbound (intransferible)", function () {
    beforeEach(async function () {
      await registry.agregarEmisor(emisor.address);
      await registry.connect(emisor).emitirCredencial(estudiante.address, URI, Tipo.Educacion);
    });

    it("transferFrom revierte", async function () {
      await expect(
        registry.connect(estudiante).transferFrom(estudiante.address, otro.address, 0n)
      ).to.be.revertedWith("Las credenciales son intransferibles");
    });

    it("safeTransferFrom revierte", async function () {
      await expect(
        registry
          .connect(estudiante)
          ["safeTransferFrom(address,address,uint256)"](estudiante.address, otro.address, 0n)
      ).to.be.revertedWith("Las credenciales son intransferibles");
    });
  });
});
