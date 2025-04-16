# Solana Gasless SDK Documentation

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Security](#security)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Introduction

Solana Gasless SDK enables developers to implement gasless transactions in their Solana dApps. This means users can interact with your dApp without needing SOL for gas fees or even creating a wallet first. The SDK comes with pre-configured Firebase Authentication to provide a seamless user experience while automatically generating and managing Solana wallets on behalf of your users - no additional setup required!

### Why Use Gasless SDK?
- Reduce user onboarding friction
- Increase user conversion rates
- Lower barrier to entry for new users
- Improve user experience
- Familiar authentication methods (Google, GitHub)
- No need for wallet creation or seed phrase management
- Zero Firebase configuration required - everything works out of the box

## Features

### Core Features
- ✅ Gasless transactions
- ✅ No private keys needed from users
- ✅ Pre-configured Firebase authentication (Google & GitHub)
- ✅ Automatic wallet generation & management
- ✅ Transaction history tracking
- ✅ Simple integration - just import and use
- ✅ No configuration needed
- ✅ TypeScript support
- ✅ Rate limiting protection
- ✅ Error handling

### Technical Specifications
- Maximum transaction size: 0.5 SOL
- Rate limit: 2 requests per wallet per 3 hours
- Network support: Solana devnet & mainnet
- Response time: ~500ms average

## Firebase Authentication

The Solana Gasless SDK uses Firebase Authentication to provide a seamless user experience. When users authenticate, a Solana wallet is automatically generated and associated with their Firebase user account.

### Authentication Methods

#### Google Authentication
```javascript
import { GaslessSDK } from 'solana-gasless-sdk-dev';

const sdk = new GaslessSDK({
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
});

// Sign in with Google
const userCredential = await sdk.signInWithGoogle();
```

#### GitHub Authentication
```javascript
// Sign in with GitHub
const userCredential = await sdk.signInWithGithub();
```

### User Management

#### Get Current User
```javascript
const user = sdk.getCurrentUser();
```

#### Listen to Auth State Changes
```javascript
sdk.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in');
  } else {
    console.log('User is signed out');
  }
});
```

#### Sign Out
```javascript
await sdk.signOut();
```

## Wallet Management

When a user authenticates, a Solana wallet is automatically generated and securely stored in Firebase. The SDK provides methods to interact with this wallet.

### Get User's Wallet Address
```javascript
const walletAddress = await sdk.getWallet();
```

### Get Transaction History
```javascript
const transactions = await sdk.getTransactionHistory();
```

## Installation

```bash
# Using npm
npm install solana-gasless-sdk-dev

# Using yarn
yarn add solana-gasless-sdk-dev
```

## Getting Started

### Basic Implementation
```javascript
import { GaslessSDK } from 'solana-gasless-sdk-dev';

// Initialize SDK
const sdk = new GaslessSDK();

// Send transaction
const result = await sdk.sendTransaction(
    'RECIPIENT_ADDRESS',
    GaslessSDK.solToLamports(0.1)
);
```

### Configuration Options
```javascript
const sdk = new GaslessSDK({
    relayerUrl: 'https://your-custom-relayer.com' // Optional
});
```

## API Reference

### Class: GaslessSDK

#### Constructor
```typescript
constructor(config?: {
    relayerUrl?: string;
    firebaseConfig: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId?: string;
        databaseURL?: string;
    }
})
```

#### Authentication Methods

```typescript
// Sign in with Google (returns Firebase UserCredential)
async signInWithGoogle(): Promise<UserCredential>

// Sign in with GitHub (returns Firebase UserCredential)
async signInWithGithub(): Promise<UserCredential>

// Sign out current user
async signOut(): Promise<void>

// Get current Firebase user
getCurrentUser(): User | null

// Listen for authentication state changes
onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe
```

#### Wallet Methods

```typescript
// Get current user's Solana wallet address
async getWallet(): Promise<string | null>

// Get transaction history for current user
async getTransactionHistory(): Promise<Transaction[]>
```

#### Transaction Methods

```typescript
// Send a gasless transaction
async sendTransaction(
    recipientAddress: string,
    lamports: number
): Promise<TransactionResult>
```

#### Utility Methods
```typescript
// Convert SOL to lamports
static solToLamports(sol: number): number

// Convert lamports to SOL
static lamportsToSol(lamports: number): number
```

### Response Types

#### Transaction Result
```typescript
interface TransactionResult {
    success: boolean;
    signature?: string;
    error?: string;
    recipient?: string;
    lamports?: number;
}
```

#### Transaction History Item
```typescript
interface Transaction {
    signature: string;
    timestamp: number;
    recipient: string;
    lamports: number;
}
```

#### User Wallet
```typescript
interface UserWallet {
    publicKey: string;
}
```

## Security

### Architecture
```
User → SDK → Relayer → Solana Network
           ↓
      Rate Limiting
      Input Validation
```

### Security Features
1. **Rate Limiting**
   - 3 requests per wallet per 3 hours
   - Prevents abuse and DOS attacks

2. **Input Validation**
   - Address validation
   - Amount validation
   - Parameter sanitization

3. **Error Handling**
   - Comprehensive error messages
   - Failed transaction recovery
   - Network error handling

## Examples

### 1. Basic Web Implementation
```html
<!DOCTYPE html>
<html>
<head>
    <title>Gasless Transfer</title>
</head>
<body>
    <script type="module">
        import { GaslessSDK } from 'solana-gasless-sdk-dev';
        
        const sdk = new GaslessSDK();
        const result = await sdk.sendTransaction(
            'ADDRESS',
            GaslessSDK.solToLamports(0.1)
        );
    </script>
</body>
</html>
```

### 2. React Integration
```jsx
import { GaslessSDK } from 'solana-gasless-sdk-dev';
import { useState } from 'react';

function TransferComponent() {
    const [status, setStatus] = useState('');
    const sdk = new GaslessSDK();

    const handleTransfer = async () => {
        const result = await sdk.sendTransaction(
            'ADDRESS',
            GaslessSDK.solToLamports(0.1)
        );
        setStatus(result.success ? 'Success!' : 'Failed');
    };

    return <button onClick={handleTransfer}>Transfer</button>;
}
```

### 3. Node.js Backend Integration
```javascript
const { GaslessSDK } = require('solana-gasless-sdk-dev');

async function processTransfer(req, res) {
    const sdk = new GaslessSDK();
    try {
        const result = await sdk.sendTransaction(
            req.body.address,
            GaslessSDK.solToLamports(req.body.amount)
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
```

## Advanced Usage

### Firebase Integration Details

The Solana Gasless SDK uses Firebase to manage user authentication and wallet association. Here's what happens behind the scenes:

1. When a user authenticates via Google or GitHub, Firebase creates a user account
2. The backend automatically generates a Solana keypair for this user
3. The keypair is securely stored and associated with the user's Firebase UID
4. All subsequent transactions are signed by the backend using this keypair
5. Users can access their wallet through the SDK without ever seeing the private key

### Custom Firebase Configuration

If you have specific Firebase configuration needs:

```javascript
const sdk = new GaslessSDK({
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    // Optional additional configuration
    measurementId: "YOUR_MEASUREMENT_ID",
    databaseURL: "YOUR_DATABASE_URL"
  },
  relayerUrl: 'https://your-custom-relayer.com' // Optional
});
```

### React Integration with Authentication Flow

```jsx
import { GaslessSDK } from 'solana-gasless-sdk-dev';
import { useState, useEffect } from 'react';

function GaslessApp() {
  const [sdk, setSdk] = useState(null);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    // Initialize SDK
    const gaslessSdk = new GaslessSDK({
      firebaseConfig: {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        // Additional config...
      }
    });
    
    setSdk(gaslessSdk);
    
    // Set up auth state listener
    const unsubscribe = gaslessSdk.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Get user's wallet
        gaslessSdk.getWallet().then(address => setWallet(address));
        // Get transaction history
        gaslessSdk.getTransactionHistory().then(history => setTransactions(history));
      } else {
        setWallet(null);
        setTransactions([]);
      }
    });
    
    return () => unsubscribe(); // Cleanup subscription
  }, []);
  
  const handleSignIn = async () => {
    try {
      await sdk.signInWithGoogle();
      // User state will be updated by the auth listener
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };
  
  const handleTransfer = async () => {
    try {
      const result = await sdk.sendTransaction(
        'RECIPIENT_ADDRESS',
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
      console.error('Transfer failed:', error);
    }
  };
  
  return (
    <div>
      {user ? (
        <>
          <p>Logged in as: {user.displayName}</p>
          <p>Your Solana address: {wallet || 'Loading...'}</p>
          <button onClick={handleTransfer}>Send 0.01 SOL</button>
          <button onClick={() => sdk.signOut()}>Sign Out</button>
          
          <h3>Transaction History</h3>
          <ul>
            {transactions.map(tx => (
              <li key={tx.signature}>
                Sent {GaslessSDK.lamportsToSol(tx.lamports)} SOL to {tx.recipient}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
}
```

## Using with Next.js

```jsx
// pages/index.js
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import SDK dynamically to avoid SSR issues with browser-only APIs
const GaslessDynamicComponent = dynamic(
  () => import('../components/GaslessComponent'),
  { ssr: false }
);

export default function Home() {
  return (
    <div>
      <h1>Solana Gasless Transactions</h1>
      <GaslessDynamicComponent />
    </div>
  );
}

// components/GaslessComponent.js
import { useEffect, useState } from 'react';
import { GaslessSDK } from 'solana-gasless-sdk-dev';

export default function GaslessComponent() {
  // Implementation similar to React example above
  // ...
}
```

## Troubleshooting

### Common Issues

1. **Rate Limit Exceeded**
```javascript
// Error: Too many requests from this wallet
// Solution: Implement waiting period
setTimeout(sendTransaction, 3 * 60 * 60 * 1000); // Wait 3 hours
```

2. **Invalid Address**
```javascript
// Error: Invalid recipient address
// Solution: Validate address format
if (!sdk.isValidSolanaAddress(address)) {
    console.error('Invalid address format');
}
```

3. **Amount Too High**
```javascript
// Error: Amount exceeds maximum
// Solution: Check amount before sending
if (amount > 0.5) {
    console.error('Maximum amount is 0.5 SOL');
}
```

### Firebase Authentication Issues

1. **Popup Blocked**
```javascript
// Error: Firebase: Error (auth/popup-blocked)
// Solution: Handle popup blocker
try {
  const result = await sdk.signInWithGoogle();
} catch (error) {
  if (error.code === 'auth/popup-blocked') {
    alert('Please enable popups for this site to login');
  }
}
```

2. **Already Signed In**
```javascript
// Error: Firebase: Error (auth/account-exists-with-different-credential)
// Solution: Link accounts or sign out first
if (sdk.getCurrentUser()) {
  await sdk.signOut();
  // Then try sign in again
}
```

3. **No Internet Connection**
```javascript
// Error: Firebase: Error (auth/network-request-failed)
// Solution: Check connection and retry
if (navigator.onLine) {
  // Retry authentication
} else {
  alert('Please check your internet connection');
}
```

4. **Firebase Configuration Issues**
```javascript
// Error: Firebase app already exists or invalid config
// Solution: Check configuration
try {
  const sdk = new GaslessSDK({
    firebaseConfig: { /* your config */ }
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Check if all required config fields are present
}
```

### Error Messages
| Error Code | Description | Solution |
|------------|-------------|----------|
| RATE_LIMIT | Too many requests | Wait for rate limit reset |
| INVALID_ADDRESS | Invalid recipient | Check address format |
| AMOUNT_EXCEED | Amount too high | Reduce amount below 0.5 SOL |
| AUTH_POPUP_BLOCKED | Auth popup blocked | Enable popups |
| AUTH_ACCOUNT_EXISTS | Account already exists | Link accounts or sign out |
| AUTH_NETWORK_FAILED | Network request failed | Check internet connection |

## Contributing

### Development Setup
1. Clone repository
2. Install dependencies
3. Run tests
```bash
git clone https://github.com/adityajha2005/solana-gasless-sdk
cd solana-gasless-sdk
npm install
npm test
```

### Pull Request Process
1. Fork repository
2. Create feature branch
3. Commit changes
4. Submit PR

## Support

- GitHub Issues: [Report a bug](https://github.com/adityajha2005/solanaFlow/issues)
- X: [@adxtya_jha](https://x.com/adxtya_jha)
- Email: 2005akjha@email.com

## License

MIT License - See [LICENSE](../LICENSE) for details