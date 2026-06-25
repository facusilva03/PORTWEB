export const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const CONTRACT_ABI = [
  {
    name: "emitirCredencial",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "estudiante", type: "address" },
      { name: "uri", type: "string" },
      { name: "tipo", type: "uint8" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "agregarEmisor",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "emisor", type: "address" }],
    outputs: [],
  },
  {
    name: "esValida",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "credenciales",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "emisor", type: "address" },
      { name: "tipo", type: "uint8" },
      { name: "emitidaEn", type: "uint256" },
      { name: "revocada", type: "bool" },
    ],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "CredencialEmitida",
    type: "event",
    inputs: [
      { name: "estudiante", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "tipo", type: "uint8", indexed: false },
      { name: "uri", type: "string", indexed: false },
    ],
  },
] as const;

export const TIPOS_CREDENCIAL = ["Educación", "Trabajo", "Proyecto", "Impacto Social"] as const;