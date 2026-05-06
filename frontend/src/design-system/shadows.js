/**
 * Shadow System
 * Elevation-based shadow hierarchy
 */

export const shadows = {
  // No shadow
  none: 'none',

  // Elevation 0: Default, no shadow
  0: 'none',

  // Elevation 1: Subtle shadow for slightly raised elements
  1: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',

  // Elevation 2: Light shadow for cards and small containers
  2: '0px 3px 6px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.12)',

  // Elevation 3: Medium shadow for floating elements
  3: '0px 10px 20px rgba(0, 0, 0, 0.15), 0px 3px 6px rgba(0, 0, 0, 0.10)',

  // Elevation 4: Notable shadow for modals and dropdowns
  4: '0px 15px 35px rgba(0, 0, 0, 0.2), 0px 3px 8px rgba(0, 0, 0, 0.12)',

  // Elevation 5: Strong shadow for top-level modals
  5: '0px 20px 40px rgba(0, 0, 0, 0.2), 0px 5px 12px rgba(0, 0, 0, 0.1)',

  // Semantic shadows
  sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
  '2xl': '0px 25px 50px rgba(0, 0, 0, 0.25)',

  // Focus shadow (accessibility)
  focus: '0px 0px 0px 3px rgba(33, 150, 243, 0.25)',

  // Inset shadow
  inset: 'inset 0px 2px 4px rgba(0, 0, 0, 0.06)',
};

export default shadows;
