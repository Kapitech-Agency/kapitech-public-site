const SUPPORTED_BLOCK_TYPES = new Set([
  'paragraph',
  'heading',
  'list',
  'quote',
  'image',
  'table',
  'callout',
  'code',
  'link',
  'promo',
  'checklist',
  'divider'
]);

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const GENERIC_EDITORIAL_PATTERNS = [
  /^The practical question in .{5,180} is not whether an option is possible\./i,
  /^A strong project makes trade-offs explicit, assigns ownership, and defines how the team will verify that the delivered system actually works for its users\./i
];

function normalizeParagraph(value) {
  return text(value).replace(/\\s+/g, ' ').toLowerCase();
}

function validHttpUrl(value) {
  if (!text(value)) return false;

  try {
    const parsed = new URL(value, 'https://kapitech.id/');
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateInsightContent(blocks) {
  const errors = [];
  const warnings = [];
  const normalizedParagraphs = [];
  let hasH2 = false;

  if (!Array.isArray(blocks) || blocks.length === 0) {
    errors.push('Insight content must contain at least one content block.');
    return { errors, warnings };
  }

  blocks.forEach((block, index) => {
    const label = 'Block ' + (index + 1);

    if (!block || typeof block !== 'object') {
      errors.push(label + ' is not a valid object.');
      return;
    }

    if (!SUPPORTED_BLOCK_TYPES.has(block.type)) {
      errors.push(label + ' uses unsupported type "' + String(block.type || '') + '".');
      return;
    }

    switch (block.type) {
      case 'paragraph': {
        const paragraphText = text(block.text);
        if (!paragraphText) {
          errors.push(label + ' paragraph text is empty.');
          break;
        }

        if (GENERIC_EDITORIAL_PATTERNS.some((pattern) => pattern.test(paragraphText))) {
          errors.push(label + ' contains generic placeholder copy; replace it with topic-specific editorial content.');
        }

        const normalized = normalizeParagraph(paragraphText);
        if (normalized.length >= 110) normalizedParagraphs.push({ index, value: normalized });
        break;
      }

      case 'heading':
        if (!text(block.text)) {
          errors.push(label + ' heading text is empty.');
        }

        if (block.level === 2) {
          hasH2 = true;
        } else if (block.level === 3 && !hasH2) {
          errors.push(label + ' is an H3 without a preceding H2 parent.');
        }
        break;

      case 'list':
        if (!Array.isArray(block.items) || block.items.length === 0) {
          errors.push(label + ' list must contain at least one item.');
        } else if (block.items.some((item) => !text(item))) {
          errors.push(label + ' list contains an empty item.');
        }
        break;

      case 'quote':
        if (!text(block.text)) errors.push(label + ' quote text is empty.');
        break;

      case 'image':
        if (!validHttpUrl(block.url)) errors.push(label + ' image URL is missing or invalid.');
        if (!text(block.alt)) warnings.push(label + ' image has no descriptive alt text.');
        break;

      case 'table':
        if (!Array.isArray(block.headers) || block.headers.length === 0) {
          errors.push(label + ' table must contain headers.');
        } else if (block.headers.some((header) => !text(header))) {
          errors.push(label + ' table contains an empty header.');
        }

        if (!Array.isArray(block.rows)) {
          errors.push(label + ' table rows must be an array.');
        } else if (block.rows.some((row) => !Array.isArray(row))) {
          errors.push(label + ' table contains an invalid row.');
        }
        break;

      case 'callout':
        if (!text(block.text)) errors.push(label + ' callout text is empty.');
        break;

      case 'code':
        if (!text(block.code)) errors.push(label + ' code block is empty.');
        break;

      case 'link':
        if (!text(block.label)) errors.push(label + ' link label is empty.');
        if (!validHttpUrl(block.url)) errors.push(label + ' link URL is missing or invalid.');
        break;

      case 'promo':
        for (const field of ['eyebrow', 'title', 'description', 'ctaLabel']) {
          if (!text(block[field])) errors.push(label + ' promo ' + field + ' is empty.');
        }
        if (!validHttpUrl(block.ctaUrl)) errors.push(label + ' promo CTA URL is missing or invalid.');
        break;

      case 'checklist':
        if (!Array.isArray(block.items) || block.items.length === 0) {
          errors.push(label + ' checklist must contain at least one item.');
        } else if (block.items.some((item) => !text(item))) {
          errors.push(label + ' checklist contains an empty item.');
        }
        break;

      case 'divider':
        break;

      default:
        break;
    }
  });

  const paragraphOccurrences = new Map();
  for (const paragraph of normalizedParagraphs) {
    const indexes = paragraphOccurrences.get(paragraph.value) || [];
    indexes.push(paragraph.index);
    paragraphOccurrences.set(paragraph.value, indexes);
  }

  for (const indexes of paragraphOccurrences.values()) {
    if (indexes.length > 1) {
      errors.push('Insight content repeats the same long paragraph in blocks ' + indexes.map((index) => index + 1).join(', ') + '.');
    }
  }

  if (!hasH2) {
    warnings.push('Insight content does not contain an H2 heading, so the table of contents will be empty.');
  }

  return { errors, warnings };
}
