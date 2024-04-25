/* eslint-disable */
const pancakeFactoryAddress = '0x25a55f9f2279A54951133D503490342b50E5cd15';

const pancakePoolAbi = [
  {
    name: 'TokenExchange',
    inputs: [
      { type: 'address', name: 'buyer', indexed: true },
      { type: 'int128', name: 'sold_id', indexed: false },
      { type: 'uint256', name: 'tokens_sold', indexed: false },
      { type: 'int128', name: 'bought_id', indexed: false },
      { type: 'uint256', name: 'tokens_bought', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[3]', name: 'token_amounts', indexed: false },
      { type: 'uint256[3]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'invariant', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[3]', name: 'token_amounts', indexed: false },
      { type: 'uint256[3]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityOne',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256', name: 'token_amount', indexed: false },
      { type: 'uint256', name: 'coin_amount', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityImbalance',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[3]', name: 'token_amounts', indexed: false },
      { type: 'uint256[3]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'invariant', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'CommitNewAdmin',
    inputs: [
      { type: 'uint256', name: 'deadline', indexed: true },
      { type: 'address', name: 'admin', indexed: true }
    ],
    anonymous: false,
    type: 'event'
  },
  { name: 'NewAdmin', inputs: [{ type: 'address', name: 'admin', indexed: true }], anonymous: false, type: 'event' },
  {
    name: 'CommitNewFee',
    inputs: [
      { type: 'uint256', name: 'deadline', indexed: true },
      { type: 'uint256', name: 'fee', indexed: false },
      { type: 'uint256', name: 'admin_fee', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'NewFee',
    inputs: [
      { type: 'uint256', name: 'fee', indexed: false },
      { type: 'uint256', name: 'admin_fee', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RampA',
    inputs: [
      { type: 'uint256', name: 'old_A', indexed: false },
      { type: 'uint256', name: 'new_A', indexed: false },
      { type: 'uint256', name: 'initial_time', indexed: false },
      { type: 'uint256', name: 'future_time', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'StopRampA',
    inputs: [
      { type: 'uint256', name: 'A', indexed: false },
      { type: 'uint256', name: 't', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    outputs: [],
    inputs: [
      { type: 'address', name: '_owner' },
      { type: 'address[3]', name: '_coins' },
      { type: 'address', name: '_pool_token' },
      { type: 'uint256', name: '_A' },
      { type: 'uint256', name: '_fee' },
      { type: 'uint256', name: '_admin_fee' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { name: 'A', outputs: [{ type: 'uint256', name: '' }], inputs: [], stateMutability: 'view', type: 'function' },
  {
    name: 'get_virtual_price',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'calc_token_amount',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'uint256[3]', name: 'amounts' },
      { type: 'bool', name: 'deposit' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'add_liquidity',
    outputs: [],
    inputs: [
      { type: 'uint256[3]', name: 'amounts' },
      { type: 'uint256', name: 'min_mint_amount' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'get_dy',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'get_dy_underlying',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'exchange',
    outputs: [],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' },
      { type: 'uint256', name: 'min_dy' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'remove_liquidity',
    outputs: [],
    inputs: [
      { type: 'uint256', name: '_amount' },
      { type: 'uint256[3]', name: 'min_amounts' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'remove_liquidity_imbalance',
    outputs: [],
    inputs: [
      { type: 'uint256[3]', name: 'amounts' },
      { type: 'uint256', name: 'max_burn_amount' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'calc_withdraw_one_coin',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'uint256', name: '_token_amount' },
      { type: 'int128', name: 'i' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'remove_liquidity_one_coin',
    outputs: [],
    inputs: [
      { type: 'uint256', name: '_token_amount' },
      { type: 'int128', name: 'i' },
      { type: 'uint256', name: 'min_amount' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'ramp_A',
    outputs: [],
    inputs: [
      { type: 'uint256', name: '_future_A' },
      { type: 'uint256', name: '_future_time' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { name: 'stop_ramp_A', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    name: 'commit_new_fee',
    outputs: [],
    inputs: [
      { type: 'uint256', name: 'new_fee' },
      { type: 'uint256', name: 'new_admin_fee' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { name: 'apply_new_fee', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'revert_new_parameters', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    name: 'commit_transfer_ownership',
    outputs: [],
    inputs: [{ type: 'address', name: '_owner' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { name: 'apply_transfer_ownership', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'revert_transfer_ownership', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    name: 'admin_balances',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'uint256', name: 'i' }],
    stateMutability: 'view',
    type: 'function'
  },
  { name: 'withdraw_admin_fees', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'donate_admin_fees', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'kill_me', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'unkill_me', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    name: 'coins',
    outputs: [{ type: 'address', name: '' }],
    inputs: [{ type: 'uint256', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'balances',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'uint256', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function'
  },
  { name: 'fee', outputs: [{ type: 'uint256', name: '' }], inputs: [], stateMutability: 'view', type: 'function' },
  {
    name: 'admin_fee',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  { name: 'owner', outputs: [{ type: 'address', name: '' }], inputs: [], stateMutability: 'view', type: 'function' },
  {
    name: 'initial_A',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  { name: 'future_A', outputs: [{ type: 'uint256', name: '' }], inputs: [], stateMutability: 'view', type: 'function' },
  {
    name: 'initial_A_time',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'future_A_time',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'admin_actions_deadline',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'transfer_ownership_deadline',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'future_fee',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'future_admin_fee',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'future_owner',
    outputs: [{ type: 'address', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  }
];
const erc20Abi = [
  {
    inputs: [{ internalType: 'uint256', name: 'chainId_', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'src', type: 'address' },
      { indexed: true, internalType: 'address', name: 'guy', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: true,
    inputs: [
      { indexed: true, internalType: 'bytes4', name: 'sig', type: 'bytes4' },
      { indexed: true, internalType: 'address', name: 'usr', type: 'address' },
      { indexed: true, internalType: 'bytes32', name: 'arg1', type: 'bytes32' },
      { indexed: true, internalType: 'bytes32', name: 'arg2', type: 'bytes32' },
      { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' }
    ],
    name: 'LogNote',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'src', type: 'address' },
      { indexed: true, internalType: 'address', name: 'dst', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    constant: true,
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'usr', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'usr', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'guy', type: 'address' }],
    name: 'deny',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'usr', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'src', type: 'address' },
      { internalType: 'address', name: 'dst', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'move',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'holder', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
      { internalType: 'uint256', name: 'expiry', type: 'uint256' },
      { internalType: 'bool', name: 'allowed', type: 'bool' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' }
    ],
    name: 'permit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'usr', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'pull',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'usr', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'push',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'guy', type: 'address' }],
    name: 'rely',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'dst', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'src', type: 'address' },
      { internalType: 'address', name: 'dst', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'wards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];
const newParamAbi = [
  {
    name: 'TokenExchange',
    inputs: [
      { type: 'address', name: 'buyer', indexed: true },
      { type: 'int128', name: 'sold_id', indexed: false },
      { type: 'uint256', name: 'tokens_sold', indexed: false },
      { type: 'int128', name: 'bought_id', indexed: false },
      { type: 'uint256', name: 'tokens_bought', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'TokenExchangeUnderlying',
    inputs: [
      { type: 'address', name: 'buyer', indexed: true },
      { type: 'int128', name: 'sold_id', indexed: false },
      { type: 'uint256', name: 'tokens_sold', indexed: false },
      { type: 'int128', name: 'bought_id', indexed: false },
      { type: 'uint256', name: 'tokens_bought', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[4]', name: 'token_amounts', indexed: false },
      { type: 'uint256[4]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'invariant', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[4]', name: 'token_amounts', indexed: false },
      { type: 'uint256[4]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityImbalance',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[4]', name: 'token_amounts', indexed: false },
      { type: 'uint256[4]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'invariant', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'CommitNewAdmin',
    inputs: [
      { type: 'uint256', name: 'deadline', indexed: true, unit: 'sec' },
      { type: 'address', name: 'admin', indexed: true }
    ],
    anonymous: false,
    type: 'event'
  },
  { name: 'NewAdmin', inputs: [{ type: 'address', name: 'admin', indexed: true }], anonymous: false, type: 'event' },
  {
    name: 'CommitNewParameters',
    inputs: [
      { type: 'uint256', name: 'deadline', indexed: true, unit: 'sec' },
      { type: 'uint256', name: 'A', indexed: false },
      { type: 'uint256', name: 'fee', indexed: false },
      { type: 'uint256', name: 'admin_fee', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'NewParameters',
    inputs: [
      { type: 'uint256', name: 'A', indexed: false },
      { type: 'uint256', name: 'fee', indexed: false },
      { type: 'uint256', name: 'admin_fee', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    outputs: [],
    inputs: [
      { type: 'address[4]', name: '_coins' },
      { type: 'address[4]', name: '_underlying_coins' },
      { type: 'address', name: '_pool_token' },
      { type: 'uint256', name: '_A' },
      { type: 'uint256', name: '_fee' }
    ],
    constant: false,
    payable: false,
    type: 'constructor'
  },
  {
    name: 'get_virtual_price',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'calc_token_amount',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'uint256[4]', name: 'amounts' },
      { type: 'bool', name: 'deposit' }
    ],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'add_liquidity',
    outputs: [],
    inputs: [
      { type: 'uint256[4]', name: 'amounts' },
      { type: 'uint256', name: 'min_mint_amount' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  {
    name: 'get_dy',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' }
    ],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'get_dx',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dy' }
    ],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'get_dy_underlying',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' }
    ],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'get_dx_underlying',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dy' }
    ],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'exchange',
    outputs: [],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' },
      { type: 'uint256', name: 'min_dy' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  {
    name: 'exchange_underlying',
    outputs: [],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' },
      { type: 'uint256', name: 'min_dy' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  {
    name: 'remove_liquidity',
    outputs: [],
    inputs: [
      { type: 'uint256', name: '_amount' },
      { type: 'uint256[4]', name: 'min_amounts' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  {
    name: 'remove_liquidity_imbalance',
    outputs: [],
    inputs: [
      { type: 'uint256[4]', name: 'amounts' },
      { type: 'uint256', name: 'max_burn_amount' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  {
    name: 'commit_new_parameters',
    outputs: [],
    inputs: [
      { type: 'uint256', name: 'amplification' },
      { type: 'uint256', name: 'new_fee' },
      { type: 'uint256', name: 'new_admin_fee' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  { name: 'apply_new_parameters', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  { name: 'revert_new_parameters', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  {
    name: 'commit_transfer_ownership',
    outputs: [],
    inputs: [{ type: 'address', name: '_owner' }],
    constant: false,
    payable: false,
    type: 'function'
  },
  { name: 'apply_transfer_ownership', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  { name: 'revert_transfer_ownership', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  { name: 'withdraw_admin_fees', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  { name: 'kill_me', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  { name: 'unkill_me', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  {
    name: 'coins',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [{ type: 'int128', name: 'arg0' }],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'underlying_coins',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [{ type: 'int128', name: 'arg0' }],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'balances',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [{ type: 'int128', name: 'arg0' }],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'A',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'fee',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'admin_fee',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'owner',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'admin_actions_deadline',
    outputs: [{ type: 'uint256', unit: 'sec', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'transfer_ownership_deadline',
    outputs: [{ type: 'uint256', unit: 'sec', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'future_A',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'future_fee',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'future_admin_fee',
    outputs: [{ type: 'uint256', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'future_owner',
    outputs: [{ type: 'address', name: 'out' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  }
];
const rampAGammaAbi = [
  {
    name: 'TokenExchange',
    inputs: [
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'sold_id', type: 'uint256', indexed: false },
      { name: 'tokens_sold', type: 'uint256', indexed: false },
      { name: 'bought_id', type: 'uint256', indexed: false },
      { name: 'tokens_bought', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[2]', indexed: false },
      { name: 'fee', type: 'uint256', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[2]', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityOne',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amount', type: 'uint256', indexed: false },
      { name: 'coin_index', type: 'uint256', indexed: false },
      { name: 'coin_amount', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'CommitNewParameters',
    inputs: [
      { name: 'deadline', type: 'uint256', indexed: true },
      { name: 'admin_fee', type: 'uint256', indexed: false },
      { name: 'mid_fee', type: 'uint256', indexed: false },
      { name: 'out_fee', type: 'uint256', indexed: false },
      { name: 'fee_gamma', type: 'uint256', indexed: false },
      { name: 'allowed_extra_profit', type: 'uint256', indexed: false },
      { name: 'adjustment_step', type: 'uint256', indexed: false },
      { name: 'ma_half_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'NewParameters',
    inputs: [
      { name: 'admin_fee', type: 'uint256', indexed: false },
      { name: 'mid_fee', type: 'uint256', indexed: false },
      { name: 'out_fee', type: 'uint256', indexed: false },
      { name: 'fee_gamma', type: 'uint256', indexed: false },
      { name: 'allowed_extra_profit', type: 'uint256', indexed: false },
      { name: 'adjustment_step', type: 'uint256', indexed: false },
      { name: 'ma_half_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RampAgamma',
    inputs: [
      { name: 'initial_A', type: 'uint256', indexed: false },
      { name: 'future_A', type: 'uint256', indexed: false },
      { name: 'initial_gamma', type: 'uint256', indexed: false },
      { name: 'future_gamma', type: 'uint256', indexed: false },
      { name: 'initial_time', type: 'uint256', indexed: false },
      { name: 'future_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'StopRampA',
    inputs: [
      { name: 'current_A', type: 'uint256', indexed: false },
      { name: 'current_gamma', type: 'uint256', indexed: false },
      { name: 'time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'ClaimAdminFee',
    inputs: [
      { name: 'admin', type: 'address', indexed: true },
      { name: 'tokens', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [{ name: '_weth', type: 'address' }], outputs: [] },
  { stateMutability: 'payable', type: 'fallback' },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange_underlying',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange_underlying',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange_extended',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'sender', type: 'address' },
      { name: 'receiver', type: 'address' },
      { name: 'cb', type: 'bytes32' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: 'amounts', type: 'uint256[2]' },
      { name: 'min_mint_amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: 'amounts', type: 'uint256[2]' },
      { name: 'min_mint_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: 'amounts', type: 'uint256[2]' },
      { name: 'min_mint_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[2]' }
    ],
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[2]' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[2]' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' },
      { name: 'min_amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' },
      { name: 'min_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' },
      { name: 'min_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'claim_admin_fees', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'ramp_A_gamma',
    inputs: [
      { name: 'future_A', type: 'uint256' },
      { name: 'future_gamma', type: 'uint256' },
      { name: 'future_time', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'stop_ramp_A_gamma', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'commit_new_parameters',
    inputs: [
      { name: '_new_mid_fee', type: 'uint256' },
      { name: '_new_out_fee', type: 'uint256' },
      { name: '_new_admin_fee', type: 'uint256' },
      { name: '_new_fee_gamma', type: 'uint256' },
      { name: '_new_allowed_extra_profit', type: 'uint256' },
      { name: '_new_adjustment_step', type: 'uint256' },
      { name: '_new_ma_half_time', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'apply_new_parameters', inputs: [], outputs: [] },
  { stateMutability: 'nonpayable', type: 'function', name: 'revert_new_parameters', inputs: [], outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_dy',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_token_amount',
    inputs: [{ name: 'amounts', type: 'uint256[2]' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_withdraw_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'lp_price', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'A', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'gamma', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_virtual_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'price_oracle',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'initialize',
    inputs: [
      { name: 'A', type: 'uint256' },
      { name: 'gamma', type: 'uint256' },
      { name: 'mid_fee', type: 'uint256' },
      { name: 'out_fee', type: 'uint256' },
      { name: 'allowed_extra_profit', type: 'uint256' },
      { name: 'fee_gamma', type: 'uint256' },
      { name: 'adjustment_step', type: 'uint256' },
      { name: 'admin_fee', type: 'uint256' },
      { name: 'ma_half_time', type: 'uint256' },
      { name: 'initial_price', type: 'uint256' },
      { name: '_token', type: 'address' },
      { name: '_coins', type: 'address[2]' },
      { name: '_precisions', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'view', type: 'function', name: 'token', inputs: [], outputs: [{ name: '', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'coins',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'price_scale',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'last_prices',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'last_prices_timestamp',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initial_A_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_A_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initial_A_gamma_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_A_gamma_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'allowed_extra_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_allowed_extra_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'fee_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_fee_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'adjustment_step',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_adjustment_step',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'ma_half_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_ma_half_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'mid_fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'out_fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_mid_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_out_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_admin_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balances',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'D', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'factory', inputs: [], outputs: [{ name: '', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'xcp_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'xcp_profit_a',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'virtual_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_actions_deadline',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  }
];
const susdpancakePoolAbi = [
  {
    name: 'TokenExchange',
    inputs: [
      { type: 'address', name: 'buyer', indexed: true },
      { type: 'int128', name: 'sold_id', indexed: false },
      { type: 'uint256', name: 'tokens_sold', indexed: false },
      { type: 'int128', name: 'bought_id', indexed: false },
      { type: 'uint256', name: 'tokens_bought', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'TokenExchangeUnderlying',
    inputs: [
      { type: 'address', name: 'buyer', indexed: true },
      { type: 'int128', name: 'sold_id', indexed: false },
      { type: 'uint256', name: 'tokens_sold', indexed: false },
      { type: 'int128', name: 'bought_id', indexed: false },
      { type: 'uint256', name: 'tokens_bought', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[4]', name: 'token_amounts', indexed: false },
      { type: 'uint256[4]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'invariant', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[4]', name: 'token_amounts', indexed: false },
      { type: 'uint256[4]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityImbalance',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[4]', name: 'token_amounts', indexed: false },
      { type: 'uint256[4]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'invariant', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'CommitNewAdmin',
    inputs: [
      { type: 'uint256', name: 'deadline', indexed: true, unit: 'sec' },
      { type: 'address', name: 'admin', indexed: true }
    ],
    anonymous: false,
    type: 'event'
  },
  { name: 'NewAdmin', inputs: [{ type: 'address', name: 'admin', indexed: true }], anonymous: false, type: 'event' },
  {
    name: 'CommitNewParameters',
    inputs: [
      { type: 'uint256', name: 'deadline', indexed: true, unit: 'sec' },
      { type: 'uint256', name: 'A', indexed: false },
      { type: 'uint256', name: 'fee', indexed: false },
      { type: 'uint256', name: 'admin_fee', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'NewParameters',
    inputs: [
      { type: 'uint256', name: 'A', indexed: false },
      { type: 'uint256', name: 'fee', indexed: false },
      { type: 'uint256', name: 'admin_fee', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    outputs: [],
    inputs: [
      { type: 'address[4]', name: '_coins' },
      { type: 'address[4]', name: '_underlying_coins' },
      { type: 'address', name: '_pool_token' },
      { type: 'uint256', name: '_A' },
      { type: 'uint256', name: '_fee' }
    ],
    constant: false,
    payable: false,
    type: 'constructor'
  },
  {
    name: 'get_virtual_price',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'calc_token_amount',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'uint256[4]', name: 'amounts' },
      { type: 'bool', name: 'deposit' }
    ],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'add_liquidity',
    outputs: [],
    inputs: [
      { type: 'uint256[4]', name: 'amounts' },
      { type: 'uint256', name: 'min_mint_amount' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  {
    name: 'get_dy',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' }
    ],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'get_dy_underlying',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' }
    ],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'exchange',
    outputs: [],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' },
      { type: 'uint256', name: 'min_dy' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  {
    name: 'exchange_underlying',
    outputs: [],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' },
      { type: 'uint256', name: 'min_dy' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  {
    name: 'remove_liquidity',
    outputs: [],
    inputs: [
      { type: 'uint256', name: '_amount' },
      { type: 'uint256[4]', name: 'min_amounts' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  {
    name: 'remove_liquidity_imbalance',
    outputs: [],
    inputs: [
      { type: 'uint256[4]', name: 'amounts' },
      { type: 'uint256', name: 'max_burn_amount' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  {
    name: 'commit_new_parameters',
    outputs: [],
    inputs: [
      { type: 'uint256', name: 'amplification' },
      { type: 'uint256', name: 'new_fee' },
      { type: 'uint256', name: 'new_admin_fee' }
    ],
    constant: false,
    payable: false,
    type: 'function'
  },
  { name: 'apply_new_parameters', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  { name: 'revert_new_parameters', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  {
    name: 'commit_transfer_ownership',
    outputs: [],
    inputs: [{ type: 'address', name: '_owner' }],
    constant: false,
    payable: false,
    type: 'function'
  },
  { name: 'apply_transfer_ownership', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  { name: 'revert_transfer_ownership', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  { name: 'withdraw_admin_fees', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  { name: 'kill_me', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  { name: 'unkill_me', outputs: [], inputs: [], constant: false, payable: false, type: 'function' },
  {
    name: 'coins',
    outputs: [{ type: 'address', name: '' }],
    inputs: [{ type: 'int128', name: 'arg0' }],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'underlying_coins',
    outputs: [{ type: 'address', name: '' }],
    inputs: [{ type: 'int128', name: 'arg0' }],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'balances',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'int128', name: 'arg0' }],
    constant: true,
    payable: false,
    type: 'function'
  },
  { name: 'A', outputs: [{ type: 'uint256', name: '' }], inputs: [], constant: true, payable: false, type: 'function' },
  {
    name: 'fee',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'admin_fee',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'owner',
    outputs: [{ type: 'address', name: '' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'admin_actions_deadline',
    outputs: [{ type: 'uint256', unit: 'sec', name: '' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'transfer_ownership_deadline',
    outputs: [{ type: 'uint256', unit: 'sec', name: '' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'future_A',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'future_fee',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'future_admin_fee',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  },
  {
    name: 'future_owner',
    outputs: [{ type: 'address', name: '' }],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function'
  }
];
const stableSwapAbi = [
  {
    name: 'TokenExchange',
    inputs: [
      { type: 'address', name: 'buyer', indexed: true },
      { type: 'int128', name: 'sold_id', indexed: false },
      { type: 'uint256', name: 'tokens_sold', indexed: false },
      { type: 'int128', name: 'bought_id', indexed: false },
      { type: 'uint256', name: 'tokens_bought', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'TokenExchangeUnderlying',
    inputs: [
      { type: 'address', name: 'buyer', indexed: true },
      { type: 'int128', name: 'sold_id', indexed: false },
      { type: 'uint256', name: 'tokens_sold', indexed: false },
      { type: 'int128', name: 'bought_id', indexed: false },
      { type: 'uint256', name: 'tokens_bought', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[2]', name: 'token_amounts', indexed: false },
      { type: 'uint256[2]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'invariant', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[2]', name: 'token_amounts', indexed: false },
      { type: 'uint256[2]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityOne',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256', name: 'token_amount', indexed: false },
      { type: 'uint256', name: 'coin_amount', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityImbalance',
    inputs: [
      { type: 'address', name: 'provider', indexed: true },
      { type: 'uint256[2]', name: 'token_amounts', indexed: false },
      { type: 'uint256[2]', name: 'fees', indexed: false },
      { type: 'uint256', name: 'invariant', indexed: false },
      { type: 'uint256', name: 'token_supply', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'CommitNewAdmin',
    inputs: [
      { type: 'uint256', name: 'deadline', indexed: true },
      { type: 'address', name: 'admin', indexed: true }
    ],
    anonymous: false,
    type: 'event'
  },
  { name: 'NewAdmin', inputs: [{ type: 'address', name: 'admin', indexed: true }], anonymous: false, type: 'event' },
  {
    name: 'CommitNewFee',
    inputs: [
      { type: 'uint256', name: 'deadline', indexed: true },
      { type: 'uint256', name: 'fee', indexed: false },
      { type: 'uint256', name: 'admin_fee', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'NewFee',
    inputs: [
      { type: 'uint256', name: 'fee', indexed: false },
      { type: 'uint256', name: 'admin_fee', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RampA',
    inputs: [
      { type: 'uint256', name: 'old_A', indexed: false },
      { type: 'uint256', name: 'new_A', indexed: false },
      { type: 'uint256', name: 'initial_time', indexed: false },
      { type: 'uint256', name: 'future_time', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'StopRampA',
    inputs: [
      { type: 'uint256', name: 'A', indexed: false },
      { type: 'uint256', name: 't', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    outputs: [],
    inputs: [
      { type: 'address', name: '_owner' },
      { type: 'address[2]', name: '_coins' },
      { type: 'address', name: '_pool_token' },
      { type: 'uint256', name: '_A' },
      { type: 'uint256', name: '_fee' },
      { type: 'uint256', name: '_admin_fee' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { name: 'A', outputs: [{ type: 'uint256', name: '' }], inputs: [], stateMutability: 'view', type: 'function' },
  {
    name: 'A_precise',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'balances',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'uint256', name: 'i' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'get_virtual_price',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'calc_token_amount',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'uint256[2]', name: 'amounts' },
      { type: 'bool', name: 'is_deposit' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'add_liquidity',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'uint256[2]', name: 'amounts' },
      { type: 'uint256', name: 'min_mint_amount' }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    name: 'get_dy',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'exchange',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'int128', name: 'i' },
      { type: 'int128', name: 'j' },
      { type: 'uint256', name: 'dx' },
      { type: 'uint256', name: 'min_dy' }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    name: 'remove_liquidity',
    outputs: [{ type: 'uint256[2]', name: '' }],
    inputs: [
      { type: 'uint256', name: '_amount' },
      { type: 'uint256[2]', name: '_min_amounts' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'remove_liquidity_imbalance',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'uint256[2]', name: '_amounts' },
      { type: 'uint256', name: '_max_burn_amount' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'calc_withdraw_one_coin',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'uint256', name: '_token_amount' },
      { type: 'int128', name: 'i' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'remove_liquidity_one_coin',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [
      { type: 'uint256', name: '_token_amount' },
      { type: 'int128', name: 'i' },
      { type: 'uint256', name: '_min_amount' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    name: 'ramp_A',
    outputs: [],
    inputs: [
      { type: 'uint256', name: '_future_A' },
      { type: 'uint256', name: '_future_time' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { name: 'stop_ramp_A', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    name: 'commit_new_fee',
    outputs: [],
    inputs: [
      { type: 'uint256', name: 'new_fee' },
      { type: 'uint256', name: 'new_admin_fee' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { name: 'apply_new_fee', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'revert_new_parameters', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    name: 'commit_transfer_ownership',
    outputs: [],
    inputs: [{ type: 'address', name: '_owner' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { name: 'apply_transfer_ownership', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'revert_transfer_ownership', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'withdraw_admin_fees', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'donate_admin_fees', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'kill_me', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  { name: 'unkill_me', outputs: [], inputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    name: 'coins',
    outputs: [{ type: 'address', name: '' }],
    inputs: [{ type: 'uint256', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'admin_balances',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [{ type: 'uint256', name: 'arg0' }],
    stateMutability: 'view',
    type: 'function'
  },
  { name: 'fee', outputs: [{ type: 'uint256', name: '' }], inputs: [], stateMutability: 'view', type: 'function' },
  {
    name: 'admin_fee',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  { name: 'owner', outputs: [{ type: 'address', name: '' }], inputs: [], stateMutability: 'view', type: 'function' },
  { name: 'lp_token', outputs: [{ type: 'address', name: '' }], inputs: [], stateMutability: 'view', type: 'function' },
  {
    name: 'initial_A',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  { name: 'future_A', outputs: [{ type: 'uint256', name: '' }], inputs: [], stateMutability: 'view', type: 'function' },
  {
    name: 'initial_A_time',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'future_A_time',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'admin_actions_deadline',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'transfer_ownership_deadline',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'future_fee',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'future_admin_fee',
    outputs: [{ type: 'uint256', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  },
  {
    name: 'future_owner',
    outputs: [{ type: 'address', name: '' }],
    inputs: [],
    stateMutability: 'view',
    type: 'function'
  }
];
const triCryptov2Abi = [
  {
    name: 'TokenExchange',
    inputs: [
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'sold_id', type: 'uint256', indexed: false },
      { name: 'tokens_sold', type: 'uint256', indexed: false },
      { name: 'bought_id', type: 'uint256', indexed: false },
      { name: 'tokens_bought', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[3]', indexed: false },
      { name: 'fee', type: 'uint256', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[3]', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityOne',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amount', type: 'uint256', indexed: false },
      { name: 'coin_index', type: 'uint256', indexed: false },
      { name: 'coin_amount', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'CommitNewAdmin',
    inputs: [
      { name: 'deadline', type: 'uint256', indexed: true },
      { name: 'admin', type: 'address', indexed: true }
    ],
    anonymous: false,
    type: 'event'
  },
  { name: 'NewAdmin', inputs: [{ name: 'admin', type: 'address', indexed: true }], anonymous: false, type: 'event' },
  {
    name: 'CommitNewParameters',
    inputs: [
      { name: 'deadline', type: 'uint256', indexed: true },
      { name: 'admin_fee', type: 'uint256', indexed: false },
      { name: 'mid_fee', type: 'uint256', indexed: false },
      { name: 'out_fee', type: 'uint256', indexed: false },
      { name: 'fee_gamma', type: 'uint256', indexed: false },
      { name: 'allowed_extra_profit', type: 'uint256', indexed: false },
      { name: 'adjustment_step', type: 'uint256', indexed: false },
      { name: 'ma_half_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'NewParameters',
    inputs: [
      { name: 'admin_fee', type: 'uint256', indexed: false },
      { name: 'mid_fee', type: 'uint256', indexed: false },
      { name: 'out_fee', type: 'uint256', indexed: false },
      { name: 'fee_gamma', type: 'uint256', indexed: false },
      { name: 'allowed_extra_profit', type: 'uint256', indexed: false },
      { name: 'adjustment_step', type: 'uint256', indexed: false },
      { name: 'ma_half_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RampAgamma',
    inputs: [
      { name: 'initial_A', type: 'uint256', indexed: false },
      { name: 'future_A', type: 'uint256', indexed: false },
      { name: 'initial_gamma', type: 'uint256', indexed: false },
      { name: 'future_gamma', type: 'uint256', indexed: false },
      { name: 'initial_time', type: 'uint256', indexed: false },
      { name: 'future_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'StopRampA',
    inputs: [
      { name: 'current_A', type: 'uint256', indexed: false },
      { name: 'current_gamma', type: 'uint256', indexed: false },
      { name: 'time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'ClaimAdminFee',
    inputs: [
      { name: 'admin', type: 'address', indexed: true },
      { name: 'tokens', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'admin_fee_receiver', type: 'address' },
      { name: 'A', type: 'uint256' },
      { name: 'gamma', type: 'uint256' },
      { name: 'mid_fee', type: 'uint256' },
      { name: 'out_fee', type: 'uint256' },
      { name: 'allowed_extra_profit', type: 'uint256' },
      { name: 'fee_gamma', type: 'uint256' },
      { name: 'adjustment_step', type: 'uint256' },
      { name: 'admin_fee', type: 'uint256' },
      { name: 'ma_half_time', type: 'uint256' },
      { name: 'initial_prices', type: 'uint256[2]' }
    ],
    outputs: []
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'price_oracle',
    inputs: [{ name: 'k', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'price_scale',
    inputs: [{ name: 'k', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'last_prices',
    inputs: [{ name: 'k', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'token', inputs: [], outputs: [{ name: '', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'coins',
    inputs: [{ name: 'i', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }]
  },
  { stateMutability: 'view', type: 'function', name: 'A', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'gamma', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'fee_calc',
    inputs: [{ name: 'xp', type: 'uint256[3]' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_virtual_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' }
    ],
    outputs: []
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_dy',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_token_fee',
    inputs: [
      { name: 'amounts', type: 'uint256[3]' },
      { name: 'xp', type: 'uint256[3]' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: 'amounts', type: 'uint256[3]' },
      { name: 'min_mint_amount', type: 'uint256' }
    ],
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[3]' }
    ],
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_token_amount',
    inputs: [
      { name: 'amounts', type: 'uint256[3]' },
      { name: 'deposit', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_withdraw_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' },
      { name: 'min_amount', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'claim_admin_fees', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'ramp_A_gamma',
    inputs: [
      { name: 'future_A', type: 'uint256' },
      { name: 'future_gamma', type: 'uint256' },
      { name: 'future_time', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'stop_ramp_A_gamma', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'commit_new_parameters',
    inputs: [
      { name: '_new_mid_fee', type: 'uint256' },
      { name: '_new_out_fee', type: 'uint256' },
      { name: '_new_admin_fee', type: 'uint256' },
      { name: '_new_fee_gamma', type: 'uint256' },
      { name: '_new_allowed_extra_profit', type: 'uint256' },
      { name: '_new_adjustment_step', type: 'uint256' },
      { name: '_new_ma_half_time', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'apply_new_parameters', inputs: [], outputs: [] },
  { stateMutability: 'nonpayable', type: 'function', name: 'revert_new_parameters', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'commit_transfer_ownership',
    inputs: [{ name: '_owner', type: 'address' }],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'apply_transfer_ownership', inputs: [], outputs: [] },
  { stateMutability: 'nonpayable', type: 'function', name: 'revert_transfer_ownership', inputs: [], outputs: [] },
  { stateMutability: 'nonpayable', type: 'function', name: 'kill_me', inputs: [], outputs: [] },
  { stateMutability: 'nonpayable', type: 'function', name: 'unkill_me', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'set_admin_fee_receiver',
    inputs: [{ name: '_admin_fee_receiver', type: 'address' }],
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'last_prices_timestamp',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initial_A_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_A_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initial_A_gamma_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_A_gamma_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'allowed_extra_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_allowed_extra_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'fee_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_fee_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'adjustment_step',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_adjustment_step',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'ma_half_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_ma_half_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'mid_fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'out_fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_mid_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_out_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_admin_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balances',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'D', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'owner', inputs: [], outputs: [{ name: '', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_owner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'xcp_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'xcp_profit_a',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'virtual_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'is_killed', inputs: [], outputs: [{ name: '', type: 'bool' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'kill_deadline',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'transfer_ownership_deadline',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_actions_deadline',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_fee_receiver',
    inputs: [],
    outputs: [{ name: '', type: 'address' }]
  }
];
const cryptov2Abi = [
  {
    name: 'TokenExchange',
    inputs: [
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'sold_id', type: 'uint256', indexed: false },
      { name: 'tokens_sold', type: 'uint256', indexed: false },
      { name: 'bought_id', type: 'uint256', indexed: false },
      { name: 'tokens_bought', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[2]', indexed: false },
      { name: 'fee', type: 'uint256', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[2]', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityOne',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amount', type: 'uint256', indexed: false },
      { name: 'coin_index', type: 'uint256', indexed: false },
      { name: 'coin_amount', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'CommitNewParameters',
    inputs: [
      { name: 'deadline', type: 'uint256', indexed: true },
      { name: 'admin_fee', type: 'uint256', indexed: false },
      { name: 'mid_fee', type: 'uint256', indexed: false },
      { name: 'out_fee', type: 'uint256', indexed: false },
      { name: 'fee_gamma', type: 'uint256', indexed: false },
      { name: 'allowed_extra_profit', type: 'uint256', indexed: false },
      { name: 'adjustment_step', type: 'uint256', indexed: false },
      { name: 'ma_half_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'NewParameters',
    inputs: [
      { name: 'admin_fee', type: 'uint256', indexed: false },
      { name: 'mid_fee', type: 'uint256', indexed: false },
      { name: 'out_fee', type: 'uint256', indexed: false },
      { name: 'fee_gamma', type: 'uint256', indexed: false },
      { name: 'allowed_extra_profit', type: 'uint256', indexed: false },
      { name: 'adjustment_step', type: 'uint256', indexed: false },
      { name: 'ma_half_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RampAgamma',
    inputs: [
      { name: 'initial_A', type: 'uint256', indexed: false },
      { name: 'future_A', type: 'uint256', indexed: false },
      { name: 'initial_gamma', type: 'uint256', indexed: false },
      { name: 'future_gamma', type: 'uint256', indexed: false },
      { name: 'initial_time', type: 'uint256', indexed: false },
      { name: 'future_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'StopRampA',
    inputs: [
      { name: 'current_A', type: 'uint256', indexed: false },
      { name: 'current_gamma', type: 'uint256', indexed: false },
      { name: 'time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'ClaimAdminFee',
    inputs: [
      { name: 'admin', type: 'address', indexed: true },
      { name: 'tokens', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [{ name: '_weth', type: 'address' }], outputs: [] },
  { stateMutability: 'payable', type: 'fallback' },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange_underlying',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange_underlying',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange_extended',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'sender', type: 'address' },
      { name: 'receiver', type: 'address' },
      { name: 'cb', type: 'bytes32' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: 'amounts', type: 'uint256[2]' },
      { name: 'min_mint_amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: 'amounts', type: 'uint256[2]' },
      { name: 'min_mint_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: 'amounts', type: 'uint256[2]' },
      { name: 'min_mint_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[2]' }
    ],
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[2]' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[2]' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' },
      { name: 'min_amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' },
      { name: 'min_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' },
      { name: 'min_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'claim_admin_fees', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'ramp_A_gamma',
    inputs: [
      { name: 'future_A', type: 'uint256' },
      { name: 'future_gamma', type: 'uint256' },
      { name: 'future_time', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'stop_ramp_A_gamma', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'commit_new_parameters',
    inputs: [
      { name: '_new_mid_fee', type: 'uint256' },
      { name: '_new_out_fee', type: 'uint256' },
      { name: '_new_admin_fee', type: 'uint256' },
      { name: '_new_fee_gamma', type: 'uint256' },
      { name: '_new_allowed_extra_profit', type: 'uint256' },
      { name: '_new_adjustment_step', type: 'uint256' },
      { name: '_new_ma_half_time', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'apply_new_parameters', inputs: [], outputs: [] },
  { stateMutability: 'nonpayable', type: 'function', name: 'revert_new_parameters', inputs: [], outputs: [] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_dy',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_token_amount',
    inputs: [{ name: 'amounts', type: 'uint256[2]' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_withdraw_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'lp_price', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'A', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'gamma', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_virtual_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'price_oracle',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'initialize',
    inputs: [
      { name: 'A', type: 'uint256' },
      { name: 'gamma', type: 'uint256' },
      { name: 'mid_fee', type: 'uint256' },
      { name: 'out_fee', type: 'uint256' },
      { name: 'allowed_extra_profit', type: 'uint256' },
      { name: 'fee_gamma', type: 'uint256' },
      { name: 'adjustment_step', type: 'uint256' },
      { name: 'admin_fee', type: 'uint256' },
      { name: 'ma_half_time', type: 'uint256' },
      { name: 'initial_price', type: 'uint256' },
      { name: '_token', type: 'address' },
      { name: '_coins', type: 'address[2]' },
      { name: '_precisions', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'view', type: 'function', name: 'token', inputs: [], outputs: [{ name: '', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'coins',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'price_scale',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'last_prices',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'last_prices_timestamp',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initial_A_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_A_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initial_A_gamma_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_A_gamma_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'allowed_extra_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_allowed_extra_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'fee_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_fee_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'adjustment_step',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_adjustment_step',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'ma_half_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_ma_half_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'mid_fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'out_fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_mid_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_out_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_admin_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balances',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'D', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'factory', inputs: [], outputs: [{ name: '', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'xcp_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'xcp_profit_a',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'virtual_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_actions_deadline',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  }
];
const tricryptoFactoryAbi = [
  {
    name: 'Transfer',
    inputs: [
      { name: 'sender', type: 'address', indexed: true },
      { name: 'receiver', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'Approval',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'TokenExchange',
    inputs: [
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'sold_id', type: 'uint256', indexed: false },
      { name: 'tokens_sold', type: 'uint256', indexed: false },
      { name: 'bought_id', type: 'uint256', indexed: false },
      { name: 'tokens_bought', type: 'uint256', indexed: false },
      { name: 'fee', type: 'uint256', indexed: false },
      { name: 'packed_price_scale', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[3]', indexed: false },
      { name: 'fee', type: 'uint256', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false },
      { name: 'packed_price_scale', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[3]', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityOne',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amount', type: 'uint256', indexed: false },
      { name: 'coin_index', type: 'uint256', indexed: false },
      { name: 'coin_amount', type: 'uint256', indexed: false },
      { name: 'approx_fee', type: 'uint256', indexed: false },
      { name: 'packed_price_scale', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'CommitNewParameters',
    inputs: [
      { name: 'deadline', type: 'uint256', indexed: true },
      { name: 'mid_fee', type: 'uint256', indexed: false },
      { name: 'out_fee', type: 'uint256', indexed: false },
      { name: 'fee_gamma', type: 'uint256', indexed: false },
      { name: 'allowed_extra_profit', type: 'uint256', indexed: false },
      { name: 'adjustment_step', type: 'uint256', indexed: false },
      { name: 'ma_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'NewParameters',
    inputs: [
      { name: 'mid_fee', type: 'uint256', indexed: false },
      { name: 'out_fee', type: 'uint256', indexed: false },
      { name: 'fee_gamma', type: 'uint256', indexed: false },
      { name: 'allowed_extra_profit', type: 'uint256', indexed: false },
      { name: 'adjustment_step', type: 'uint256', indexed: false },
      { name: 'ma_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RampAgamma',
    inputs: [
      { name: 'initial_A', type: 'uint256', indexed: false },
      { name: 'future_A', type: 'uint256', indexed: false },
      { name: 'initial_gamma', type: 'uint256', indexed: false },
      { name: 'future_gamma', type: 'uint256', indexed: false },
      { name: 'initial_time', type: 'uint256', indexed: false },
      { name: 'future_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'StopRampA',
    inputs: [
      { name: 'current_A', type: 'uint256', indexed: false },
      { name: 'current_gamma', type: 'uint256', indexed: false },
      { name: 'time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'ClaimAdminFee',
    inputs: [
      { name: 'admin', type: 'address', indexed: true },
      { name: 'tokens', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_symbol', type: 'string' },
      { name: '_coins', type: 'address[3]' },
      { name: '_math', type: 'address' },
      { name: '_weth', type: 'address' },
      { name: '_salt', type: 'bytes32' },
      { name: 'packed_precisions', type: 'uint256' },
      { name: 'packed_A_gamma', type: 'uint256' },
      { name: 'packed_fee_params', type: 'uint256' },
      { name: 'packed_rebalancing_params', type: 'uint256' },
      { name: 'packed_prices', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange_underlying',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange_underlying',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'exchange_extended',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' },
      { name: 'min_dy', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'sender', type: 'address' },
      { name: 'receiver', type: 'address' },
      { name: 'cb', type: 'bytes32' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: 'amounts', type: 'uint256[3]' },
      { name: 'min_mint_amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: 'amounts', type: 'uint256[3]' },
      { name: 'min_mint_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: 'amounts', type: 'uint256[3]' },
      { name: 'min_mint_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[3]' }
    ],
    outputs: [{ name: '', type: 'uint256[3]' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[3]' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256[3]' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[3]' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256[3]' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: 'min_amounts', type: 'uint256[3]' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' },
      { name: 'claim_admin_fees', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256[3]' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' },
      { name: 'min_amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' },
      { name: 'min_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' },
      { name: 'min_amount', type: 'uint256' },
      { name: 'use_eth', type: 'bool' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'claim_admin_fees', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'transferFrom',
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'approve',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'increaseAllowance',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_add_value', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'decreaseAllowance',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_sub_value', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'permit',
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
      { name: '_deadline', type: 'uint256' },
      { name: '_v', type: 'uint8' },
      { name: '_r', type: 'bytes32' },
      { name: '_s', type: 'bytes32' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'fee_receiver',
    inputs: [],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_token_amount',
    inputs: [
      { name: 'amounts', type: 'uint256[3]' },
      { name: 'deposit', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_dy',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dx', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_dx',
    inputs: [
      { name: 'i', type: 'uint256' },
      { name: 'j', type: 'uint256' },
      { name: 'dy', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'lp_price', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_virtual_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'price_oracle',
    inputs: [{ name: 'k', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'last_prices',
    inputs: [{ name: 'k', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'price_scale',
    inputs: [{ name: 'k', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_withdraw_one_coin',
    inputs: [
      { name: 'token_amount', type: 'uint256' },
      { name: 'i', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_token_fee',
    inputs: [
      { name: 'amounts', type: 'uint256[3]' },
      { name: 'xp', type: 'uint256[3]' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'A', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'gamma', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'mid_fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { stateMutability: 'view', type: 'function', name: 'out_fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'fee_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'allowed_extra_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'adjustment_step',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'ma_time', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'precisions',
    inputs: [],
    outputs: [{ name: '', type: 'uint256[3]' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'fee_calc',
    inputs: [{ name: 'xp', type: 'uint256[3]' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'DOMAIN_SEPARATOR',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'ramp_A_gamma',
    inputs: [
      { name: 'future_A', type: 'uint256' },
      { name: 'future_gamma', type: 'uint256' },
      { name: 'future_time', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'stop_ramp_A_gamma', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'commit_new_parameters',
    inputs: [
      { name: '_new_mid_fee', type: 'uint256' },
      { name: '_new_out_fee', type: 'uint256' },
      { name: '_new_fee_gamma', type: 'uint256' },
      { name: '_new_allowed_extra_profit', type: 'uint256' },
      { name: '_new_adjustment_step', type: 'uint256' },
      { name: '_new_ma_time', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'apply_new_parameters', inputs: [], outputs: [] },
  { stateMutability: 'nonpayable', type: 'function', name: 'revert_new_parameters', inputs: [], outputs: [] },
  { stateMutability: 'view', type: 'function', name: 'WETH20', inputs: [], outputs: [{ name: '', type: 'address' }] },
  { stateMutability: 'view', type: 'function', name: 'MATH', inputs: [], outputs: [{ name: '', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'coins',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }]
  },
  { stateMutability: 'view', type: 'function', name: 'factory', inputs: [], outputs: [{ name: '', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'last_prices_timestamp',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initial_A_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initial_A_gamma_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_A_gamma',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_A_gamma_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balances',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'D', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'xcp_profit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'xcp_profit_a',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'virtual_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'packed_rebalancing_params',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'packed_fee_params',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'ADMIN_FEE',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_actions_deadline',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'name', inputs: [], outputs: [{ name: '', type: 'string' }] },
  { stateMutability: 'view', type: 'function', name: 'symbol', inputs: [], outputs: [{ name: '', type: 'string' }] },
  { stateMutability: 'view', type: 'function', name: 'decimals', inputs: [], outputs: [{ name: '', type: 'uint8' }] },
  { stateMutability: 'view', type: 'function', name: 'version', inputs: [], outputs: [{ name: '', type: 'string' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'arg0', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'arg0', type: 'address' },
      { name: 'arg1', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'nonces',
    inputs: [{ name: 'arg0', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'salt', inputs: [], outputs: [{ name: '', type: 'bytes32' }] }
];
const stableSwapFactoryAbi = [
  {
    name: 'Transfer',
    inputs: [
      { name: 'sender', type: 'address', indexed: true },
      { name: 'receiver', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'Approval',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'TokenExchange',
    inputs: [
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'sold_id', type: 'int128', indexed: false },
      { name: 'tokens_sold', type: 'uint256', indexed: false },
      { name: 'bought_id', type: 'int128', indexed: false },
      { name: 'tokens_bought', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[2]', indexed: false },
      { name: 'fees', type: 'uint256[2]', indexed: false },
      { name: 'invariant', type: 'uint256', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[2]', indexed: false },
      { name: 'fees', type: 'uint256[2]', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityOne',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amount', type: 'uint256', indexed: false },
      { name: 'coin_amount', type: 'uint256', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidityImbalance',
    inputs: [
      { name: 'provider', type: 'address', indexed: true },
      { name: 'token_amounts', type: 'uint256[2]', indexed: false },
      { name: 'fees', type: 'uint256[2]', indexed: false },
      { name: 'invariant', type: 'uint256', indexed: false },
      { name: 'token_supply', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RampA',
    inputs: [
      { name: 'old_A', type: 'uint256', indexed: false },
      { name: 'new_A', type: 'uint256', indexed: false },
      { name: 'initial_time', type: 'uint256', indexed: false },
      { name: 'future_time', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'StopRampA',
    inputs: [
      { name: 'A', type: 'uint256', indexed: false },
      { name: 't', type: 'uint256', indexed: false }
    ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'CommitNewFee',
    inputs: [{ name: 'new_fee', type: 'uint256', indexed: false }],
    anonymous: false,
    type: 'event'
  },
  { name: 'ApplyNewFee', inputs: [{ name: 'fee', type: 'uint256', indexed: false }], anonymous: false, type: 'event' },
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'initialize',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_symbol', type: 'string' },
      { name: '_coins', type: 'address[4]' },
      { name: '_rate_multipliers', type: 'uint256[4]' },
      { name: '_A', type: 'uint256' },
      { name: '_fee', type: 'uint256' }
    ],
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'transferFrom',
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'approve',
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'permit',
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
      { name: '_deadline', type: 'uint256' },
      { name: '_v', type: 'uint8' },
      { name: '_r', type: 'bytes32' },
      { name: '_s', type: 'bytes32' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'last_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'ema_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'stored_rates',
    inputs: [],
    outputs: [{ name: '', type: 'uint256[2]' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balances',
    inputs: [{ name: 'i', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'A', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'A_precise',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'get_p', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'price_oracle',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_virtual_price',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_token_amount',
    inputs: [
      { name: '_amounts', type: 'uint256[2]' },
      { name: '_is_deposit', type: 'bool' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: '_amounts', type: 'uint256[2]' },
      { name: '_min_mint_amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'add_liquidity',
    inputs: [
      { name: '_amounts', type: 'uint256[2]' },
      { name: '_min_mint_amount', type: 'uint256' },
      { name: '_receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'get_dy',
    inputs: [
      { name: 'i', type: 'int128' },
      { name: 'j', type: 'int128' },
      { name: 'dx', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'int128' },
      { name: 'j', type: 'int128' },
      { name: '_dx', type: 'uint256' },
      { name: '_min_dy', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    name: 'exchange',
    inputs: [
      { name: 'i', type: 'int128' },
      { name: 'j', type: 'int128' },
      { name: '_dx', type: 'uint256' },
      { name: '_min_dy', type: 'uint256' },
      { name: '_receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_burn_amount', type: 'uint256' },
      { name: '_min_amounts', type: 'uint256[2]' }
    ],
    outputs: [{ name: '', type: 'uint256[2]' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity',
    inputs: [
      { name: '_burn_amount', type: 'uint256' },
      { name: '_min_amounts', type: 'uint256[2]' },
      { name: '_receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256[2]' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_imbalance',
    inputs: [
      { name: '_amounts', type: 'uint256[2]' },
      { name: '_max_burn_amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_imbalance',
    inputs: [
      { name: '_amounts', type: 'uint256[2]' },
      { name: '_max_burn_amount', type: 'uint256' },
      { name: '_receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'calc_withdraw_one_coin',
    inputs: [
      { name: '_burn_amount', type: 'uint256' },
      { name: 'i', type: 'int128' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: '_burn_amount', type: 'uint256' },
      { name: 'i', type: 'int128' },
      { name: '_min_received', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'remove_liquidity_one_coin',
    inputs: [
      { name: '_burn_amount', type: 'uint256' },
      { name: 'i', type: 'int128' },
      { name: '_min_received', type: 'uint256' },
      { name: '_receiver', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'ramp_A',
    inputs: [
      { name: '_future_A', type: 'uint256' },
      { name: '_future_time', type: 'uint256' }
    ],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'stop_ramp_A', inputs: [], outputs: [] },
  { stateMutability: 'nonpayable', type: 'function', name: 'withdraw_admin_fees', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'commit_new_fee',
    inputs: [{ name: '_new_fee', type: 'uint256' }],
    outputs: []
  },
  { stateMutability: 'nonpayable', type: 'function', name: 'apply_new_fee', inputs: [], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'set_ma_exp_time',
    inputs: [{ name: '_ma_exp_time', type: 'uint256' }],
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'set_oracle',
    inputs: [
      { name: '_method_id', type: 'bytes4' },
      { name: '_oracle', type: 'address' }
    ],
    outputs: []
  },
  { stateMutability: 'view', type: 'function', name: 'version', inputs: [], outputs: [{ name: '', type: 'string' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'coins',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_balances',
    inputs: [{ name: 'arg0', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'fee', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_fee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'admin_action_deadline',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initial_A',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'future_A', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'initial_A_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'future_A_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'oracle_method',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'name', inputs: [], outputs: [{ name: '', type: 'string' }] },
  { stateMutability: 'view', type: 'function', name: 'symbol', inputs: [], outputs: [{ name: '', type: 'string' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'arg0', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'arg0', type: 'address' },
      { name: 'arg1', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  { stateMutability: 'view', type: 'function', name: 'decimals', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'DOMAIN_SEPARATOR',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'nonces',
    inputs: [{ name: 'arg0', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'ma_exp_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'ma_last_time',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  }
];

const pancakeStableSwapTwoPoolAbi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'provider', type: 'address' },
      { indexed: false, internalType: 'uint256[2]', name: 'token_amounts', type: 'uint256[2]' },
      { indexed: false, internalType: 'uint256[2]', name: 'fees', type: 'uint256[2]' },
      { indexed: false, internalType: 'uint256', name: 'invariant', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'token_supply', type: 'uint256' }
    ],
    name: 'AddLiquidity',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'admin_fee', type: 'uint256' }
    ],
    name: 'CommitNewFee',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'DonateAdminFees', type: 'event' },
  { anonymous: false, inputs: [], name: 'Kill', type: 'event' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'admin_fee', type: 'uint256' }
    ],
    name: 'NewFee',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'old_A', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'new_A', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'initial_time', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'future_time', type: 'uint256' }
    ],
    name: 'RampA',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'provider', type: 'address' },
      { indexed: false, internalType: 'uint256[2]', name: 'token_amounts', type: 'uint256[2]' },
      { indexed: false, internalType: 'uint256[2]', name: 'fees', type: 'uint256[2]' },
      { indexed: false, internalType: 'uint256', name: 'token_supply', type: 'uint256' }
    ],
    name: 'RemoveLiquidity',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'provider', type: 'address' },
      { indexed: false, internalType: 'uint256[2]', name: 'token_amounts', type: 'uint256[2]' },
      { indexed: false, internalType: 'uint256[2]', name: 'fees', type: 'uint256[2]' },
      { indexed: false, internalType: 'uint256', name: 'invariant', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'token_supply', type: 'uint256' }
    ],
    name: 'RemoveLiquidityImbalance',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'provider', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'index', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'token_amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'coin_amount', type: 'uint256' }
    ],
    name: 'RemoveLiquidityOne',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'RevertParameters', type: 'event' },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint256', name: 'bnb_gas', type: 'uint256' }],
    name: 'SetBNBGas',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'A', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 't', type: 'uint256' }
    ],
    name: 'StopRampA',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'sold_id', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'tokens_sold', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'bought_id', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'tokens_bought', type: 'uint256' }
    ],
    name: 'TokenExchange',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'Unkill', type: 'event' },
  {
    inputs: [],
    name: 'A',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ADMIN_ACTIONS_DELAY',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'FEE_DENOMINATOR',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'KILL_DEADLINE_DT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_A',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_ADMIN_FEE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_A_CHANGE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_BNB_GAS',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_DECIMAL',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MAX_FEE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MIN_BNB_GAS',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MIN_RAMP_TIME',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'N_COINS',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'PRECISION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'PRECISION_MUL',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'RATES',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'STABLESWAP_FACTORY',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256[2]', name: 'amounts', type: 'uint256[2]' },
      { internalType: 'uint256', name: 'min_mint_amount', type: 'uint256' }
    ],
    name: 'add_liquidity',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'admin_actions_deadline',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'i', type: 'uint256' }],
    name: 'admin_balances',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'admin_fee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'apply_new_fee', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'balances',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'bnb_gas',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256[2]', name: 'amounts', type: 'uint256[2]' },
      { internalType: 'bool', name: 'deposit', type: 'bool' }
    ],
    name: 'calc_token_amount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_token_amount', type: 'uint256' },
      { internalType: 'uint256', name: 'i', type: 'uint256' }
    ],
    name: 'calc_withdraw_one_coin',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'coins',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'new_fee', type: 'uint256' },
      { internalType: 'uint256', name: 'new_admin_fee', type: 'uint256' }
    ],
    name: 'commit_new_fee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { inputs: [], name: 'donate_admin_fees', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'uint256', name: 'i', type: 'uint256' },
      { internalType: 'uint256', name: 'j', type: 'uint256' },
      { internalType: 'uint256', name: 'dx', type: 'uint256' },
      { internalType: 'uint256', name: 'min_dy', type: 'uint256' }
    ],
    name: 'exchange',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'fee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'future_A',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'future_A_time',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'future_admin_fee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'future_fee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'i', type: 'uint256' },
      { internalType: 'uint256', name: 'j', type: 'uint256' },
      { internalType: 'uint256', name: 'dx', type: 'uint256' }
    ],
    name: 'get_dy',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'i', type: 'uint256' },
      { internalType: 'uint256', name: 'j', type: 'uint256' },
      { internalType: 'uint256', name: 'dx', type: 'uint256' }
    ],
    name: 'get_dy_underlying',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'get_virtual_price',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'initial_A',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'initial_A_time',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address[2]', name: '_coins', type: 'address[2]' },
      { internalType: 'uint256', name: '_A', type: 'uint256' },
      { internalType: 'uint256', name: '_fee', type: 'uint256' },
      { internalType: 'uint256', name: '_admin_fee', type: 'uint256' },
      { internalType: 'address', name: '_owner', type: 'address' },
      { internalType: 'address', name: '_LP', type: 'address' }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'isInitialized',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'is_killed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'kill_deadline',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'kill_me', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_future_A', type: 'uint256' },
      { internalType: 'uint256', name: '_future_time', type: 'uint256' }
    ],
    name: 'ramp_A',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256[2]', name: 'min_amounts', type: 'uint256[2]' }
    ],
    name: 'remove_liquidity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256[2]', name: 'amounts', type: 'uint256[2]' },
      { internalType: 'uint256', name: 'max_burn_amount', type: 'uint256' }
    ],
    name: 'remove_liquidity_imbalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_token_amount', type: 'uint256' },
      { internalType: 'uint256', name: 'i', type: 'uint256' },
      { internalType: 'uint256', name: 'min_amount', type: 'uint256' }
    ],
    name: 'remove_liquidity_one_coin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'revert_new_parameters', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: '_bnb_gas', type: 'uint256' }],
    name: 'set_bnb_gas',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { inputs: [], name: 'stop_rampget_A', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'contract IPancakeStableSwapLP', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { inputs: [], name: 'unkill_me', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'withdraw_admin_fees', outputs: [], stateMutability: 'nonpayable', type: 'function' }
];

// lisUSD/USDT (lisUSD/USDC) (lisUSD/DAI) USDT/USDC DAI/USDC DAI/USDT
const pancakePairs = [
  {
    poolAddress: '0xb1Da7D2C257c5700612BdE35C8d7187dc80d79f1',
    poolName: 'lisUSD-USDT-PancakeSwap',
    lpTokenAddress: '0xB2Aa63f363196caba3154D4187949283F085a488',
    lpTokenName: 'lisUSD-USDT-PancakeStableSwapLP',
    abi: 'pancakeStableSwapTwoPoolAbi',
    tokens: [
      {
        symbol: 'lisUSD',
        address: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5'
      },
      {
        symbol: 'USDT',
        address: '0x55d398326f99059fF775485246999027B3197955'
      }
    ]
  },
  {
    poolAddress: '0x3EFebC418efB585248A0D2140cfb87aFcc2C63DD',
    poolName: 'USDT-USDC-PancakeSwap',
    lpTokenAddress: '0xee1bcc9F1692E81A281b3a302a4b67890BA4be76',
    lpTokenName: 'USDT-USDC-PancakeStableSwapLP',
    abi: 'pancakeStableSwapTwoPoolAbi',
    tokens: [
      {
        symbol: 'USDT',
        address: '0x55d398326f99059fF775485246999027B3197955'
      },
      {
        symbol: 'USDC',
        address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
      }
    ]
  }
];

const pancakePricePairs = [
  {
    poolAddress: '0xb1Da7D2C257c5700612BdE35C8d7187dc80d79f1',
    poolName: 'lisUSD-USDT-PancakeSwap',
    abi: pancakeStableSwapTwoPoolAbi,
    tokens: [
      {
        symbol: 'lisUSD',
        address: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5'
      },
      {
        symbol: 'USDT',
        address: '0x55d398326f99059fF775485246999027B3197955'
      }
    ],
    pairs: [
      {
        token0: 'lisUSD',
        token1: 'USDT'
      }
    ]
  },
  {
    poolAddress: '0x3EFebC418efB585248A0D2140cfb87aFcc2C63DD',
    poolName: 'USDT-USDC-PancakeSwap',
    abi: pancakeStableSwapTwoPoolAbi,
    tokens: [
      {
        symbol: 'USDT',
        address: '0x55d398326f99059fF775485246999027B3197955'
      },
      {
        symbol: 'USDC',
        address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
      }
    ],
    pairs: [
      {
        token0: 'USDT',
        token1: 'USDC'
      }
    ]
  }
];

module.exports = {
  pancakeFactoryAddress,
  pancakePairs,
  pancakePoolAbi,
  stableSwapAbi,
  stableSwapFactoryAbi,
  erc20Abi,
  newParamAbi,
  rampAGammaAbi,
  susdpancakePoolAbi,
  cryptov2Abi,
  triCryptov2Abi,
  tricryptoFactoryAbi,
  pancakePricePairs,
  pancakeStableSwapTwoPoolAbi
};
