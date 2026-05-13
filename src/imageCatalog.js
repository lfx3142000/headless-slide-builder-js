const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');

const DEFAULT_IMAGE_DIRS = ['assets/images'];
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

function resolvePath(filePath, rootDir = process.cwd()) {
  if (!filePath) return null;
  return path.isAbsolute(filePath) ? filePath : path.resolve(rootDir, filePath);
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[_\\-./\\]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value) {
  const stop = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'slide', 'image', 'photo', 'picture', 'visual', 'a', 'an', 'of', 'to', 'in', 'on']);
  return normalizeText(value)
    .split(' ')
    .filter((t) => t && t.length > 1 && !stop.has(t));
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function getDimensions(absPath) {
  try {
    const dim = imageSize(fs.readFileSync(absPath));
    const width = dim.width || 0;
    const height = dim.height || 0;
    return { width, height, aspectRatio: width && height ? width / height : 1, type: dim.type || path.extname(absPath).slice(1) };
  } catch (_) {
    return { width: 0, height: 0, aspectRatio: 1, type: path.extname(absPath).slice(1).toLowerCase() };
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function readManifest(manifestPath, rootDir = process.cwd()) {
  const abs = resolvePath(manifestPath, rootDir);
  if (!abs || !fs.existsSync(abs)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(abs, 'utf8'));
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.images)) return parsed.images;
    return [];
  } catch (err) {
    console.warn(`Image manifest ignored because it could not be parsed: ${manifestPath} (${err.message})`);
    return [];
  }
}

function toRecord(absPath, rootDir, metadata = {}) {
  const fileName = path.basename(absPath);
  const baseName = path.basename(absPath, path.extname(absPath));
  const relPath = path.relative(rootDir, absPath).replace(/\\/g, '/');
  const dim = getDimensions(absPath);
  const id = metadata.id || baseName;
  const tags = unique([...(metadata.tags || []), ...tokenize(baseName)]);
  const description = metadata.description || metadata.alt || metadata.caption || '';
  const role = metadata.role || metadata.imageRole || null;
  const tokens = unique([
    ...tokenize(id),
    ...tokenize(baseName),
    ...tokenize(fileName),
    ...tags.flatMap(tokenize),
    ...tokenize(description)
  ]);
  return { id, path: relPath, absPath, fileName, baseName, tags, description, role, width: dim.width, height: dim.height, aspectRatio: dim.aspectRatio, type: dim.type, tokens };
}

function buildImageCatalog(theme = {}, options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const assetConfig = theme.assets || {};
  const imageDirs = assetConfig.imageDirs || DEFAULT_IMAGE_DIRS;
  const manifestPaths = assetConfig.imageManifests || ['assets/images/images.json', 'assets/images/image-manifest.json'];
  const manifestItems = manifestPaths.flatMap((p) => readManifest(p, rootDir));
  const metadataByPath = new Map();
  for (const item of manifestItems) {
    if (!item.path) continue;
    const abs = resolvePath(item.path, rootDir);
    metadataByPath.set(abs, item);
  }
  const discoveredPaths = unique([
    ...imageDirs.flatMap((dir) => walk(resolvePath(dir, rootDir))),
    ...manifestItems.map((item) => item.path ? resolvePath(item.path, rootDir) : null).filter(Boolean)
  ]).filter((p) => fs.existsSync(p));
  const records = discoveredPaths.map((absPath) => toRecord(absPath, rootDir, metadataByPath.get(absPath) || {}));
  return records.sort((a, b) => a.path.localeCompare(b.path));
}

function exactFileExists(value, rootDir = process.cwd()) {
  if (!value || typeof value !== 'string') return null;
  const abs = resolvePath(value, rootDir);
  if (abs && fs.existsSync(abs) && SUPPORTED_EXTENSIONS.has(path.extname(abs).toLowerCase())) return abs;
  return null;
}

function extractImageQuery(ref, slideData = {}) {
  if (!ref) return slideData.imageQuery || slideData.visual || slideData.imageDescription || '';
  if (typeof ref === 'string') return ref;
  if (typeof ref === 'object') {
    return ref.query || ref.prompt || ref.description || ref.alt || ref.caption || ref.id || ref.file || ref.path || '';
  }
  return '';
}

