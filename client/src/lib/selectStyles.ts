//region imports
// Centralized React-Select styling for consistent UI across the application
//endregion

//region exports
/**
 * Custom styles for React-Select components
 * Provides dark theme with accent colors matching the app design
 */
export const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: state.isFocused ? 'rgba(255, 159, 252, 0.5)' : 'rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    minHeight: '42px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'rgba(255, 159, 252, 0.3)',
    },
    color: '#fff'
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    zIndex: 99
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#FF9FFC' 
      : state.isFocused 
        ? 'rgba(255, 159, 252, 0.1)' 
        : 'transparent',
    color: state.isSelected ? '#000' : '#fff',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#FF9FFC',
    }
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.3)',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.5)',
  })
};
//endregion
