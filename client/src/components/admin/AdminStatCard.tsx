//region imports
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
//endregion

//region interfaces
interface AdminStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  loading?: boolean;
}
//endregion

//region component
/**
 * Stat card component for admin dashboard
 * Displays metric with icon and loading state
 */
export function AdminStatCard({
  title,
  value,
  icon: Icon,
  color,
  loading = false,
}: AdminStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 border border-white/5 overflow-hidden group hover:border-white/10 transition-all`}
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
      
      {/* Content */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-white/10 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-3xl font-bold text-white mt-2">{value.toLocaleString()}</p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
          <Icon className="w-6 h-6 text-accent" />
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span>Active</span>
      </div>
    </motion.div>
  );
}
//endregion
