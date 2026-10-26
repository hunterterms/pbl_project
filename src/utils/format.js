// Shared formatting, so dates, times and prices look the same on every page

// Accepts the form's "2026-10-15" format and the API's "4/13/2026" format.
// Plain YYYY-MM-DD strings are read as local dates (new Date() would treat them as UTC).
export const toDate = (value) => {
  if (!value) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00`) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// "13 Apr 2026"
export const formatDate = (value) => {
  const date = toDate(value);
  return date ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : value;
};

// "18:00" → "6:00 PM"
export const formatTime = (time) =>
  new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

// "1500" → "₹1,500"
export const formatPrice = (price) => {
  const amount = Number(price);
  return Number.isNaN(amount) ? `₹${price}` : `₹${amount.toLocaleString('en-IN')}`;
};

// "today", "yesterday", "3 days ago", "2 months ago"...
export const timeAgo = (value) => {
  const date = toDate(value);
  if (!date) return '';
  const days = Math.round((Date.now() - date.getTime()) / 86400000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (days < 7) return rtf.format(-days, 'day');
  if (days < 30) return rtf.format(-Math.round(days / 7), 'week');
  if (days < 365) return rtf.format(-Math.round(days / 30), 'month');
  return rtf.format(-Math.round(days / 365), 'year');
};
