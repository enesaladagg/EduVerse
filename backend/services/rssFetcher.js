const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const DEFAULT_FEEDS = Object.freeze([
  {
    key: 'owasp',
    title: 'OWASP News',
    url: 'https://owasp.org/www-project-top-ten/index.xml',
  },
  {
    key: 'mozilla-security',
    title: 'Mozilla Security Blog',
    url: 'https://blog.mozilla.org/security/feed/',
  },
  {
    key: 'nodejs',
    title: 'Node.js Blog',
    url: 'https://nodejs.org/en/feed/blog.xml',
  },
]);

const MAX_XML_SIZE = 2 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 7000;

const stripTags = (value = '') =>
  value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const extractTag = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? stripTags(match[1]) : '';
};

const parseItems = (xml, limit) => {
  const itemMatches = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)];
  const entryMatches = [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)];
  const blocks = (itemMatches.length ? itemMatches : entryMatches).slice(0, limit);

  return blocks.map((match) => {
    const block = match[1];
    const atomLink = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);

    return {
      title: extractTag(block, 'title'),
      link: extractTag(block, 'link') || atomLink?.[1] || '',
      summary: extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content'),
      publishedAt: extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated'),
    };
  });
};

const fetchWithTimeout = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
        'user-agent': 'online-egitim-platformu-rss-fetcher/1.0',
      },
    });

    if (!response.ok) {
      throw new AppError(`RSS feed responded with ${response.status}`, 502, 'RSS_UPSTREAM_ERROR');
    }

    const xml = await response.text();
    if (xml.length > MAX_XML_SIZE) {
      throw new AppError('RSS feed is too large.', 413, 'RSS_FEED_TOO_LARGE');
    }
    return xml;
  } finally {
    clearTimeout(timer);
  }
};

const fetchFeed = async (feed, { limit = 10, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) => {
  try {
    const xml = await fetchWithTimeout(feed.url, timeoutMs);
    return {
      key: feed.key,
      title: feed.title,
      url: feed.url,
      fetchedAt: new Date().toISOString(),
      items: parseItems(xml, limit),
    };
  } catch (error) {
    logger.warn('RSS feed fetch failed', {
      key: feed.key,
      url: feed.url,
      message: error.message,
    });

    return {
      key: feed.key,
      title: feed.title,
      url: feed.url,
      fetchedAt: new Date().toISOString(),
      error: {
        code: error.code || 'RSS_FETCH_FAILED',
        message: error.message,
      },
      items: [],
    };
  }
};

const fetchFeeds = async ({ feeds = DEFAULT_FEEDS, limit = 10, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) => {
  const settled = await Promise.all(feeds.map((feed) => fetchFeed(feed, { limit, timeoutMs })));
  return settled;
};

module.exports = {
  DEFAULT_FEEDS,
  fetchFeed,
  fetchFeeds,
};
