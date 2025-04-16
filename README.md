<!-- GitAds-Verify: 6JAVXVFASO1DAK4412WUZBPRDBBPP9GW -->
# Solana Gasless SDK

Enable gasless transactions in your Solana dApp with one line of code. Let your users interact with your dApp without needing SOL or creating a wallet.

## Features

- 🚀 **Zero Gas Fees** - Users don't need SOL to transact
- 🔒 **No Private Keys** - Backend handles all signatures
- 🔐 **Built-in Firebase Authentication** - Google & GitHub sign-in ready to use
- 👤 **Automatic Wallet Creation** - No wallet setup needed for users
- 💸 **Simple Integration** - Just 2 lines of code
- ⚡ **Fast Processing** - Transactions confirm quickly
- 🛡️ **Rate Limited** - Protected against abuse

## Installation

```bash
npm install solanaFlow
```

## Quick Start

```javascript
import { GaslessSDK } from 'solana-gasless-sdk';

// Initialize SDK - that's it! No configuration needed!
const sdk = new GaslessSDK();

// Sign in user with built-in authentication
await sdk.signInWithGoogle(); // or signInWithGithub()

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
```

## How It Works

1. **Your dApp** calls the SDK with recipient address and amount
2. **SDK** sends request to our secure relayer service
3. **Relayer** (backend) processes and pays for the transaction
4. **Transaction signature** is returned to your dApp

```
Your dApp → SDK → Relayer → Solana Network
                     ↓
                Private Key
                (Managed by Relayer)
```

## API Reference

### `new GaslessSDK(config?)`

Initialize the SDK.

```javascript
const sdk = new GaslessSDK({
    relayerUrl?: string, // Optional: Custom relayer URL
    firebaseConfig?: object // Optional: Firebase configuration
});
```

### `sendTransaction(recipientAddress: string, lamports: number)`

Send a gasless transaction.

```javascript
const result = await sdk.sendTransaction(address, lamports);
// Returns: { success: boolean, signature?: string, error?: string }
```

### `signInWithGoogle()`

Sign in user with Google.

```javascript
await sdk.signInWithGoogle();
```

### `signInWithGithub()`

Sign in user with GitHub.

```javascript
await sdk.signInWithGithub();
```

### `getWallet()`

Get user's auto-generated wallet address.

```javascript
const walletAddress = await sdk.getWallet();
```

### Utility Functions

```javascript
// Convert SOL to lamports
const lamports = GaslessSDK.solToLamports(1); // 1 SOL = 1000000000 lamports

// Convert lamports to SOL
const sol = GaslessSDK.lamportsToSol(1000000000); // 1 SOL
```

## Security Model

- ✅ No private keys required from users
- ✅ All transactions signed by secure backend
- ✅ Rate limiting prevents abuse
- ✅ Input validation on all parameters
- ✅ Error handling for failed transactions

## Limitations

- Maximum transaction: 15 SOL per transfer
- Rate limit: 3 requests per wallet per 3 hours
- Only supports native SOL transfers (not tokens)

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
            default:
                // Handle other errors
        }
    }
} catch (error) {
    // Handle network errors
}
```

## Best Practices

1. **Always check success**
```javascript
if (result.success) {
    // Process success
} else {
    // Handle error
}
```

2. **Use utility functions**
```javascript
// Good
const lamports = GaslessSDK.solToLamports(0.1);

