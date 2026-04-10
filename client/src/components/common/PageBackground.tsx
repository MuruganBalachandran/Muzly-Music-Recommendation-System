//region imports
import LiquidEther from '@/components/animations/LiquidEther';
//endregion

//region interfaces
interface PageBackgroundProps {
  colors?: string[];
  autoIntensity?: number;
}
//endregion

//region component
/**
 * Reusable page background with LiquidEther animation
 * Provides consistent animated background across pages
 */
export function PageBackground({ 
  colors = ['#1a1a1a', '#0a0a0a', '#222'], 
  autoIntensity = 1.2 
}: PageBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 bg-background">
      <LiquidEther 
        colors={colors} 
        autoDemo 
        autoIntensity={autoIntensity} 
      />
    </div>
  );
}
//endregion
