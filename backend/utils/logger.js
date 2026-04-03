const formatContext = (context = {}) => {
  const entries = Object.entries(context);
  if (!entries.length) return '';
  return ` ${entries.map(([key, value]) => `${key}=${value}`).join(' ')}`;
};

const timestamp = () => new Date().toISOString();

const info = (message, context) => {
  console.log(`[INFO] ${timestamp()} ${message}${formatContext(context)}`);
};

const warn = (message, context) => {
  console.warn(`[WARN] ${timestamp()} ${message}${formatContext(context)}`);
};

const error = (message, context) => {
  console.error(`[ERROR] ${timestamp()} ${message}${formatContext(context)}`);
};

module.exports = {
  info,
  warn,
  error,
};
