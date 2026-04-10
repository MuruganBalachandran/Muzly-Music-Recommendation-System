//region exports
/**
 * Consistent admin UI styling utilities
 * Provides reusable Tailwind class combinations for admin components
 */
export const adminStyles = {
  //region container styles
  container: "glass rounded-2xl p-8 border border-white/5",
  containerCompact: "glass rounded-2xl p-6 border border-white/5",
  //endregion
  
  //region table styles
  tableHeader: "py-4 px-4 text-xs uppercase tracking-wider font-semibold text-white/40 border-b border-white/10",
  tableRow: "border-b border-white/5 hover:bg-white/[0.02] transition-all",
  tableCell: "py-4 px-4",
  //endregion
  
  //region badge styles
  badgeBase: "px-3 py-1 rounded-lg text-xs font-medium border",
  badgeAccent: "bg-accent/10 text-accent border-accent/20",
  badgeSuccess: "bg-green-500/10 text-green-400 border-green-500/20",
  badgeWarning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  badgeDanger: "bg-red-500/10 text-red-400 border-red-500/20",
  badgeInfo: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  badgePurple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  //endregion
  
  //region input styles
  input: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent/50 text-white placeholder:text-white/30 transition-all",
  inputCompact: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent/50 text-white placeholder:text-white/30 transition-all",
  //endregion
  
  //region button styles
  buttonPrimary: "bg-accent text-white px-6 py-2.5 rounded-xl font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-accent/20",
  buttonSecondary: "border border-white/10 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-white/5 transition-all",
  buttonDanger: "bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all",
  //endregion
  
  //region icon styles
  iconSmall: "w-4 h-4",
  iconMedium: "w-5 h-5",
  iconLarge: "w-6 h-6",
  //endregion
  
  //region loading state
  loadingSpinner: "w-6 h-6 text-accent animate-spin",
  //endregion
  
  //region text styles
  textMuted: "text-muted-foreground",
  textSmall: "text-sm text-muted-foreground",
  textXSmall: "text-xs text-muted-foreground",
  //endregion
};

/**
 * Admin color utilities
 * Semantic color classes for admin UI
 */
export const adminColors = {
  accent: "text-accent",
  success: "text-green-400",
  warning: "text-yellow-400",
  danger: "text-red-400",
  info: "text-blue-400",
  purple: "text-purple-400",
};
//endregion