function scoreRecord(record, query, slideData = {}) {
  const queryTokens = tokenize(query);
  const contextTokens = tokenize([
    slideData.title,
    slideData.subtitle,
    slideData.eyebrow,
    slideData.caption,
    slideData.body,
    Array.isArray(slideData.bullets) ? slideData.bullets.join(' ') : '',
    Array.isArray(slideData.items) ? slideData.items.join(' ') : ''
  ].filter(Boolean).join(' '));
  const allQuery = unique([...queryTokens, ...contextTokens.slice(0, 8)]);
  if (allQuery.length === 0) return 0;
  let score = 0;
  const idNorm = normalizeText(record.id);
  const baseNorm = normalizeText(record.baseName);
  const descNorm = normalizeText(record.description);
  if (query && (idNorm === normalizeText(query) || baseNorm === normalizeText(query))) score += 80;
  for (const token of queryTokens) {
    if (record.tokens.includes(token)) score += 12;
    if (idNorm.includes(token) || baseNorm.includes(token)) score += 10;
    if (descNorm.includes(token)) score += 5;
  }
  for (const token of contextTokens) {
    if (record.tokens.includes(token)) score += 2.5;
  }
  return score;
}

function resolveImageReference(ref, slideData = {}, catalog = [], options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const threshold = options.threshold ?? options.imageMatchThreshold ?? 14;
  if (ref && typeof ref === 'object' && ref.path) {
    const abs = exactFileExists(ref.path, rootDir);
    if (abs) return { path: path.relative(rootDir, abs).replace(/\\/g, '/'), absPath: abs, matchType: 'explicit-path', role: ref.role || ref.imageRole || null, meta: { ...getDimensions(abs), role: ref.role || ref.imageRole || null } };
  }
  if (typeof ref === 'string') {
    const abs = exactFileExists(ref, rootDir);
    if (abs) return { path: path.relative(rootDir, abs).replace(/\\/g, '/'), absPath: abs, matchType: 'explicit-path', meta: getDimensions(abs) };
  }
  const requestedId = ref && typeof ref === 'object' ? ref.id : null;
  if (requestedId) {
    const normalized = normalizeText(requestedId);
    const exact = catalog.find((r) => normalizeText(r.id) === normalized || normalizeText(r.baseName) === normalized);
    if (exact) return { path: exact.path, absPath: exact.absPath, matchType: 'id', role: ref.role || ref.imageRole || exact.role || null, meta: exact };
  }
  const query = extractImageQuery(ref, slideData);
  if (!query) return null;
  const ranked = catalog
    .map((record) => ({ record, score: scoreRecord(record, query, slideData) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  if (ranked.length === 0 || ranked[0].score < threshold) return null;
  const best = ranked[0].record;
  return { path: best.path, absPath: best.absPath, matchType: 'semantic-filename', score: ranked[0].score, role: ref && typeof ref === 'object' ? (ref.role || ref.imageRole || best.role || null) : best.role || null, meta: best };
}

function hasImageIntent(slide) {
  return Boolean(slide.image || slide.imageQuery || slide.visual || slide.imageDescription || ['image_left', 'image_right', 'full_bleed_image', 'image_grid', 'section', 'title'].includes(slide.type));
}

function resolveDeckImages(content, theme = {}, options = {}) {
  const mergedOptions = { ...options, imageMatchThreshold: theme.assets?.imageMatchThreshold ?? options.imageMatchThreshold };
  const catalog = buildImageCatalog(theme, mergedOptions);
  const enableAutoMatch = theme.assets?.autoMatch !== false;
  const slides = (content.slides || []).map((slide, index) => {
    const next = { ...slide };
    const ref = next.image || next.imageQuery || next.visual || next.imageDescription;
    if (!enableAutoMatch || !hasImageIntent(next)) return next;
    const resolved = resolveImageReference(ref, next, catalog, mergedOptions);
    if (resolved) {
      next.image = { path: resolved.path, role: resolved.role || next.imageRole || undefined, meta: resolved.meta };
      next.imageMeta = { width: resolved.meta.width, height: resolved.meta.height, aspectRatio: resolved.meta.aspectRatio, id: resolved.meta.id, matchType: resolved.matchType, score: resolved.score, role: resolved.role || resolved.meta.role || undefined };
    } else if (ref) {
      next.imageUnresolved = typeof ref === 'string' ? ref : JSON.stringify(ref);
      console.warn(`Image not resolved for slide ${index + 1}: ${next.title || next.type} (${next.imageUnresolved})`);
    }
    if (Array.isArray(next.images)) {
      next.images = next.images.map((imgRef) => {
        const match = resolveImageReference(imgRef, next, catalog, mergedOptions);
        if (!match) return imgRef;
        return { path: match.path, role: match.role || (typeof imgRef === 'object' ? imgRef.role || imgRef.imageRole : undefined), meta: match.meta, matchType: match.matchType };
      });
    }
    return next;
  });
  return { ...content, slides, imageCatalog: options.includeCatalog ? catalog.map(({ absPath, tokens, ...rest }) => rest) : undefined };
}

module.exports = { buildImageCatalog, resolveDeckImages, resolveImageReference, normalizeText, tokenize };
