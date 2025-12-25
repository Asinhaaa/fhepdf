import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";

export function WalletButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ConnectButton
        showBalance={true}
        accountStatus="avatar"
        chainStatus="icon"
      />
    </motion.div>
  );
}
