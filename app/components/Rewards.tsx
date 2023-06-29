import React from "react";
import {
  ThirdwebNftMedia,
  useAddress,
  useContractRead,
  useMetadata,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { SmartContract, Token } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

import styles from "../styles/Home.module.css";
import ApproxRewards from "./ApproxRewards";
import { MINING_ADDRESS } from "../const/contractAddresses";

type Props = {
  miningContract: SmartContract<any>;
  tokenContract: Token;
};


export default function Rewards({ miningContract, tokenContract }: Props) {
  const address = useAddress();

  const { data: tokenMetadata } = useMetadata(tokenContract);
  const { data: currentBalance } = useTokenBalance(tokenContract, address);
  const { data: unclaimedAmount } = useContractRead(
    miningContract,
    "calculateRewards",
    [address]
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <p>
        你的 <b>金钻代币</b>
      </p>

      {tokenMetadata ? (
        <ThirdwebNftMedia
          // @ts-ignore
          metadata={tokenMetadata}
          height={"48"}
        />
      ) : null}
      <p className={styles.noGapBottom}>
        余额:：<b>{currentBalance?.displayValue}</b>
      </p>
      <p>
       未领取的余额：{" "}
        <b>{unclaimedAmount && ethers.utils.formatUnits(unclaimedAmount)}</b>
      </p>

      <ApproxRewards miningContract={miningContract} />

      <div className={styles.smallMargin}>
        <Web3Button
          contractAddress={MINING_ADDRESS}
          action={(contract) => contract.call("claim")}
        >
          领取
        </Web3Button>
      </div>
    </div>
  );
}
