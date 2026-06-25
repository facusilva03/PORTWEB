# DNIPRO — DNI Profesional Web3

> *"La próxima vez que alguien dude de lo que sabemos, la respuesta no va a ser un papel. Va a ser la blockchain."*

**Hackathon — Teoría de la Computación II | Universidad Champagnat | Junio 2026**

---

## ¿Qué es DNIPRO?

DNIPRO es una plataforma de identidad profesional verificable construida sobre blockchain. Permite que instituciones autorizadas emitan **Soulbound Tokens (SBT)** — credenciales digitales imposibles de falsificar, imposibles de transferir, verificables por cualquier persona en el mundo en segundos.

No reemplazamos LinkedIn. Somos la **capa de confianza** que LinkedIn nunca tuvo.

---

## El problema

Abrí LinkedIn ahora mismo. Alguien que dice que sabe React, Python, Machine Learning y cinco idiomas. ¿Quién verifica eso? **Nadie.**

- Los CVs son declaraciones juradas que nadie jura
- Los certificados PDF se falsifican en minutos
- Los freelancers no tienen empleador formal que los certifique
- La experiencia en proyectos y hackathones no tiene validación objetiva

**El problema no es solo la mentira. Es que no existe ningún mecanismo que separe la verdad de la mentira.**

---

## La solución

Cada logro se convierte en un **Soulbound Token** grabado en blockchain:

| Categoría | Ejemplos |
|---|---|
| 🎓 Educación | Títulos, certificaciones, cursos, materias |
| 💼 Trabajo | Empleos, pasantías, freelance, contratos |
| 🚀 Proyectos | Hackathones, open source, investigación |
| 🤝 Impacto Social | Voluntariados, ONGs, eventos comunitarios |

---

## Demo

🎥 **[Ver video demo](https://drive.google.com/file/d/1WlYzO20KKEjww7kIaiya0UFSh9sxo_te/view?usp=sharing)** 

🔍 **Perfil de verificación demo:**
```
localhost:3000/verificar/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### Capturas del MVP

| Vista | Descripción |
|---|---|
| Pantalla de inicio | Hero con conexión de wallet |
| Mi Perfil | Credenciales agrupadas por categoría |
| Panel Emisor | Formulario de emisión on-chain |
| Vista Verificador | Perfil público sin wallet |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Smart Contract | Solidity 0.8.28 |
| Framework Blockchain | Hardhat 3.x |
| Librería Contratos | OpenZeppelin 5.x (ERC-721 SBT) |
| Red Blockchain | Hardhat Local / Polygon Amoy Testnet |
| Frontend | Next.js 16 + TypeScript |
| Estilos | TailwindCSS |
| Wallet Integration | wagmi + viem + MetaMask |
| Almacenamiento | IPFS (Pinata) |

---

## Arquitectura

```
dnipro/
├── contracts/                  ← Smart contracts (Hardhat)
│   ├── contracts/
│   │   └── CredentialRegistry.sol
│   ├── scripts/
│   │   ├── deploy.js
│   │   └── agregarEmisor.js
│   └── hardhat.config.js
├── frontend/                   ← Next.js App
│   ├── app/
│   │   ├── page.tsx            ← Página principal
│   │   ├── providers.tsx       ← WagmiProvider
│   │   ├── components/
│   │   │   ├── PanelPerfil.tsx
│   │   │   └── PanelEmisor.tsx
│   │   └── verificar/[address]/
│   │       └── page.tsx        ← Vista pública verificador
│   └── lib/
│       └── contract.ts         ← ABI + dirección del contrato
└── docs/
    ├── README.md
    ├── LEAN_CANVAS.md
    ├── MEMORIA_TECNICA.pdf
    └── PITCH_DECK.pdf
```

---

## Cómo correr el proyecto

### Requisitos
- Node.js v20+
- MetaMask instalado en el navegador

### 1. Clonar el repositorio
```bash
git clone https://github.com/facusilva03/PORTWEB.git
cd PORTWEB
```

### 2. Instalar dependencias del contrato
```bash
cd contracts
npm install
```

### 3. Levantar nodo local y desplegar
```bash
# Terminal 1 — nodo local
npx hardhat node

# Terminal 2 — deploy
npx hardhat run scripts/deploy.js --network localhost

# Autorizar emisor
npx hardhat run scripts/agregarEmisor.js --network localhost
```

### 4. Instalar y correr el frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 5. Abrir en el browser
```
http://localhost:3000
```

### Configurar MetaMask
| Campo | Valor |
|---|---|
| Nombre de red | Hardhat Local |
| URL RPC | http://127.0.0.1:8545 |
| Chain ID | 31337 |
| Símbolo | ETH |

**Cuenta de prueba** (10,000 ETH en red local):
```
Clave privada: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

---

## Contrato inteligente

El contrato `CredentialRegistry.sol` implementa:

- **ERC-721 Soulbound:** tokens no transferibles mediante override del hook `_update()` de OpenZeppelin v5
- **Multi-emisor:** solo emisores autorizados por el owner pueden mintear
- **4 categorías:** enum `TipoCredencial {Educacion, Trabajo, Proyecto, Impacto}`
- **Revocación no destructiva:** flag `revocada` preserva el historial on-chain
- **Eventos indexados:** `CredencialEmitida`, `CredencialRevocada`, `EmisorAgregado`

---

## Entregables

| Documento | Estado |
|---|---|
| ✅ README principal | Este archivo |
| ✅ Lean Canvas | `/docs/LEAN_CANVAS.md` |
| ✅ Memoria Técnica | `/docs/MEMORIA_TECNICA.pdf` |
| ✅ Pitch Deck | `/docs/PITCH_DECK.pdf` |
| ✅ Evidencias del MVP | `/docs/capturas/` |
| ✅ Video demo | *(agregar link)* |

---

## El equipo

| Integrante | Rol |
|---|---|
| **Facundo Silva** | Arquitectura · Backend · Smart Contract |
| **Iván Vargas** | Frontend · Integración · UX |
| **Nicolás Garín** | Testing · Deploy · Documentación |

**Universidad Champagnat — Junio 2026**

---

## Referencias

- Buterin, V. et al. (2022). *Decentralized Society: Finding Web3's Soul* — Paper original sobre SBTs
- [OpenZeppelin Contracts v5](https://docs.openzeppelin.com/contracts/5.x)
- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [Hardhat Documentation](https://hardhat.org/docs)
- [wagmi Documentation](https://wagmi.sh)
- [Polygon Amoy Testnet](https://polygon.technology)
