// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@thirdweb-dev/contracts/drop/DropERC1155.sol"; // 挖矿道具
import "@thirdweb-dev/contracts/token/TokenERC20.sol"; // ERC-20代币合约
import "@thirdweb-dev/contracts/openzeppelin-presets/utils/ERC1155/ERC1155Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Mining is ReentrancyGuard, ERC1155Holder {
    // 储存 Edition Drop and Token合约
    DropERC1155 public immutable pickaxeNftCollection;
    TokenERC20 public immutable rewardsToken;

    // 构造函数
    constructor(
        DropERC1155 pickaxeContractAddress,
        TokenERC20 gemsContractAddress
    ) {
        pickaxeNftCollection = pickaxeContractAddress;
        rewardsToken = gemsContractAddress;
    }

    struct MapValue {
        bool isData;
        uint256 value;
    }

    // 映射
    mapping(address => MapValue) public playerPickaxe;


    mapping(address => MapValue) public playerLastUpdate;

    function stake(uint256 _tokenId) external nonReentrant {
        //确保玩家已经质押了1个NFT
        require(
            pickaxeNftCollection.balanceOf(msg.sender, _tokenId) >= 1,
            " at least 1 of the pickaxe stake"
        );

        // 返还玩家已经质押的NFT
        if (playerPickaxe[msg.sender].isData) {
            // 使用safeTransfer函数
            pickaxeNftCollection.safeTransferFrom(
                address(this),
                msg.sender,
                playerPickaxe[msg.sender].value,
                1,
                "Returning your old pickaxe"
            );
        }

        // 计算欠玩家的奖励，并进行支付
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // 把挖矿镐转入合约
        pickaxeNftCollection.safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            1,
            "Staking  pickaxe"
        );

        // 更新映射
        playerPickaxe[msg.sender].value = _tokenId;
        playerPickaxe[msg.sender].isData = true;

        playerLastUpdate[msg.sender].isData = true;
        playerLastUpdate[msg.sender].value = block.timestamp;
    }

    function withdraw() external nonReentrant {
        // 确保玩家有NFT可以质押
        require(
            playerPickaxe[msg.sender].isData,
            " do not have a pickaxe to withdraw."
        );

        // 计算欠玩家的奖励，并进行支付
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        //归还旧的NFT给玩家
        pickaxeNftCollection.safeTransferFrom(
            address(this),
            msg.sender,
            playerPickaxe[msg.sender].value,
            1,
            "Returning your old pickaxe"
        );

        // Update the playerPickaxe mapping
        playerPickaxe[msg.sender].isData = false;

        playerLastUpdate[msg.sender].isData = true;
        playerLastUpdate[msg.sender].value = block.timestamp;
    }

    function claim() external nonReentrant {
        // 计算欠玩家的奖励，并进行支付
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // 更新映射
        playerLastUpdate[msg.sender].isData = true;
        playerLastUpdate[msg.sender].value = block.timestamp;
    }


    function calculateRewards(address _player)
        public
        view
        returns (uint256 _rewards)
    {
        // 如果这俩映射的状态没有设置，则说明玩家没有奖励
        if (
            !playerLastUpdate[_player].isData || !playerPickaxe[_player].isData
        ) {
            return 0;
        }

        // 计算时间差
        uint256 timeDifference = block.timestamp -
            playerLastUpdate[_player].value;

        // 计算玩家获得的奖励
        uint256 rewards = timeDifference *
            10_000_000_000_000 *
            (playerPickaxe[_player].value + 1);

        // 归还奖励
        return rewards;
    }
}
