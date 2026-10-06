function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalize(value) {
  return text(value).toLowerCase().replace(/\s+/g, ' ');
}

function isFaqHeading(value, language) {
  const normalized = normalize(value);
  if (!normalized) return false;

  if (language === 'id') {
    return normalized === 'pertanyaan yang sering diajukan'
      || normalized === 'faq'
      || normalized.startsWith('pertanyaan yang sering diajukan');
  }

  return normalized === 'frequently asked questions'
    || normalized === 'faq'
    || normalized.startsWith('frequently asked questions');
}

export function normalizeInsightFaq(value) {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 30).map((item) => {
    if (Array.isArray(item)) {
      return {
        question: text(item[0]),
        answer: text(item[1])
      };
    }

    if (item && typeof item === 'object') {
      return {
        question: text(item.question),
        answer: text(item.answer)
      };
    }

    return { question: '', answer: '' };
  }).filter((item) => item.question && item.answer);
}

export function deriveInsightFaq(blocks, language = 'en') {
  if (!Array.isArray(blocks)) return [];

  const startIndex = blocks.findIndex(
    (block) => block?.type === 'heading'
      && block.level === 2
      && isFaqHeading(block.text, language)
  );

  if (startIndex < 0) return [];

  const result = [];
  let question = '';
  let answer = [];

  const flush = () => {
    const answerText = answer.filter(Boolean).join('\n\n').trim();
    if (question && answerText) {
      result.push({
        question,
        answer: answerText
      });
    }
    question = '';
    answer = [];
  };

  for (let index = startIndex + 1; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block?.type === 'heading' && block.level === 2) break;

    if (block?.type === 'heading' && block.level === 3) {
      flush();
      question = text(block.text);
      continue;
    }

    if (question && block?.type === 'paragraph') {
      const paragraph = text(block.text);
      if (paragraph) answer.push(paragraph);
    }
  }

  flush();
  return result.slice(0, 12);
}
