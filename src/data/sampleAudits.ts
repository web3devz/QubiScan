import { AuditResult } from '../types/audit';

export const sampleAudits: AuditResult[] = [
  {
    id: '1',
    contractName: 'DeFiLendingProtocol',
    timestamp: new Date('2025-07-08T14:30:00Z'),
    contractCode: `class DeFiLendingProtocol {
private:
    mapping(address => uint256) balances;
    mapping(address => uint256) collateral;
    uint256 public totalSupply;
    
public:
    void deposit(uint256 amount) {
        require(amount > 0, "Amount must be positive");
        balances[msg.sender] += amount;
        totalSupply += amount;
    }
    
    void withdraw(uint256 amount) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        msg.sender.transfer(amount);
    }
    
    void borrow(uint256 amount) {
        require(collateral[msg.sender] * 2 >= amount, "Insufficient collateral");
        balances[msg.sender] += amount;
    }
};`,
    staticIssues: [
      {
        id: 'high-1',
        pattern: 'transfer',
        severity: 'High',
        message: 'Transfer operations should include proper balance checks and reentrancy protection',
        line: 15
      },
      {
        id: 'medium-1',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 10
      },
      {
        id: 'medium-2',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 15
      },
      {
        id: 'low-1',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 9
      },
      {
        id: 'low-2',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 14
      }
    ],
    aiResponse: 'This DeFi lending protocol has several critical vulnerabilities including reentrancy risks in the withdraw function and insufficient access controls.',
    score: 65,
    deployedAccount: 'xpsxzzfqvaohzzwlbofvqkqeemzhnrscpeeokoumekfodtgzmwghtqm'
  },
  {
    id: '2',
    contractName: 'SecureTokenVault',
    timestamp: new Date('2025-07-08T13:15:00Z'),
    contractCode: `class SecureTokenVault {
private:
    mapping(address => uint256) private balances;
    address public owner;
    bool private locked;
    
public:
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }
    
    void deposit(uint256 amount) nonReentrant {
        require(amount > 0, "Invalid amount");
        balances[msg.sender] += amount;
    }
    
    void withdraw(uint256 amount) onlyOwner nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        msg.sender.transfer(amount);
    }
};`,
    staticIssues: [
      {
        id: 'high-1',
        pattern: 'transfer',
        severity: 'High',
        message: 'Transfer operations should include proper balance checks and reentrancy protection',
        line: 27
      }
    ],
    aiResponse: 'This vault implementation shows good security practices with reentrancy guards and access controls, but still has one transfer vulnerability.',
    score: 85,
    deployedAccount: 'ukzbkszgzpipmxrrqcxcppumxoxzerrvbjgthinzodrlyblkedutmsy'
  },
  {
    id: '3',
    contractName: 'VulnerableExchange',
    timestamp: new Date('2025-07-08T12:45:00Z'),
    contractCode: `class VulnerableExchange {
private:
    mapping(address => uint256) balances;
    uint256 public exchangeRate;
    
public:
    void setExchangeRate(uint256 rate) {
        exchangeRate = rate;
    }
    
    void trade(uint256 amount) {
        uint256 randomSeed = block.timestamp % 100;
        uint256 bonus = random() % 10;
        balances[msg.sender] += amount + bonus;
        msg.sender.transfer(amount);
    }
    
    void emergencyWithdraw() {
        msg.sender.transfer(balances[msg.sender]);
        balances[msg.sender] = 0;
    }
};`,
    staticIssues: [
      {
        id: 'high-1',
        pattern: 'random',
        severity: 'High',
        message: 'Random number generation in smart contracts is vulnerable to manipulation',
        line: 13
      },
      {
        id: 'high-2',
        pattern: 'transfer',
        severity: 'High',
        message: 'Transfer operations should include proper balance checks and reentrancy protection',
        line: 15
      },
      {
        id: 'high-3',
        pattern: 'transfer',
        severity: 'High',
        message: 'Transfer operations should include proper balance checks and reentrancy protection',
        line: 19
      },
      {
        id: 'medium-1',
        pattern: 'timestamp',
        severity: 'Medium',
        message: 'Block timestamp can be manipulated by miners within certain bounds',
        line: 12
      },
      {
        id: 'medium-2',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 14
      },
      {
        id: 'medium-3',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 19
      }
    ],
    aiResponse: 'This exchange contract has severe security vulnerabilities including predictable randomness, timestamp manipulation, and multiple reentrancy risks.',
    score: 35,
    deployedAccount: 'wgfqazfmgucrluchpuivdkguaijrowcnuclfsjrthfezqapnjelkgll'
  },
  {
    id: '4',
    contractName: 'SimpleWallet',
    timestamp: new Date('2025-07-08T11:20:00Z'),
    contractCode: `class SimpleWallet {
private:
    mapping(address => uint256) balances;
    address public owner;
    
public:
    SimpleWallet(address _owner) {
        owner = _owner;
    }
    
    void deposit(uint256 amount) {
        require(amount > 0, "Amount must be positive");
        balances[msg.sender] += amount;
    }
    
    uint256 getBalance(address user) {
        return balances[user];
    }
};`,
    staticIssues: [
      {
        id: 'medium-1',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 12
      },
      {
        id: 'low-1',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 11
      }
    ],
    aiResponse: 'This simple wallet has basic functionality with minimal security issues. Good foundation but needs more comprehensive access controls.',
    score: 78,
    deployedAccount: 'kewgvatawujuzikurbhwkrisjiubfxgfqkrvcqvfvgfgajphbvhlaos'
  },
  {
    id: '5',
    contractName: 'CriticalBankingSystem',
    timestamp: new Date('2025-07-08T10:30:00Z'),
    contractCode: `class CriticalBankingSystem {
private:
    char usernames[100][32];
    uint256 balances[100];
    
public:
    void createAccount(char* username, uint256 initialDeposit) {
        strcpy(usernames[userCount], username);
        sprintf(buffer, "Welcome %s", username);
        balances[userCount] = initialDeposit;
        userCount++;
    }
    
    void transfer(uint256 from, uint256 to, uint256 amount) {
        balances[from] -= amount;
        balances[to] += amount;
        free(tempBuffer);
    }
    
    uint256 calculateInterest(uint256 principal, uint256 rate) {
        return principal * rate * 365;
    }
};`,
    staticIssues: [
      {
        id: 'high-1',
        pattern: 'strcpy',
        severity: 'High',
        message: 'Unsafe use of strcpy() can lead to buffer overflow vulnerabilities',
        line: 7
      },
      {
        id: 'high-2',
        pattern: 'sprintf',
        severity: 'High',
        message: 'Unsafe use of sprintf() can lead to buffer overflow vulnerabilities',
        line: 8
      },
      {
        id: 'medium-1',
        pattern: 'free',
        severity: 'Medium',
        message: 'Manual memory deallocation requires careful handling to prevent double-free',
        line: 16
      }
    ],
    aiResponse: 'CRITICAL: This banking system has severe buffer overflow vulnerabilities that could lead to complete system compromise. Immediate remediation required.',
    score: 25,
    deployedAccount: 'mnbvcxzlkjhgfdsapoiuytrewqasdfghjklzxcvbnmpoiuytrewq'
  },
  {
    id: '6',
    contractName: 'GameRewardSystem',
    timestamp: new Date('2025-07-08T09:45:00Z'),
    contractCode: `class GameRewardSystem {
private:
    mapping(address => uint256) playerScores;
    mapping(address => uint256) rewards;
    uint256 public totalRewards;
    
public:
    void updateScore(address player, uint256 score) {
        require(score > 0, "Score must be positive");
        playerScores[player] = score;
    }
    
    void claimReward() {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No reward available");
        rewards[msg.sender] += reward;
        totalRewards += reward;
        msg.sender.transfer(reward);
    }
    
    uint256 calculateReward(address player) {
        return playerScores[player] * 100;
    }
};`,
    staticIssues: [
      {
        id: 'high-1',
        pattern: 'transfer',
        severity: 'High',
        message: 'Transfer operations should include proper balance checks and reentrancy protection',
        line: 17
      },
      {
        id: 'medium-1',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 13
      },
      {
        id: 'medium-2',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 17
      },
      {
        id: 'low-1',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 8
      },
      {
        id: 'low-2',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 14
      }
    ],
    aiResponse: 'Game reward system has reentrancy vulnerabilities in reward claiming. Needs proper access controls and overflow protection.',
    score: 62,
    deployedAccount: 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm'
  },
  {
    id: '7',
    contractName: 'PerfectSecurityContract',
    timestamp: new Date('2025-07-08T08:15:00Z'),
    contractCode: `class PerfectSecurityContract {
private:
    mapping(address => uint256) private balances;
    address public immutable owner;
    bool private locked;
    uint256 public constant MAX_SUPPLY = 1000000;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized: Only owner allowed");
        _;
    }
    
    modifier nonReentrant() {
        require(!locked, "Reentrant call detected");
        locked = true;
        _;
        locked = false;
    }
    
    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        require(amount <= MAX_SUPPLY, "Amount exceeds maximum supply");
        _;
    }
    
public:
    constructor(address _owner) {
        owner = _owner;
    }
    
    function deposit(uint256 amount) external validAmount(amount) nonReentrant {
        require(balances[msg.sender] + amount >= balances[msg.sender], "Overflow detected");
        balances[msg.sender] += amount;
    }
    
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
};`,
    staticIssues: [],
    aiResponse: 'Excellent security implementation! This contract demonstrates best practices with proper access controls, reentrancy guards, overflow protection, and comprehensive input validation.',
    score: 95
  },
  {
    id: '8',
    contractName: 'LegacyPaymentProcessor',
    timestamp: new Date('2025-07-08T07:30:00Z'),
    contractCode: `class LegacyPaymentProcessor {
private:
    char customerData[1000][256];
    uint256 payments[1000];
    
public:
    void processPayment(char* customerInfo, uint256 amount) {
        char buffer[128];
        strcpy(buffer, customerInfo);
        strcat(buffer, " - Payment processed");
        
        int* paymentPtr = (int*)malloc(sizeof(int));
        *paymentPtr = amount;
        
        sprintf(buffer, "Payment of %d processed for %s", amount, customerInfo);
        
        payments[customerCount] = amount;
        customerCount++;
        
        free(paymentPtr);
        free(paymentPtr); // Double free!
    }
    
    void getCustomerData(int index, char* output) {
        strcpy(output, customerData[index]);
    }
};`,
    staticIssues: [
      {
        id: 'high-1',
        pattern: 'strcpy',
        severity: 'High',
        message: 'Unsafe use of strcpy() can lead to buffer overflow vulnerabilities',
        line: 8
      },
      {
        id: 'high-2',
        pattern: 'strcat',
        severity: 'High',
        message: 'Unsafe use of strcat() can lead to buffer overflow vulnerabilities',
        line: 9
      },
      {
        id: 'high-3',
        pattern: 'sprintf',
        severity: 'High',
        message: 'Unsafe use of sprintf() can lead to buffer overflow vulnerabilities',
        line: 14
      },
      {
        id: 'high-4',
        pattern: 'strcpy',
        severity: 'High',
        message: 'Unsafe use of strcpy() can lead to buffer overflow vulnerabilities',
        line: 23
      },
      {
        id: 'medium-1',
        pattern: 'malloc',
        severity: 'Medium',
        message: 'Manual memory management may lead to memory leaks or double-free vulnerabilities',
        line: 11
      },
      {
        id: 'medium-2',
        pattern: 'free',
        severity: 'Medium',
        message: 'Manual memory deallocation requires careful handling to prevent double-free',
        line: 18
      },
      {
        id: 'medium-3',
        pattern: 'free',
        severity: 'Medium',
        message: 'Manual memory deallocation requires careful handling to prevent double-free',
        line: 19
      }
    ],
    aiResponse: 'EXTREMELY DANGEROUS: This legacy payment processor has multiple critical vulnerabilities including buffer overflows, double-free errors, and unsafe string operations. Complete rewrite recommended.',
    score: 15,
    deployedAccount: 'asdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiop'
  },
  {
    id: '9',
    contractName: 'ModernNFTMarketplace',
    timestamp: new Date('2025-07-08T06:45:00Z'),
    contractCode: `class ModernNFTMarketplace {
private:
    mapping(uint256 => address) tokenOwners;
    mapping(uint256 => uint256) tokenPrices;
    mapping(address => uint256) balances;
    address public owner;
    bool private paused;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
public:
    void listNFT(uint256 tokenId, uint256 price) whenNotPaused {
        require(tokenOwners[tokenId] == msg.sender, "Not token owner");
        require(price > 0, "Price must be positive");
        tokenPrices[tokenId] = price;
    }
    
    void buyNFT(uint256 tokenId) whenNotPaused {
        require(tokenPrices[tokenId] > 0, "Token not for sale");
        require(balances[msg.sender] >= tokenPrices[tokenId], "Insufficient balance");
        
        address seller = tokenOwners[tokenId];
        uint256 price = tokenPrices[tokenId];
        
        balances[msg.sender] -= price;
        balances[seller] += price;
        tokenOwners[tokenId] = msg.sender;
        tokenPrices[tokenId] = 0;
    }
    
    void emergencyPause() onlyOwner {
        paused = true;
    }
};`,
    staticIssues: [
      {
        id: 'medium-1',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 20
      },
      {
        id: 'medium-2',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 26
      },
      {
        id: 'medium-3',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 31
      },
      {
        id: 'medium-4',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 33
      },
      {
        id: 'low-1',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 20
      },
      {
        id: 'low-2',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 21
      },
      {
        id: 'low-3',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 26
      },
      {
        id: 'low-4',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 27
      }
    ],
    aiResponse: 'Well-structured NFT marketplace with good access controls and pause functionality. Some minor improvements needed for enhanced security.',
    score: 72,
    deployedAccount: 'zxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjkl'
  },
  {
    id: '10',
    contractName: 'QuantumRandomOracle',
    timestamp: new Date('2025-07-08T05:20:00Z'),
    contractCode: `class QuantumRandomOracle {
private:
    uint256 private nonce;
    mapping(address => bool) authorizedCallers;
    
public:
    void generateRandom(uint256 seed) {
        uint256 randomValue = random() + block.timestamp;
        uint256 quantumSeed = tx.origin + seed;
        
        uint256 finalRandom = randomValue * quantumSeed;
        emit RandomGenerated(finalRandom);
    }
    
    void setAuthorization(address caller, bool authorized) {
        authorizedCallers[caller] = authorized;
    }
};`,
    staticIssues: [
      {
        id: 'high-1',
        pattern: 'random',
        severity: 'High',
        message: 'Random number generation in smart contracts is vulnerable to manipulation',
        line: 8
      },
      {
        id: 'high-2',
        pattern: 'tx.origin',
        severity: 'High',
        message: 'tx.origin should never be used for authorization as it can be exploited',
        line: 9
      },
      {
        id: 'medium-1',
        pattern: 'timestamp',
        severity: 'Medium',
        message: 'Block timestamp can be manipulated by miners within certain bounds',
        line: 8
      }
    ],
    aiResponse: 'CRITICAL SECURITY FLAW: This random oracle uses predictable sources and tx.origin, making it completely unreliable for any security-critical applications.',
    score: 30
  },
  {
    id: '11',
    contractName: 'EnterpriseMultiSig',
    timestamp: new Date('2025-07-08T04:10:00Z'),
    contractCode: `class EnterpriseMultiSig {
private:
    mapping(address => bool) public owners;
    mapping(bytes32 => uint256) public confirmations;
    uint256 public required;
    uint256 public ownerCount;
    
    modifier onlyOwner() {
        require(owners[msg.sender], "Not an owner");
        _;
    }
    
    modifier validRequirement(uint256 _required) {
        require(_required > 0 && _required <= ownerCount, "Invalid requirement");
        _;
    }
    
public:
    function addOwner(address owner) external onlyOwner {
        require(!owners[owner], "Already an owner");
        require(owner != address(0), "Invalid address");
        
        owners[owner] = true;
        ownerCount++;
    }
    
    function executeTransaction(bytes32 txHash) external onlyOwner {
        require(confirmations[txHash] >= required, "Insufficient confirmations");
        // Execute transaction logic
    }
    
    function confirmTransaction(bytes32 txHash) external onlyOwner {
        require(confirmations[txHash] < required, "Already confirmed");
        confirmations[txHash]++;
    }
};`,
    staticIssues: [
      {
        id: 'medium-1',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 9
      },
      {
        id: 'low-1',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 19
      },
      {
        id: 'low-2',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 20
      },
      {
        id: 'low-3',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 26
      },
      {
        id: 'low-4',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 31
      }
    ],
    aiResponse: 'Solid multi-signature implementation with proper owner management and confirmation requirements. Good security foundation with room for minor improvements.',
    score: 82
  },
  {
    id: '12',
    contractName: 'FlashLoanArbitrage',
    timestamp: new Date('2025-07-08T03:30:00Z'),
    contractCode: `class FlashLoanArbitrage {
private:
    mapping(address => uint256) balances;
    uint256 public poolBalance;
    
public:
    void flashLoan(uint256 amount) {
        require(amount <= poolBalance, "Insufficient liquidity");
        
        poolBalance -= amount;
        
        // External call to borrower
        borrower.executeArbitrage(amount);
        
        // Check repayment
        require(poolBalance >= originalBalance + fee, "Loan not repaid");
    }
    
    void deposit(uint256 amount) {
        balances[msg.sender] += amount;
        poolBalance += amount;
    }
    
    void withdraw(uint256 amount) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        poolBalance -= amount;
        msg.sender.transfer(amount);
    }
};`,
    staticIssues: [
      {
        id: 'high-1',
        pattern: 'transfer',
        severity: 'High',
        message: 'Transfer operations should include proper balance checks and reentrancy protection',
        line: 26
      },
      {
        id: 'medium-1',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 18
      },
      {
        id: 'medium-2',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 22
      },
      {
        id: 'medium-3',
        pattern: 'msg.sender',
        severity: 'Medium',
        message: 'Access control using msg.sender should be implemented with proper authorization checks',
        line: 26
      },
      {
        id: 'low-1',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 7
      },
      {
        id: 'low-2',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 14
      },
      {
        id: 'low-3',
        pattern: 'require',
        severity: 'Low',
        message: 'Ensure require statements have meaningful error messages',
        line: 22
      }
    ],
    aiResponse: 'Flash loan implementation has reentrancy vulnerabilities and lacks proper state management. Critical for DeFi security - needs immediate attention.',
    score: 55
  }
];