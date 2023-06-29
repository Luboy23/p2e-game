import { Web3Button } from "@thirdweb-dev/react";
import Image from "next/image";
import { CHARACTER_ADDRESS } from "../const/contractAddresses";
import styles from "../styles/Home.module.css";

export default function MintContainer() {
  return (
    <div className={styles.collectionContainer}>
      <h1>领取你的NFT</h1>

      <p>领取你的挖矿镐以开始游戏！</p>

      <div className={`${styles.nftBox} ${styles.spacerBottom}`}>
        <Image src="/mine.gif" style={{ height: 200 }} alt="mine" />
      </div>

      <div className={styles.smallMargin}>
        <Web3Button
          theme="dark"
          contractAddress={CHARACTER_ADDRESS}
          action={(contract) => contract.erc1155.claim(0, 1)}
        >
          领取
        </Web3Button>
      </div>
    </div>
  );
}
