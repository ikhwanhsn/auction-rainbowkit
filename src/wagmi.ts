import "@rainbow-me/rainbowkit/styles.css";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

// const goChainTestnet = {
//   id: 31337,
//   name: "GoChain Testnet",
//   iconUrl: "https://gochain.io/assets/img/favicon.ico",
//   iconBackground: "#fff",
//   nativeCurrency: { name: "GoChain", symbol: "GO", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://127.0.0.1:8545"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "GoChain Explorer",
//       url: "https://testnet-explorer.gochain.io/",
//     },
//   },
//   contracts: {
//     multicall3: {
//       address: "0xYourMulticall3ContractAddressHere",
//       blockCreated: 1_234_567,
//     },
//   },
// } as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "",
  chains: [mainnet, sepolia],
  ssr: true,
});
