//region imports
import { motion } from "framer-motion";
import { ReactNode } from "react";
//endregion

//region interfaces
interface AdminTableRowProps {
  children: ReactNode;
  index: number;
}
//endregion

//region component
/**
 * Animated table row component for admin tables
 * Provides staggered animation on mount
 */
export function AdminTableRow({ children, index }: AdminTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/5 hover:bg-white/[0.02] transition-all group"
    >
      {children}
    </motion.tr>
  );
}
//endregion
