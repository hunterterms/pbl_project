// Shared lists, so the forms, filters and badges always agree with each other

export const ITEM_CATEGORIES = ['Books', 'Electronics', 'Clothing', 'Furniture'];

export const EVENT_CATEGORIES = ['Academic', 'Workshop', 'Social', 'Cultural', 'Sports', 'Career', 'Other'];

// Each category gets its own "highlighter" colour (a Chakra colour scheme)
export const CATEGORY_COLORS = {
  Books: 'orange',
  Electronics: 'cyan',
  Clothing: 'pink',
  Furniture: 'green',
  Academic: 'purple',
  Workshop: 'teal',
  Social: 'pink',
  Cultural: 'orange',
  Sports: 'green',
  Career: 'cyan',
  Other: 'gray',
};

// Choices for "Year" on My Profile
export const YEARS_OF_STUDY = ['1st year', '2nd year', '3rd year', '4th year', '5th year', 'Postgraduate', 'PhD', 'Alumni', 'Faculty or staff'];

// Posts aren't linked to accounts yet, so this placeholder stands in for whoever posted them
// (the items API also uses this name for new listings)
export const CURRENT_USER = { name: 'Campus User' };
