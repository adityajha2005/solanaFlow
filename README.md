<!-- GitAds-Verify: 6JAVXVFASO1DAK4412WUZBPRDBBPP9GW -->

# Solana Gasless SDK

Enable gasless transactions in your Solana dApp with one line of code. Let your users interact with your dApp without needing SOL or creating a wallet.

## Features

- 🚀 **Zero Gas Fees** - Users don't need SOL to transact
- 🔒 **No Private Keys** - Backend handles all signatures
- 🔐 **Built-in Firebase Authentication** - Google & GitHub sign-in ready to use
- 👤 **Automatic Wallet Creation** - No wallet setup needed for users
- 📜 **Transaction History** - Track all user transactions
- 🔄 **Auth State Management** - Real-time authentication state updates
- 💸 **Simple Integration** - Just 2 lines of code
- ⚡ **Fast Processing** - Transactions confirm quickly
- 🛡️ **Rate Limited** - Protected against abuse

## Installation

```bash
npm install solana-gasless-sdk
```

## Quick Start

```javascript
import { GaslessSDK } from 'solana-gasless-sdk';

// Initialize SDK with Firebase config
const sdk = new GaslessSDK({
    firebaseConfig: {
        apiKey: "your-api-key",
        authDomain: "your-auth-domain",
        projectId: "your-project-id",
        // ... other Firebase config
    }
});

// Authentication Methods
// 1. Sign in with Google
await sdk.signInWithGoogle();

// 2. Sign in with GitHub
await sdk.signInWithGithub();

// 3. Sign out
await sdk.signOut();

// 4. Get current user
const user = sdk.getCurrentUser();

// 5. Listen to auth state changes
sdk.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in');
    } else {
        console.log('User is signed out');
    }
});

// Get user's auto-generated wallet
const walletAddress = await sdk.getWallet();

// Send a gasless transaction
const result = await sdk.sendTransaction(
    'RECIPIENT_ADDRESS',
    GaslessSDK.solToLamports(0.1) // 0.1 SOL
);

if (result.success) {
    console.log('Transaction successful:', result.signature);
} else {
    console.error('Error:', result.error);
}

// Get transaction history
const transactions = await sdk.getTransactionHistory();
console.log('Transaction history:', transactions);
```

## How It Works

1. **Authentication** - User signs in using Google or GitHub
2. **Wallet Creation** - Backend automatically creates a wallet for the user
3. **Transaction Request** - Your dApp calls the SDK with recipient address and amount
4. **Relayer Processing** - Backend validates and processes the transaction
5. **Confirmation** - Transaction signature is returned to your dApp

```
User → Authentication → SDK → Relayer → Solana Network
                         ↓
                    Wallet Creation
                    Transaction History
```

## API Reference

### `new GaslessSDK(config)`

Initialize the SDK with required configuration.

```javascript
const sdk = new GaslessSDK({
    relayerUrl?: string, // Optional: Custom relayer URL
    firebaseConfig: {    // Required: Firebase configuration
        apiKey: string,
        authDomain: string,
        projectId: string,
        // ... other Firebase config options
    }
});
```

### Authentication Methods

```javascript
// Sign in with Google
const googleAuthResult = await sdk.signInWithGoogle();

// Sign in with GitHub
const githubAuthResult = await sdk.signInWithGithub();

// Sign out
await sdk.signOut();

// Get current user
const user = sdk.getCurrentUser();

// Listen to auth state changes
sdk.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
    } else {
        // User is signed out
    }
});
```

### Transaction Methods

```javascript
// Send transaction
const result = await sdk.sendTransaction(recipientAddress, lamports);
// Returns: { 
//     success: boolean, 
//     signature?: string, 
//     recipient?: string,
//     lamports?: number,
//     error?: string 
// }

// Get transaction history
const transactions = await sdk.getTransactionHistory();
// Returns: Array of transactions with details

// Get user's wallet
const walletAddress = await sdk.getWallet();
// Returns: string | null
```

### Utility Functions

```javascript
// Convert SOL to lamports
const lamports = GaslessSDK.solToLamports(1); // 1 SOL = 1000000000 lamports

// Convert lamports to SOL
const sol = GaslessSDK.lamportsToSol(1000000000); // 1 SOL
```

## Security Model

- ✅ Firebase Authentication for secure user management
- ✅ No private keys required from users
- ✅ All transactions signed by secure backend
- ✅ Rate limiting prevents abuse
- ✅ Input validation on all parameters
- ✅ Error handling for failed transactions
- ✅ Secure wallet creation and management

