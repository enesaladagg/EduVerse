const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { fetchFeeds, DEFAULT_FEEDS } = require('../services/rssFetcher');

const router = express.Router();

router.get('/rss/feeds', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    count: DEFAULT_FEEDS.length,
    data: DEFAULT_FEEDS,
  });
}));

router.get('/rss/latest', asyncHandler(async (req, res) => {
  const limit = Math.min(20, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
  const feeds = await fetchFeeds({ limit });

  res.json({
    success: true,
    count: feeds.reduce((total, feed) => total + feed.items.length, 0),
    data: feeds,
  });
}));

module.exports = router;
