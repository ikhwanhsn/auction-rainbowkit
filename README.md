# Auction DApp

![Auction DApp](https://your-image-url.com/preview.png)
_A simple decentralized auction platform built with Next.js, Solidity, Wagmi, and RainbowKit._

## 🚀 Features

- **Create Auctions** – Users can create new auctions for their items.
- **View Auction Details** – Users can explore active auctions with detailed information.
- **Place Bids** – Users can bid on auctions securely.
- **Withdraw Funds** – Auction owners and bidders can withdraw funds after auction completion.
- **Smart Contract Integration** – Powered by Solidity, Wagmi, and RainbowKit for seamless Web3 interactions.
- **Next.js & Tailwind CSS** – Fast, modern, and responsive UI/UX.

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS, TypeScript
- **Blockchain:** Solidity, Hardhat
- **Web3 Integration:** Wagmi, RainbowKit, Ethers.js
- **Backend:** -

## 📜 Smart Contract

The core functionality of the auction platform is handled by a Solidity smart contract deployed on an EVM-compatible blockchain.

### Key Functions:

- `createAuction(duration)`: Initializes a new auction.
- `bid()`: Allows users to place bids.
- `auctionEnd()`: Finalizes the auction and transfers the funds.
- `withdraw()`: Enables participants to withdraw their funds securely.

## 🎨 UI/UX Preview

![UI Preview](https://ibb.co.com/zHjtf77n)

## 📦 Installation & Setup

Clone the repository:

```sh
git clone https://github.com/ikhwanhsn/auction-rainbowkit
cd auction-rainbowkit
```

### Install Dependencies

```sh
yarn install  # or npm install
```

### Environment Variables

Create a `.env.local` file and add the following:

```env
NEXT_PUBLIC_REOWN_PROJECT_ID=your-reown-key
```

### Run Development Server

```sh
yarn dev  # or npm run dev
```

## 📖 How It Works

1. **Connect Wallet**: Users connect their wallets using RainbowKit.
2. **Create an Auction**: Sellers list their items by specifying details.
3. **Bid on Auctions**: Buyers place bids using cryptocurrency.
4. **Auction Completion**: When the timer ends, the highest bidder wins.
5. **Withdraw Funds**: Funds are securely withdrawn by auction participants.

## 🔥 Roadmap

- [ ] Multi-chain support
- [ ] Off-chain metadata storage (IPFS/Filecoin)
- [ ] Auction analytics dashboard
- [ ] Mobile-friendly optimizations

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a PR with improvements.

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.

---
