// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CredentialRegistry
 * @dev Soulbound Tokens para el DNI Profesional Web3.
 *      Los tokens son intransferibles y representan logros verificados.
 */
contract CredentialRegistry is ERC721URIStorage, Ownable {

    enum TipoCredencial { Educacion, Trabajo, Proyecto, Impacto }

    struct Credencial {
        address emisor;
        TipoCredencial tipo;
        uint256 emitidaEn;
        bool revocada;
    }

    uint256 private _nextTokenId;

    mapping(uint256 => Credencial) public credenciales;
    mapping(address => bool) public emisoresAutorizados;

    event CredencialEmitida(
        address indexed estudiante,
        uint256 indexed tokenId,
        TipoCredencial tipo,
        string uri
    );
    event CredencialRevocada(uint256 indexed tokenId, address indexed emisor);
    event EmisorAgregado(address indexed emisor);
    event EmisorQuitado(address indexed emisor);

    constructor(address duenioInicial)
        ERC721("DNIProfesional", "DNIPRO")
        Ownable(duenioInicial)
    {}

    // ── Gestión de emisores ──────────────────────────────────────────────────

    function agregarEmisor(address emisor) external onlyOwner {
        emisoresAutorizados[emisor] = true;
        emit EmisorAgregado(emisor);
    }

    function quitarEmisor(address emisor) external onlyOwner {
        emisoresAutorizados[emisor] = false;
        emit EmisorQuitado(emisor);
    }

    // ── Emisión de credenciales ──────────────────────────────────────────────

    function emitirCredencial(
        address estudiante,
        string memory uri,
        TipoCredencial tipo
    ) external returns (uint256) {
        require(emisoresAutorizados[msg.sender], "No autorizado como emisor");
        require(estudiante != address(0), "Direccion invalida");

        uint256 tokenId = _nextTokenId++;
        _safeMint(estudiante, tokenId);
        _setTokenURI(tokenId, uri);

        credenciales[tokenId] = Credencial({
            emisor: msg.sender,
            tipo: tipo,
            emitidaEn: block.timestamp,
            revocada: false
        });

        emit CredencialEmitida(estudiante, tokenId, tipo, uri);
        return tokenId;
    }

    // ── Revocación ───────────────────────────────────────────────────────────

    function revocarCredencial(uint256 tokenId) external {
        require(
            credenciales[tokenId].emisor == msg.sender,
            "Solo el emisor puede revocar"
        );
        require(!credenciales[tokenId].revocada, "Ya estaba revocada");
        credenciales[tokenId].revocada = true;
        emit CredencialRevocada(tokenId, msg.sender);
    }

    // ── Consultas ────────────────────────────────────────────────────────────

    function esValida(uint256 tokenId) external view returns (bool) {
        return !credenciales[tokenId].revocada && _ownerOf(tokenId) != address(0);
    }

    // ── Soulbound: bloqueo de transferencias ─────────────────────────────────

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert("Las credenciales son intransferibles");
        }
        return super._update(to, tokenId, auth);
    }
}