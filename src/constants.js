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

// There's no login yet, so everything you post is from the same placeholder user
// (the items API also uses this name for new listings)
export const CURRENT_USER = { name: 'Campus User' };
