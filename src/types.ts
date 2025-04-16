export interface GaslessSDKConfig {
    relayerUrl?: string;
    firebaseConfig: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId?: string;
    };
}

export interface TransactionResult {
    success: boolean;
    signature?: string;
    recipient?: string;
    lamports?: number;
    error?: string;
}

export interface UserWallet {
    publicKey: string;
    transactions: Transaction[];
}

export interface Transaction {
    signature: string;
    recipient: string;
    lamports: number;
    timestamp: number;
} 