// Not recommended
const lamports = 100000000; // Hard to verify amount
```

3. **Handle rate limits**
```javascript
// Inform users about remaining requests
if (result.error === 'Too many requests') {
    alert('Please try again in 3 hours');
}
```

## Examples

### React Example
```javascript
function SendButton() {
    const handleSend = async () => {
        const sdk = new GaslessSDK();
        const result = await sdk.sendTransaction(
            'Address',
            GaslessSDK.solToLamports(0.1)
        );
        
        if (result.success) {
            console.log(`Sent! Signature: ${result.signature}`);
        }
    };

    return <button onClick={handleSend}>Send 0.1 SOL</button>;
}
```

### Next.js Example
```javascript
export default function TransactionPage() {
    const [status, setStatus] = useState('');
    
    const sendTransaction = async () => {
        const sdk = new GaslessSDK();
        setStatus('Sending...');
        
        const result = await sdk.sendTransaction(
            'Address',
            GaslessSDK.solToLamports(0.1)
        );
        
        setStatus(result.success ? 'Sent!' : 'Failed');
    };
}
```

## Complete Example

### 1. Simple HTML + JavaScript Example
```html
<!DOCTYPE html>
<html>
<head>
    <title>Solana Gasless Transfer</title>
</head>
<body>
    <h1>Solana Gasless Transfer</h1>
    <input type="text" id="recipient" placeholder="Recipient Address">
    <input type="number" id="amount" placeholder="Amount in SOL" step="0.1">
    <button onclick="sendTransaction()">Send SOL</button>
    <div id="status"></div>

    <script type="module">
        import { GaslessSDK } from 'solana-gasless-sdk-dev';

        window.sendTransaction = async function() {
            const status = document.getElementById('status');
            const recipient = document.getElementById('recipient').value;
            const amount = parseFloat(document.getElementById('amount').value);

            status.textContent = 'Sending transaction...';

            try {
                const sdk = new GaslessSDK();
                const lamports = GaslessSDK.solToLamports(amount);
                
                const result = await sdk.sendTransaction(recipient, lamports);
                
                if (result.success) {
                    status.textContent = `Success! Transaction signature: ${result.signature}`;
                } else {
                    status.textContent = `Error: ${result.error}`;
                }
            } catch (error) {
                status.textContent = `Error: ${error.message}`;
            }
        }
    </script>
</body>
</html>
```

### 2. React Component Example
```jsx
import { useState } from 'react';
import { GaslessSDK } from 'solana-gasless-sdk-dev';

export function GaslessTransfer() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');

    const handleTransfer = async (e) => {
        e.preventDefault();
        setStatus('Sending transaction...');

        try {
            const sdk = new GaslessSDK();
            const lamports = GaslessSDK.solToLamports(parseFloat(amount));
            
            const result = await sdk.sendTransaction(recipient, lamports);
            
            if (result.success) {
                setStatus(`Success! Tx: ${result.signature}`);
            } else {
                setStatus(`Error: ${result.error}`);
            }
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Send SOL (Gasless)</h2>
            <form onSubmit={handleTransfer}>
                <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <input
                    type="number"
                    step="0.1"
                    placeholder="Amount in SOL"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
            <div>{status}</div>
        </div>
    );
}
```

### 3. Node.js Script Example
```javascript
const { GaslessSDK } = require('solana-gasless-sdk-dev');

