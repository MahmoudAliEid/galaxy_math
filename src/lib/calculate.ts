import { normalizeArabicText, removeDiacritics } from './rules';
import { digitalRoot } from './reduce';

/**
 * Character analysis result for a unique character group
 */
export interface CharAnalysis {
  char: string;
  normalizedChar: string;
  positions: number[];      // Step 1: 1-indexed positions (1 to N)
  charValue: string;        // Step 2: Product of positions (as string for BigInt)
}

/**
 * Result for a specific position in the original sentence
 */
export interface SequenceStep {
  char: string;            // Original character at this position
  normalizedChar: string;  // Normalized character
  position: number;        // 1-indexed position
  value: string;           // The charValue from Step 2 (as string for BigInt)
}

/**
 * Complete calculation result
 */
export interface CalculationResult {
  original: string;
  normalized: string;
  charAnalysis: CharAnalysis[];
  sequence: SequenceStep[];
  totalSum: string;          // Step 3: Total sum (as string for BigInt)
  finalReduced: number;      // Step 4: Final single digit
  reductionSteps: string[];  // Intermediate steps of reduction
}

/**
 * Calculates the Arabic "Galaxy Math" value:
 * 1. Normalize: Remove spaces, unify variants (Alif group -> 'أ', Ta group -> 'ت').
 * 2. Numbering: Assign positions 1 to N from Right to Left (Start to End of logical string).
 * 3. Character Value: Multiply positions for each identical normalized character.
 * 4. Total Sum: Sum values of all characters in the sequence.
 * 5. Simplification: Sum digits of Total Sum until <= 9.
 */
export function calculateArabicPower(text: string): CalculationResult {
  // 0. Basic validation
  const basicCleaned = removeDiacritics(text).replace(/\s+/g, '');
  if (basicCleaned.length === 0) {
     throw new Error('Input must contain Arabic characters');
  }

  // 1. Normalize (removes spaces and unifies chars)
  const normalized = normalizeArabicText(text);
  
  // 2. Numbering (1-indexed)
  const normalizedCharToPositions = new Map<string, number[]>();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const pos = i + 1;
    
    if (!normalizedCharToPositions.has(char)) {
      normalizedCharToPositions.set(char, []);
    }
    normalizedCharToPositions.get(char)!.push(pos);
  }

  // 3. Step 2: Calculate Character Value (Product of positions)
  const charValueMap = new Map<string, bigint>();
  const charAnalysis: CharAnalysis[] = [];
  
  // We want to maintain order of first appearance for analysis
  const seenChars = new Set<string>();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (!seenChars.has(char)) {
      const positions = normalizedCharToPositions.get(char)!;
      // Multiplication of all positions
      const value = positions.reduce((acc, pos) => acc * BigInt(pos), BigInt(1));
      
      charValueMap.set(char, value);
      charAnalysis.push({
        char, // Using the normalized char as the key
        normalizedChar: char,
        positions,
        charValue: value.toString()
      });
      seenChars.add(char);
    }
  }

  // 4. Step 3: التعويض والجمع (Sum values of all characters in sequence)
  const sequence: SequenceStep[] = [];
  let totalSum = BigInt(0);

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const pos = i + 1;
    const value = charValueMap.get(char)!;
    
    sequence.push({
      char,
      normalizedChar: char,
      position: pos,
      value: value.toString()
    });
    
    totalSum += value;
  }

  // 5. Step 4: التبسيط النهائي (Digital Root by summation)
  const reductionResult = digitalRoot(totalSum);

  return {
    original: text,
    normalized,
    charAnalysis,
    sequence,
    totalSum: totalSum.toString(),
    finalReduced: reductionResult.finalResult,
    reductionSteps: reductionResult.steps,
  };
}