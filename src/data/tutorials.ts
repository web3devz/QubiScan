import { Tutorial } from '../types/audit';

export const securityTutorials: Tutorial[] = [
  {
    id: 'buffer-overflow',
    title: 'Buffer Overflow Prevention',
    severity: 'High',
    description: 'Buffer overflows are among the most dangerous vulnerabilities, allowing attackers to execute arbitrary code.',
    badCode: `void processUserInput(char* userInput) {
    char buffer[32];
    strcpy(buffer, userInput);  // DANGEROUS!
    printf("Processing: %s\\n", buffer);
}

void handleLogin(char* username, char* password) {
    char user[16];
    char pass[16];
    strcpy(user, username);     // No bounds checking
    strcpy(pass, password);     // Can overflow
    
    if (strcmp(user, "admin") == 0) {
        grantAccess();
    }
}`,
    fixedCode: `void processUserInput(char* userInput) {
    char buffer[32];
    strncpy(buffer, userInput, sizeof(buffer) - 1);
    buffer[sizeof(buffer) - 1] = '\\0';  // Ensure null termination
    printf("Processing: %s\\n", buffer);
}

void handleLogin(char* username, char* password) {
    char user[16];
    char pass[16];
    
    // Safe string copying with bounds checking
    strncpy(user, username, sizeof(user) - 1);
    user[sizeof(user) - 1] = '\\0';
    
    strncpy(pass, password, sizeof(pass) - 1);
    pass[sizeof(pass) - 1] = '\\0';
    
    if (strcmp(user, "admin") == 0) {
        grantAccess();
    }
}`,
    explanation: 'Buffer overflows occur when data exceeds allocated memory boundaries. Use strncpy() with proper size limits and always null-terminate strings. Consider using safer alternatives like std::string in C++.'
  },
  {
    id: 'integer-overflow',
    title: 'Integer Overflow Protection',
    severity: 'High',
    description: 'Integer overflows can cause unexpected behavior, allowing attackers to bypass security checks.',
    badCode: `void transfer(uint64_t amount) {
    require(amount > 0, "Amount must be positive");
    
    balance += amount;  // Can overflow!
    totalSupply += amount;  // Can overflow!
}

void withdraw(uint64_t amount) {
    require(balance >= amount, "Insufficient balance");
    balance -= amount;  // Can underflow!
}

uint64_t calculateReward(uint64_t principal, uint64_t rate, uint64_t time) {
    return principal * rate * time;  // Can overflow!
}`,
    fixedCode: `void transfer(uint64_t amount) {
    require(amount > 0, "Amount must be positive");
    require(balance + amount >= balance, "Balance overflow");
    require(totalSupply + amount >= totalSupply, "Supply overflow");
    
    balance += amount;
    totalSupply += amount;
}

void withdraw(uint64_t amount) {
    require(balance >= amount, "Insufficient balance");
    require(amount <= balance, "Underflow protection");
    
    balance -= amount;
}

uint64_t calculateReward(uint64_t principal, uint64_t rate, uint64_t time) {
    // Check for overflow before multiplication
    if (principal > UINT64_MAX / rate) {
        throw std::overflow_error("Calculation overflow");
    }
    uint64_t temp = principal * rate;
    
    if (temp > UINT64_MAX / time) {
        throw std::overflow_error("Calculation overflow");
    }
    
    return temp * time;
}`,
    explanation: 'Always check for overflow/underflow before arithmetic operations. Use safe math libraries or implement explicit checks. Consider using larger data types when necessary.'
  },
  {
    id: 'reentrancy-attacks',
    title: 'Reentrancy Attack Prevention',
    severity: 'High',
    description: 'Reentrancy attacks exploit external calls to recursively call functions before state updates complete.',
    badCode: `void withdraw(uint64_t amount) {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    // External call before state update - VULNERABLE!
    msg.sender.transfer(amount);
    balances[msg.sender] -= amount;
}

void flashLoan(uint64_t amount) {
    require(amount <= poolBalance, "Insufficient liquidity");
    
    poolBalance -= amount;
    // External call - can be reentered
    borrower.call(amount);
    poolBalance += amount + fee;
}`,
    fixedCode: `bool private locked = false;

void withdraw(uint64_t amount) {
    require(!locked, "Reentrant call detected");
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    locked = true;
    
    // Update state BEFORE external call
    balances[msg.sender] -= amount;
    msg.sender.transfer(amount);
    
    locked = false;
}

void flashLoan(uint64_t amount) {
    require(!locked, "Reentrant call detected");
    require(amount <= poolBalance, "Insufficient liquidity");
    
    locked = true;
    
    uint64_t balanceBefore = poolBalance;
    poolBalance -= amount;
    
    borrower.call(amount);
    
    require(poolBalance >= balanceBefore + fee, "Flash loan not repaid");
    locked = false;
}`,
    explanation: 'Use the checks-effects-interactions pattern: perform checks, update state, then make external calls. Implement reentrancy guards using mutex locks.'
  },
  {
    id: 'access-control',
    title: 'Proper Access Control',
    severity: 'High',
    description: 'Inadequate access control allows unauthorized users to execute privileged functions.',
    badCode: `void mintTokens(address to, uint64_t amount) {
    // No access control - anyone can mint!
    totalSupply += amount;
    balances[to] += amount;
}

void updatePrice(uint64_t newPrice) {
    // No authorization check
    tokenPrice = newPrice;
}

void emergencyStop() {
    // Critical function without protection
    paused = true;
}`,
    fixedCode: `mapping(address => bool) public admins;
address public owner;
bool public paused = false;

modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this");
    _;
}

modifier onlyAdmin() {
    require(admins[msg.sender] || msg.sender == owner, "Only admin can call this");
    _;
}

modifier whenNotPaused() {
    require(!paused, "Contract is paused");
    _;
}

void mintTokens(address to, uint64_t amount) onlyAdmin whenNotPaused {
    require(to != address(0), "Invalid address");
    require(amount > 0, "Amount must be positive");
    
    totalSupply += amount;
    balances[to] += amount;
}

void updatePrice(uint64_t newPrice) onlyAdmin {
    require(newPrice > 0, "Price must be positive");
    tokenPrice = newPrice;
}

void emergencyStop() onlyOwner {
    paused = true;
}`,
    explanation: 'Implement role-based access control with proper modifiers. Use multi-signature for critical operations. Always validate caller permissions before executing sensitive functions.'
  },
  {
    id: 'input-validation',
    title: 'Comprehensive Input Validation',
    severity: 'Medium',
    description: 'Insufficient input validation can lead to unexpected behavior and security vulnerabilities.',
    badCode: `void createUser(string name, uint64_t age, string email) {
    // No validation - accepts any input
    users[msg.sender] = User(name, age, email);
}

void setDiscount(uint64_t percentage) {
    // No bounds checking
    discountRate = percentage;
}

void processPayment(uint64_t amount, string currency) {
    // No validation of currency or amount
    payments[msg.sender] += amount;
}`,
    fixedCode: `void createUser(string name, uint64_t age, string email) {
    require(bytes(name).length > 0 && bytes(name).length <= 50, "Invalid name length");
    require(age >= 18 && age <= 120, "Invalid age");
    require(bytes(email).length > 0 && bytes(email).length <= 100, "Invalid email length");
    require(isValidEmail(email), "Invalid email format");
    require(users[msg.sender].age == 0, "User already exists");
    
    users[msg.sender] = User(name, age, email);
}

void setDiscount(uint64_t percentage) {
    require(msg.sender == owner, "Only owner can set discount");
    require(percentage <= 100, "Discount cannot exceed 100%");
    require(percentage >= 0, "Discount cannot be negative");
    
    discountRate = percentage;
}

void processPayment(uint64_t amount, string currency) {
    require(amount > 0, "Amount must be positive");
    require(amount <= MAX_PAYMENT, "Amount exceeds maximum");
    require(isValidCurrency(currency), "Unsupported currency");
    require(payments[msg.sender] + amount >= payments[msg.sender], "Overflow check");
    
    payments[msg.sender] += amount;
}`,
    explanation: 'Always validate all inputs including ranges, formats, and business logic constraints. Implement whitelist validation for enums and check for overflow conditions.'
  },
  {
    id: 'randomness-security',
    title: 'Secure Randomness Generation',
    severity: 'High',
    description: 'Predictable randomness in smart contracts can be exploited by attackers to manipulate outcomes.',
    badCode: `uint64_t generateRandomNumber() {
    // VULNERABLE: Predictable randomness
    return rand() % 100;
}

uint64_t rollDice() {
    // VULNERABLE: Block timestamp manipulation
    return (block.timestamp % 6) + 1;
}

address selectWinner(address[] participants) {
    // VULNERABLE: Miner manipulation
    uint256 index = block.difficulty % participants.length;
    return participants[index];
}`,
    fixedCode: `// Use Chainlink VRF or similar oracle for true randomness
contract SecureRandom {
    uint256 private nonce;
    mapping(uint256 => bool) private usedNonces;
    
    function generateSecureRandom(uint256 seed) internal returns (uint256) {
        nonce++;
        uint256 randomHash = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender,
            nonce,
            seed
        )));
        
        // Ensure nonce hasn't been used
        require(!usedNonces[nonce], "Nonce already used");
        usedNonces[nonce] = true;
        
        return randomHash;
    }
    
    function rollDice(uint256 seed) external returns (uint256) {
        uint256 random = generateSecureRandom(seed);
        return (random % 6) + 1;
    }
    
    function selectWinner(address[] participants, uint256 seed) external returns (address) {
        require(participants.length > 0, "No participants");
        uint256 random = generateSecureRandom(seed);
        uint256 index = random % participants.length;
        return participants[index];
    }
}`,
    explanation: 'Never use predictable sources like block.timestamp or block.difficulty for randomness. Use verifiable random functions (VRF) or commit-reveal schemes for critical randomness.'
  },
  {
    id: 'memory-management',
    title: 'Safe Memory Management',
    severity: 'Medium',
    description: 'Poor memory management can lead to leaks, double-free vulnerabilities, and use-after-free bugs.',
    badCode: `void processData() {
    int* data = (int*)malloc(100 * sizeof(int));
    
    // Process data...
    
    free(data);
    
    // Later in code - DANGEROUS!
    data[0] = 42;  // Use after free
    free(data);    // Double free
}

char* createString(const char* input) {
    char* result = (char*)malloc(strlen(input) + 1);
    strcpy(result, input);
    return result;  // Caller must remember to free
}`,
    fixedCode: `void processData() {
    int* data = (int*)malloc(100 * sizeof(int));
    if (data == NULL) {
        // Handle allocation failure
        throw std::bad_alloc();
    }
    
    try {
        // Process data...
        
        free(data);
        data = NULL;  // Prevent accidental reuse
    } catch (...) {
        free(data);
        throw;  // Re-throw after cleanup
    }
}

// Better: Use RAII with smart pointers
class SafeDataProcessor {
private:
    std::unique_ptr<int[]> data;
    
public:
    SafeDataProcessor(size_t size) : data(std::make_unique<int[]>(size)) {}
    
    void processData() {
        // Process data...
        // Automatic cleanup when object is destroyed
    }
};

std::string createString(const char* input) {
    return std::string(input);  // Automatic memory management
}`,
    explanation: 'Use RAII principles and smart pointers in C++. Always check for allocation failures, set pointers to NULL after freeing, and prefer automatic memory management.'
  },
  {
    id: 'time-manipulation',
    title: 'Time-Based Logic Security',
    severity: 'Medium',
    description: 'Relying on block timestamps for critical logic can be manipulated by miners within certain bounds.',
    badCode: `uint256 public auctionEnd;
bool public auctionEnded = false;

function endAuction() external {
    // VULNERABLE: Timestamp manipulation
    require(block.timestamp >= auctionEnd, "Auction not ended");
    require(!auctionEnded, "Auction already ended");
    
    auctionEnded = true;
    // Transfer to highest bidder
}

function claimReward() external {
    // VULNERABLE: Exact timestamp dependency
    require(block.timestamp == rewardTime, "Not reward time");
    // Give reward
}`,
    fixedCode: `uint256 public auctionEndBlock;
bool public auctionEnded = false;
uint256 private constant BLOCK_TIME_TOLERANCE = 15; // 15 seconds

function endAuction() external {
    // Use block numbers instead of timestamps when possible
    require(block.number >= auctionEndBlock, "Auction not ended");
    require(!auctionEnded, "Auction already ended");
    
    auctionEnded = true;
    // Transfer to highest bidder
}

function claimReward() external {
    // Use time ranges instead of exact timestamps
    require(block.timestamp >= rewardStartTime, "Reward period not started");
    require(block.timestamp <= rewardEndTime, "Reward period ended");
    require(!rewardClaimed[msg.sender], "Reward already claimed");
    
    rewardClaimed[msg.sender] = true;
    // Give reward
}

function isWithinTimeWindow(uint256 targetTime, uint256 tolerance) internal view returns (bool) {
    return block.timestamp >= targetTime - tolerance && 
           block.timestamp <= targetTime + tolerance;
}`,
    explanation: 'Use block numbers for precise timing when possible. For timestamps, use ranges rather than exact values and account for miner manipulation (±15 seconds).'
  },
  {
    id: 'oracle-manipulation',
    title: 'Oracle Security and Price Manipulation',
    severity: 'High',
    description: 'Relying on single price oracles or manipulable price sources can lead to significant financial losses.',
    badCode: `uint256 public tokenPrice;
address public priceOracle;

function updatePrice() external {
    // VULNERABLE: Single oracle dependency
    tokenPrice = IPriceOracle(priceOracle).getPrice();
}

function liquidate(address user) external {
    uint256 collateralValue = getCollateralValue(user);
    uint256 debtValue = getDebtValue(user);
    
    // VULNERABLE: Flash loan price manipulation
    require(collateralValue < debtValue * 120 / 100, "Not liquidatable");
    
    // Liquidate user
}`,
    fixedCode: `struct PriceData {
    uint256 price;
    uint256 timestamp;
    uint256 confidence;
}

mapping(address => PriceData) public oraclePrices;
address[] public authorizedOracles;
uint256 public constant MAX_PRICE_AGE = 3600; // 1 hour
uint256 public constant MIN_ORACLES = 3;

function updatePrice(address oracle, uint256 price, uint256 confidence) external {
    require(isAuthorizedOracle(oracle), "Unauthorized oracle");
    require(confidence >= 95, "Low confidence price");
    
    oraclePrices[oracle] = PriceData({
        price: price,
        timestamp: block.timestamp,
        confidence: confidence
    });
}

function getAggregatedPrice() public view returns (uint256) {
    uint256[] memory validPrices = new uint256[](authorizedOracles.length);
    uint256 validCount = 0;
    
    for (uint256 i = 0; i < authorizedOracles.length; i++) {
        PriceData memory data = oraclePrices[authorizedOracles[i]];
        
        // Check price freshness
        if (block.timestamp - data.timestamp <= MAX_PRICE_AGE && data.confidence >= 95) {
            validPrices[validCount] = data.price;
            validCount++;
        }
    }
    
    require(validCount >= MIN_ORACLES, "Insufficient valid oracles");
    
    // Return median price to avoid outliers
    return getMedian(validPrices, validCount);
}

function liquidate(address user) external {
    // Use time-weighted average price to prevent flash loan attacks
    uint256 twapPrice = getTWAP(3600); // 1-hour TWAP
    uint256 collateralValue = getCollateralValue(user, twapPrice);
    uint256 debtValue = getDebtValue(user, twapPrice);
    
    require(collateralValue < debtValue * 120 / 100, "Not liquidatable");
    
    // Additional safety: Check if price moved significantly
    uint256 currentPrice = getAggregatedPrice();
    uint256 priceDeviation = abs(currentPrice - twapPrice) * 100 / twapPrice;
    require(priceDeviation < 10, "Price too volatile for liquidation");
    
    // Liquidate user
}`,
    explanation: 'Use multiple price oracles and aggregate their data. Implement time-weighted average prices (TWAP) to prevent flash loan attacks. Always validate price freshness and confidence levels.'
  },
  {
    id: 'front-running',
    title: 'Front-Running and MEV Protection',
    severity: 'Medium',
    description: 'Front-running attacks exploit transaction ordering to extract value from other users transactions.',
    badCode: `mapping(address => uint256) public bids;
uint256 public highestBid;
address public highestBidder;

function placeBid() external payable {
    // VULNERABLE: Bid amount visible in mempool
    require(msg.value > highestBid, "Bid too low");
    
    // Refund previous bidder
    if (highestBidder != address(0)) {
        payable(highestBidder).transfer(highestBid);
    }
    
    highestBid = msg.value;
    highestBidder = msg.sender;
}

function buyToken(uint256 amount) external {
    // VULNERABLE: Front-running opportunity
    uint256 price = getTokenPrice();
    require(msg.value >= price * amount, "Insufficient payment");
    
    tokens[msg.sender] += amount;
}`,
    fixedCode: `// Commit-Reveal scheme for sealed bids
mapping(address => bytes32) public commitments;
mapping(address => uint256) public bids;
mapping(address => bool) public revealed;
uint256 public commitPhaseEnd;
uint256 public revealPhaseEnd;

function commitBid(bytes32 commitment) external {
    require(block.timestamp < commitPhaseEnd, "Commit phase ended");
    commitments[msg.sender] = commitment;
}

function revealBid(uint256 amount, uint256 nonce) external payable {
    require(block.timestamp >= commitPhaseEnd, "Commit phase not ended");
    require(block.timestamp < revealPhaseEnd, "Reveal phase ended");
    require(!revealed[msg.sender], "Already revealed");
    
    bytes32 hash = keccak256(abi.encodePacked(amount, nonce, msg.sender));
    require(hash == commitments[msg.sender], "Invalid reveal");
    require(msg.value == amount, "Incorrect payment");
    
    bids[msg.sender] = amount;
    revealed[msg.sender] = true;
}

// Batch processing to reduce MEV
struct Order {
    address user;
    uint256 amount;
    uint256 maxPrice;
}

Order[] public pendingOrders;

function submitOrder(uint256 amount, uint256 maxPrice) external {
    pendingOrders.push(Order({
        user: msg.sender,
        amount: amount,
        maxPrice: maxPrice
    }));
}

function processBatch() external onlyOperator {
    uint256 batchPrice = calculateBatchPrice();
    
    for (uint256 i = 0; i < pendingOrders.length; i++) {
        Order memory order = pendingOrders[i];
        if (order.maxPrice >= batchPrice) {
            // Execute order at batch price
            executeOrder(order, batchPrice);
        }
    }
    
    delete pendingOrders;
}`,
    explanation: 'Use commit-reveal schemes for sensitive operations. Implement batch processing to reduce MEV opportunities. Consider using private mempools or time delays for critical functions.'
  },
  {
    id: 'gas-optimization',
    title: 'Gas Optimization and DoS Prevention',
    severity: 'Medium',
    description: 'Inefficient gas usage can lead to denial of service attacks and make contracts unusable.',
    badCode: `address[] public users;
mapping(address => uint256) public balances;

function distributeRewards() external {
    // VULNERABLE: Unbounded loop can cause gas limit DoS
    for (uint256 i = 0; i < users.length; i++) {
        balances[users[i]] += calculateReward(users[i]);
    }
}

function removeUser(address user) external {
    // INEFFICIENT: O(n) operation
    for (uint256 i = 0; i < users.length; i++) {
        if (users[i] == user) {
            for (uint256 j = i; j < users.length - 1; j++) {
                users[j] = users[j + 1];
            }
            users.pop();
            break;
        }
    }
}`,
    fixedCode: `address[] public users;
mapping(address => uint256) public balances;
mapping(address => uint256) public userIndex;
uint256 public lastProcessedIndex;
uint256 public constant BATCH_SIZE = 50;

function distributeRewardsBatch() external {
    uint256 endIndex = lastProcessedIndex + BATCH_SIZE;
    if (endIndex > users.length) {
        endIndex = users.length;
    }
    
    for (uint256 i = lastProcessedIndex; i < endIndex; i++) {
        balances[users[i]] += calculateReward(users[i]);
    }
    
    lastProcessedIndex = endIndex;
    
    // Reset if we've processed all users
    if (lastProcessedIndex >= users.length) {
        lastProcessedIndex = 0;
    }
}

function addUser(address user) external {
    require(userIndex[user] == 0 && users[0] != user, "User already exists");
    
    users.push(user);
    userIndex[user] = users.length - 1;
}

function removeUser(address user) external {
    uint256 index = userIndex[user];
    require(index < users.length && users[index] == user, "User not found");
    
    // Move last element to deleted spot
    address lastUser = users[users.length - 1];
    users[index] = lastUser;
    userIndex[lastUser] = index;
    
    // Remove last element
    users.pop();
    delete userIndex[user];
}

// Gas-efficient storage patterns
struct PackedData {
    uint128 amount;     // Instead of uint256
    uint64 timestamp;   // Instead of uint256
    uint32 category;    // Instead of uint256
    bool active;        // Packed with above
}`,
    explanation: 'Implement batch processing for operations on large datasets. Use efficient data structures and pack struct variables. Always set gas limits and implement circuit breakers for critical functions.'
  },
  {
    id: 'upgrade-security',
    title: 'Secure Contract Upgrades',
    severity: 'Medium',
    description: 'Improper upgrade mechanisms can introduce vulnerabilities or allow unauthorized changes to contract logic.',
    badCode: `contract UpgradeableContract {
    address public implementation;
    address public admin;
    
    function upgrade(address newImplementation) external {
        // VULNERABLE: No access control
        implementation = newImplementation;
    }
    
    function delegateCall(bytes memory data) external returns (bytes memory) {
        // VULNERABLE: Anyone can call arbitrary functions
        (bool success, bytes memory result) = implementation.delegatecall(data);
        require(success, "Delegatecall failed");
        return result;
    }
}`,
    fixedCode: `contract SecureUpgradeableContract {
    address public implementation;
    address public admin;
    address public pendingAdmin;
    uint256 public upgradeDelay = 2 days;
    uint256 public upgradeTimestamp;
    address public pendingImplementation;
    
    mapping(bytes4 => bool) public allowedSelectors;
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    modifier onlyAllowedSelector(bytes4 selector) {
        require(allowedSelectors[selector], "Selector not allowed");
        _;
    }
    
    function proposeUpgrade(address newImplementation) external onlyAdmin {
        require(newImplementation != address(0), "Invalid implementation");
        require(newImplementation != implementation, "Same implementation");
        
        pendingImplementation = newImplementation;
        upgradeTimestamp = block.timestamp + upgradeDelay;
        
        emit UpgradeProposed(newImplementation, upgradeTimestamp);
    }
    
    function executeUpgrade() external onlyAdmin {
        require(pendingImplementation != address(0), "No pending upgrade");
        require(block.timestamp >= upgradeTimestamp, "Upgrade delay not met");
        
        address oldImplementation = implementation;
        implementation = pendingImplementation;
        
        // Clear pending upgrade
        pendingImplementation = address(0);
        upgradeTimestamp = 0;
        
        emit UpgradeExecuted(oldImplementation, implementation);
    }
    
    function cancelUpgrade() external onlyAdmin {
        require(pendingImplementation != address(0), "No pending upgrade");
        
        address cancelled = pendingImplementation;
        pendingImplementation = address(0);
        upgradeTimestamp = 0;
        
        emit UpgradeCancelled(cancelled);
    }
    
    function delegateCall(bytes memory data) external onlyAllowedSelector(bytes4(data)) returns (bytes memory) {
        (bool success, bytes memory result) = implementation.delegatecall(data);
        require(success, "Delegatecall failed");
        return result;
    }
    
    function addAllowedSelector(bytes4 selector) external onlyAdmin {
        allowedSelectors[selector] = true;
    }
    
    // Two-step admin transfer
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin");
        pendingAdmin = newAdmin;
    }
    
    function acceptAdmin() external {
        require(msg.sender == pendingAdmin, "Not pending admin");
        admin = pendingAdmin;
        pendingAdmin = address(0);
    }
}`,
    explanation: 'Implement time delays for upgrades, use multi-signature for critical changes, whitelist allowed function selectors, and implement two-step admin transfers. Always emit events for transparency.'
  }
];