import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    GithubAuthProvider,
    Auth,
    UserCredential
} from 'firebase/auth';
import { GaslessSDKConfig, TransactionResult, UserWallet, Transaction } from './types';

export class GaslessSDK {
    private relayerUrl: string;
    private firebaseApp: FirebaseApp;
    private auth: Auth;

    constructor(config: GaslessSDKConfig) {
        this.relayerUrl = config.relayerUrl || 'https://relayer-backend.onrender.com';
        this.firebaseApp = initializeApp(config.firebaseConfig);
        this.auth = getAuth(this.firebaseApp);
    }

    async signInWithGoogle(): Promise<UserCredential> {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    async signInWithGithub(): Promise<UserCredential> {
        const provider = new GithubAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    async signOut(): Promise<void> {
        return this.auth.signOut();
    }

    async getWallet(): Promise<string | null> {
        try {
            const token = await this.auth.currentUser?.getIdToken();
            if (!token) {
                throw new Error('User not authenticated');
            }

            const response = await axios.get(`${this.relayerUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data.publicKey;
        } catch (error: any) {
            console.error('Error getting wallet:', error);
            return null;
        }
    }

    async sendTransaction(recipientAddress: string, lamports: number): Promise<TransactionResult> {
        try {
            const token = await this.auth.currentUser?.getIdToken();
            if (!token) {
                throw new Error('User not authenticated');
            }

            const response = await axios.post(
                `${this.relayerUrl}/relay`,
                {
                    to: recipientAddress,
                    lamports
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            return {
                success: true,
                signature: response.data.signature,
                recipient: response.data.recipient,
                lamports: response.data.lamports
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    async getTransactionHistory(): Promise<Transaction[]> {
        try {
            const token = await this.auth.currentUser?.getIdToken();
            if (!token) {
                throw new Error('User not authenticated');
            }

            const response = await axios.get(`${this.relayerUrl}/transactions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data.transactions;
        } catch (error: any) {
            console.error('Error getting transaction history:', error);
            return [];
        }
    }

    static solToLamports(sol: number): number {
        return Math.floor(sol * 1e9);
    }

    static lamportsToSol(lamports: number): number {
        return lamports / 1e9;
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }

    onAuthStateChanged(callback: (user: any) => void) {
        return this.auth.onAuthStateChanged(callback);
    }
}
