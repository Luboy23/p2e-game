import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { CHARACTER_ADDRESS } from "../const/contractAddresses";
import MintContainer from "../components/MintContainer";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { contract: editionDrop } = useContract(
    CHARACTER_ADDRESS,
    "edition-drop"
  );

  const address = useAddress();
  const router = useRouter();

  const {
    data: ownedNfts,
    isLoading,
    isError,
  } = useOwnedNFTs(editionDrop, address);

  // 1. 连接钱包
  if (!address) {
    return (
      <div className={styles.container}>
        <ConnectWallet theme="dark" />
      </div>
    );
  }

  // 2. 加载页面
  if (isLoading) {
    return <div>加载中...</div>;
  }

  // 错误提示
  if (!ownedNfts || isError) {
    return <div>什么地方发生了错误...</div>;
  }

  // 3. 没有NFT时候的铸造页面
  if (ownedNfts.length === 0) {
    return (
      <div className={styles.container}>
        <MintContainer />
      </div>
    );
  }

  // 4. 已经铸造了NFT 跳转到开始游戏页面
  return (
    <div className={styles.container}>
      <button
        className={`${styles.mainButton} ${styles.spacerBottom}`}
        onClick={() => router.push("/play")}
      >
        开始游戏
      </button>
    </div>
  );
};

export default Home;
