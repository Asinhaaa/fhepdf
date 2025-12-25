import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying EncryptedPdfRegistry...");

  const deployment = await deploy("EncryptedPdfRegistry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log(
    `EncryptedPdfRegistry deployed to: ${deployment.address}`
  );

  // Verify on block explorer if not on localhost
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await deployment.wait?.(5);

    try {
      await hre.run("verify:verify", {
        address: deployment.address,
        constructorArguments: [],
      });
      console.log("Contract verified on block explorer");
    } catch (error: any) {
      if (error.message.includes("Already Verified")) {
        console.log("Contract already verified");
      } else {
        console.error("Verification failed:", error);
      }
    }
  }
};

func.tags = ["EncryptedPdfRegistry"];
export default func;