async function sendGaslessTransaction() {
    try {
        const sdk = new GaslessSDK();
        
        // Example values
        const recipientAddress = 'RECIPIENT_SOLANA_ADDRESS';
        const amountInSol = 0.1;
        
        const result = await sdk.sendTransaction(
            recipientAddress,
            GaslessSDK.solToLamports(amountInSol)
        );
        
        if (result.success) {
            console.log('Transaction successful!');
            console.log('Signature:', result.signature);
            console.log('Amount:', result.lamports, 'lamports');
            console.log('Recipient:', result.recipient);
        } else {
            console.error('Transaction failed:', result.error);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

sendGaslessTransaction();
```

### Quick Test
To quickly test if the SDK is working:

```javascript
// In Node.js or browser console
import { GaslessSDK } from 'solana-gasless-sdk-dev';

const test = async () => {
    const sdk = new GaslessSDK();
    const result = await sdk.sendTransaction(
        '9zPVXhH7Ean3dexNvRqer1TyrmhLGh2yWxEtgQC3sQcN', // Example address
        GaslessSDK.solToLamports(0.1)
    );
    console.log(result);
};

test();
```

## Firebase Authentication Example

```jsx
import { useState, useEffect } from 'react';
import { GaslessSDK } from 'solana-gasless-sdk';

export function AuthExample() {
    const [sdk, setSdk] = useState(null);
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    
    useEffect(() => {
        // Initialize SDK with Firebase config
        const gaslessSdk = new GaslessSDK({
            firebaseConfig: {
                apiKey: "YOUR_API_KEY",
                authDomain: "YOUR_AUTH_DOMAIN",
                projectId: "YOUR_PROJECT_ID",
                storageBucket: "YOUR_STORAGE_BUCKET",
                messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
                appId: "YOUR_APP_ID"
            }
        });
        
        setSdk(gaslessSdk);
        
        // Listen for auth state changes
        const unsubscribe = gaslessSdk.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {
                // Automatically fetch user's wallet when they sign in
                gaslessSdk.getWallet().then(address => setWallet(address));
                // Get transaction history
                gaslessSdk.getTransactionHistory().then(history => setTransactions(history));
            }
        });
        
        return () => unsubscribe();
    }, []);
    
    const handleGoogleSignIn = async () => {
        try {
            await sdk.signInWithGoogle();
            // User state will be updated by the auth listener
        } catch (error) {
            console.error("Sign in failed:", error);
        }
    };
    
    const handleGithubSignIn = async () => {
        try {
            await sdk.signInWithGithub();
            // User state will be updated by the auth listener
        } catch (error) {
            console.error("Sign in failed:", error);
        }
    };
    
    const handleSignOut = async () => {
        try {
            await sdk.signOut();
            // User state will be updated by the auth listener
            setWallet(null);
            setTransactions([]);
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };
    
    const handleSendTransaction = async () => {
        if (!user) {
            alert("Please sign in first");
            return;
        }
        
        try {
            const result = await sdk.sendTransaction(
                "RECIPIENT_ADDRESS",
                GaslessSDK.solToLamports(0.01)
            );
            
            if (result.success) {
                alert(`Transaction successful! Signature: ${result.signature}`);
                // Refresh transaction history
                const history = await sdk.getTransactionHistory();
                setTransactions(history);
            } else {
                alert(`Transaction failed: ${result.error}`);
            }
        } catch (error) {
            console.error("Send transaction failed:", error);
        }
    };
    
    return (
        <div>
            <h2>Solana Gasless SDK with Authentication</h2>
            
            {user ? (
                <div>
                    <p>Signed in as: {user.displayName}</p>
                    <p>Email: {user.email}</p>
                    <p>Your Solana address: {wallet || "Loading..."}</p>
                    
                    <button onClick={handleSendTransaction}>Send 0.01 SOL</button>
                    <button onClick={handleSignOut}>Sign Out</button>
                    
                    <h3>Transaction History</h3>
                    {transactions.length > 0 ? (
                        <ul>
                            {transactions.map(tx => (
                                <li key={tx.signature}>
                                    Sent {GaslessSDK.lamportsToSol(tx.lamports)} SOL 
                                    to {tx.recipient.substring(0, 4)}...{tx.recipient.substring(tx.recipient.length - 4)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No transactions yet</p>
                    )}
                </div>
            ) : (
                <div>
                    <p>Please sign in to continue</p>
                    <button onClick={handleGoogleSignIn}>Sign in with Google</button>
                    <button onClick={handleGithubSignIn}>Sign in with GitHub</button>
                </div>
            )}
        </div>
    );
}
```

Note: Make sure to:
1. Replace `RECIPIENT_SOLANA_ADDRESS` with a real Solana address
2. Keep amounts below 15 SOL
3. Handle rate limits (3 requests per wallet per 3 hours)

## Support

- GitHub Issues: [Report a bug](https://github.com/adityajha2005/solana-gasless-sdk/issues)
- X: [@adxtya_jha](https://x.com/adxtya_jha)
- Email: 2005akjha@email.com

## License

MIT License - feel free to use in your projects!
