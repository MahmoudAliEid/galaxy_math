import { normalizeArabicText, removeDiacritics, validateArabicInput } from './rules';
import { digitalRoot } from './reduce';

/**
 * Step 3 calculation result for a specific position
 */
export interface Step3Result {
  position: number;         // The position in the original text
  result: number;           // position × groupSum
}

/**
 * Character analysis result for a unique character group
 */
export interface CharAnalysis {
  char: string;
  normalizedChar: string;   // The representative character for this group
  positions: number[];      // Step 1: 1-indexed positions where this character appears
  groupSum: number;         // Step 2: Sum of positions for this character group
  step3Results: Step3Result[]; // Step 3: Results for each position (position × groupSum)
}

/**
 * Result for a specific position in the original sentence
 */
export interface SequenceStep {
  char: string;            // Original character at this position
  normalizedChar: string;  // Normalized character
  position: number;        // 1-indexed position
  groupSum: number;        // The value used for multiplication (from Step 2)
}

/**
 * Complete calculation result
 */
export interface CalculationResult {
  original: string;
  normalized: string;
  charAnalysis: CharAnalysis[];
  sequence: SequenceStep[];  // Step 3 sequence
  step3Total: number;        // Sum of all group sums in the sequence
  step4Product: string;      // Step 4: Product of all group sums (as string for BigInt support)
  finalReduced: number;      // Step 5: Reduced value (scientific multiplication method)
  reductionSteps: string[];  // The intermediate steps of reduction
}

/**
 * Calculates the Arabic "Power" based on the scientific math logic:
 * 1. Normalize: Remove spaces, unify Alif, Ta, Ha variants.
 * 2. Indexing: Assign positions 1 to N from Right to Left.
 * 3. Group Sums: Sum positions for each identical normalized character.
 * 4. Power & Product: Each character in sequence replaced by its groupSum ^ groupSum. Multiply all.
 * 5. Division: Divide product by total character count.
 * 6. Digital Root: Sum digits of the integer result until <= 9.
 */
export function calculateArabicPower(text: string): CalculationResult {
  // 0. Clean and basic validation
  const cleaned = removeDiacritics(text).replace(/\s+/g, '');
  if (cleaned.length === 0) {
     throw new Error('Input must contain Arabic characters');
  }

  // 1. Normalize and Assign positions (1-indexed, Right to Left)
  // The example says ج(1), ل(2), ا(3), ل(4) for جلال
  // This means the sequence as read from start to end gets indices 1, 2, 3, 4.
  // In Arabic, reading is RTL, so the "first" char is the rightmost.
  const normalized = normalizeArabicText(text); // This already removes spaces
  const charsAtPositions: { char: string; normalized: string; position: number }[] = [];
  const normalizedCharToPositions = new Map<string, number[]>();

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const pos = i + 1;
    
    charsAtPositions.push({ char, normalized: char, position: pos });
    
    if (!normalizedCharToPositions.has(char)) {
      normalizedCharToPositions.set(char, []);
    }
    normalizedCharToPositions.get(char)!.push(pos);
  }

  // 2. Calculate Group Sums
  const groupSumMap = new Map<string, number>();
  for (const [normChar, positions] of normalizedCharToPositions.entries()) {
    const sum = positions.reduce((a, b) => a + b, 0);
    groupSumMap.set(normChar, sum);
  }

  // Build character analysis for the UI
  const charAnalysis: CharAnalysis[] = [];
  const processedGroups = new Set<string>();
  for (const item of charsAtPositions) {
    if (!processedGroups.has(item.normalized)) {
      const positions = normalizedCharToPositions.get(item.normalized)!;
      const groupSum = groupSumMap.get(item.normalized)!;
      
      const step3Results = positions.map(position => ({
        position,
        result: groupSum
      }));

      charAnalysis.push({
        char: item.char,
        normalizedChar: item.normalized,
        positions,
        groupSum,
        step3Results
      });
      processedGroups.add(item.normalized);
    }
  }

  // 3. Build the sequence (Step 3 Power & Product)
  const sequence: SequenceStep[] = charsAtPositions.map(item => ({
    char: item.char,
    normalizedChar: item.normalized,
    position: item.position,
    groupSum: groupSumMap.get(item.normalized)!
  }));

  // 4. Calculate Huge Cumulative Total (Optimized Product of X^X)
  // Instead of multiplying for each char in sequence, we group by unique char
  // (v^v) * (v^v) ... count times = v^(v * count)
  let product = BigInt(1);
  for (const analysis of charAnalysis) {
    const v = BigInt(analysis.groupSum);
    const count = BigInt(analysis.positions.length);
    // Perform one large exponentiation per unique character group
    product *= (v ** (v * count));
  }

  // 5. Division by total letters
  const letterCount = BigInt(normalized.length);
  const divisionResult = product / letterCount;

  // 6. Digital Root
  const reductionResult = digitalRoot(divisionResult);

  return {
    original: text,
    normalized: normalized,
    charAnalysis,
    sequence,
    step3Total: Number(letterCount), // Reusing this field to store count for UI
    step4Product: product.toString(),
    finalReduced: reductionResult.finalResult,
    reductionSteps: reductionResult.steps,
  };
}