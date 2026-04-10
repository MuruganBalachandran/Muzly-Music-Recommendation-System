//region imports
import * as React from "react";
//endregion

//region constants
const MOBILE_BREAKPOINT = 768;
//endregion

//region hook
/**
 * Custom hook to detect if the viewport is mobile-sized
 * @returns {boolean} True if viewport width is below mobile breakpoint
 */
export function useIsMobile() {
  //region state
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
  //endregion

  //region effects
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
