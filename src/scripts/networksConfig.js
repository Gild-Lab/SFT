const networks = [
    {
        id: 1,
        chainId: 1,
        name: 'ethereum',
        displayName: "Ethereum mainnet",
        currencySymbol: "ETH",
        blockExplorer: "https://etherscan.io",
        blockExplorerIcon: "etherscan",
        rpcUrl: "https://mainnet.infura.io/v3/",
        icon: 'ethereum',
        factory_address: '0x924D747B95CCdc82D4f4E15F04e69f4Eb1FB39D9',
        subgraph_url: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/sft-offchainassetvault-ethereum/1.0.0/gn"
    },
    {
        id: 11155111,
        chainId: 11155111,
        name: 'eth_sepolia',
        displayName: "Ethereum Sepolia",
        currencySymbol: "ETHSepolia",
        blockExplorer: "https://sepolia.arbiscan.io/",
        blockExplorerIcon: "etherscan",
        rpcUrl: "https://sepolia.infura.io/v3/",
        icon: 'ethereum',
        factory_address: '0xD13c3B470989C3666A7b4994951582bA101C1EF8',
        subgraph_url: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/sft-offchainassetvault-ethereum-sepolia/1.0.0/gn"
    },
    {
        id: 137,
        chainId: 137,
        name: 'polygon',
        displayName: "Polygon",
        currencySymbol: "MATIC",
        blockExplorer: "https://polygonscan.com",
        blockExplorerIcon: "polygonscan",
        rpcUrl: "https://polygon-rpc.com",
        icon: 'polygon',
        factory_address: '0xFE259001e141A41f3bcCDBc315A8F0D23Ef84b0b',
        subgraph_url: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/sft-offchainassetvault-polygon/1.0.0/gn"
    },
    {
        id: 42161,
        chainId: 42161,
        name: 'atbitrum',
        displayName: "Arbitrum one",
        currencySymbol: "ETH",
        blockExplorer: "https://arbiscan.io/",
        blockExplorerIcon: "arbitrum",
        rpcUrl: "https://arb1.arbitrum.io/rpc",
        icon: 'arbitrum',
        factory_address: '0xdf3f47707a27Ec838d7691dfB7a02a795eE554D5',
        subgraph_url: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/sft-offchainassetvault-arbitrum-one/1.0.0/gn"
    },
    {
        id: 421614,
        chainId: 421614,
        name: 'sepolia',
        displayName: "Arbitrum sepolia",
        currencySymbol: "ETH",
        blockExplorer: "https://sepolia.arbiscan.io/",
        blockExplorerIcon: "arbitrum",
        rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
        icon: 'arbitrum',
        factory_address: '0xf1A14e96977E8dE295Ba9612691D127B157d1371',
        subgraph_url: "https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/sft-offchainassetvault-arbitrum-sepolia/1.0.0/gn",
    }
];

export default networks;
