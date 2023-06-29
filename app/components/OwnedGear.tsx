import {
  ThirdwebNftMedia,
  useAddress,
  useOwnedNFTs,
  Web3Button,
} from "@thirdweb-dev/react";
import { EditionDrop, SmartContract } from "@thirdweb-dev/sdk";
import React from "react";
import LoadingSection from "./LoadingSection";
import styles from "../styles/Home.module.css";
import { MINING_ADDRESS } from "../const/contractAddresses";

type Props = {
  pickaxeContract: EditionDrop;
  miningContract: SmartContract<any>;
};


export default function OwnedGear({ pickaxeContract, miningContract }: Props) {
  const address = useAddress();
  const { data: ownedPickaxes, isLoading } = useOwnedNFTs(
    pickaxeContract,
    address
  );

  if (isLoading) {
    return <LoadingSection />;
  }

  async function equip(id: string) {
    if (!address) return;

    const hasApproval = await pickaxeContract.isApproved(
      address,
      MINING_ADDRESS
    );

    if (!hasApproval) {
      await pickaxeContract.setApprovalForAll(MINING_ADDRESS, true);
    }

    await miningContract.call("stake", [id]);

    window.location.reload();
  }

  return (
    <>
      <div className={styles.nftBoxGrid}>
        {ownedPickaxes?.map((p) => (
          <div className={styles.nftBox} key={p.metadata.id.toString()}>
            <ThirdwebNftMedia
              metadata={p.metadata}
              className={`${styles.nftMedia} ${styles.spacerTop}`}
              height={"64"}
            />
            <h3>{p.metadata.name}</h3>

            <div className={styles.smallMargin}>
              <Web3Button
                theme="dark"
                contractAddress={MINING_ADDRESS}
                action={() => equip(p.metadata.id)}
              >
                装备
              </Web3Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