## Limitations

- Maximum transaction: 15 SOL per transfer
- Rate limit: 3 requests per wallet per 3 hours
- Only supports native SOL transfers (not tokens)
- Requires Firebase project setup

## Error Handling

```javascript
try {
    const result = await sdk.sendTransaction(address, lamports);
    if (!result.success) {
        switch(result.error) {
            case 'Too many requests':
                // Handle rate limit
                break;
            case 'Invalid recipient address':
                // Handle invalid address
                break;
            case 'User not authenticated':
                // Handle authentication error
                break;
            default:
                // Handle other errors
        }
    }
} catch (error) {
    // Handle network errors
}
```

## Complete Example with Authentication and Transactions

```javascript
import { GaslessSDK } from 'solana-gasless-sdk';

// Initialize SDK
const sdk = new GaslessSDK({
    firebaseConfig: {
        // Your Firebase config
    }
});

// Authentication and transaction flow
async function main() {
    try {
        // 1. Sign in user
        await sdk.signInWithGoogle();
        
        // 2. Get user's wallet
        const wallet = await sdk.getWallet();
        console.log('User wallet:', wallet);
        
        // 3. Send transaction
        const result = await sdk.sendTransaction(
            'RECIPIENT_ADDRESS',
            GaslessSDK.solToLamports(0.1)
        );
        
        if (result.success) {
            console.log('Transaction sent:', result.signature);
            
            // 4. Get updated transaction history
            const history = await sdk.getTransactionHistory();
            console.log('Updated history:', history);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Listen for auth state changes
sdk.onAuthStateChanged((user) => {
    if (user) {
        main();
    } else {
        console.log('User signed out');
    }
});
```

## React Integration Example

```javascript
import { useEffect, useState } from 'react';
import { GaslessSDK } from 'solana-gasless-sdk';

function App() {
    const [sdk] = useState(() => new GaslessSDK({
        firebaseConfig: {
            // Your Firebase config
        }
    }));
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const unsubscribe = sdk.onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                const wallet = await sdk.getWallet();
                setWallet(wallet);
                const history = await sdk.getTransactionHistory();
                setTransactions(history);
            }
        });

        return () => unsubscribe();
    }, [sdk]);

    const handleSignIn = () => sdk.signInWithGoogle();
    const handleSignOut = () => sdk.signOut();
    
    const handleSendTransaction = async (recipient, amount) => {
        const result = await sdk.sendTransaction(
            recipient,
            GaslessSDK.solToLamports(amount)
        );
        if (result.success) {
            const history = await sdk.getTransactionHistory();
            setTransactions(history);
        }
    };

    return (
        <div>
            {!user ? (
                <button onClick={handleSignIn}>Sign In</button>
            ) : (
                <>
                    <p>Wallet: {wallet}</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                    <TransactionForm onSubmit={handleSendTransaction} />
                    <TransactionHistory transactions={transactions} />
                </>
            )}
        </div>
    );
}
```

## Best Practices

1. **Always initialize with Firebase config**
```javascript
const sdk = new GaslessSDK({
    firebaseConfig: {
        // Required Firebase configuration
    }
});
```

2. **Handle authentication state**
```javascript
sdk.onAuthStateChanged((user) => {
    if (user) {
        // Initialize your app
    } else {
        // Clear user state
    }
});
```

3. **Check wallet availability**
```javascript
const wallet = await sdk.getWallet();
if (!wallet) {
    // Handle case where wallet is not available
}
```

4. **Monitor transaction history**
```javascript
const history = await sdk.getTransactionHistory();
// Update UI with latest transactions
```

5. **Implement proper error handling**
```javascript
try {
    const result = await sdk.sendTransaction(address, amount);
    if (!result.success) {
        // Handle specific error cases
    }
} catch (error) {
    // Handle unexpected errors
}
```

## Support

- GitHub Issues: [Report a bug](https://github.com/adityajha2005/solanaFlow/issues)
- X: [@adxtya_jha](https://x.com/adxtya_jha)
- Email: 2005akjha@email.com

## License

MIT License - feel free to use in your projects!

## GitAds Sponsored
[![Sponsored by GitAds](https://staging.gitads.dev/v1/ad-serve?source=adityajha2005/solanaflow@github)](https://staging.gitads.dev/v1/ad-track?source=adityajha2005/solanaflow@github)

