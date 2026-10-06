import { validateInsightContent as validateInsightContentCore } from './insightContentValidationCore.mjs';
import type { InsightBlock } from '../data/insightTypes';

export type InsightContentValidation = {
  errors: string[];
  warnings: string[];
};

export function validateInsightContent(blocks: InsightBlock[] | undefined): InsightContentValidation {
  return validateInsightContentCore(blocks);
}
