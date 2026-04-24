/**
 * Custom reduction logic for the Scientific Math Calculation:
 * 1. Remove zeros from the number.
 * 2. If the remaining digits form a number <= 9, stop.
 * 3. Otherwise, multiply all digits together and repeat.
 * 
 * @param val - The number or BigInt to reduce
 * @returns A single digit (0-9)
 */
export interface ReductionResult {
  finalResult: number;
  steps: string[]; // Intermediate strings showing the process
}

export function digitalRoot(val: bigint | string): ReductionResult {
  let currentValStr = val.toString();
  const steps: string[] = [currentValStr];

  while (currentValStr.length > 1) {
    // 1. Remove zeros from the number
    let strippedStr = currentValStr.replace(/0/g, '');
    
    // If zeros were removed, record the step
    if (strippedStr !== currentValStr) {
      if (strippedStr === '') {
        strippedStr = '0';
      }
      currentValStr = strippedStr;
      steps.push(currentValStr);
    }
    
    // If we're down to a single digit, stop
    if (currentValStr.length <= 1) {
      break;
    }

    // 2. Multiply all digits together using Arbitrary-precision Arithmetic (BigInt)
    const product = currentValStr.split('').reduce((acc, digit) => {
      return acc * BigInt(digit);
    }, BigInt(1));

    currentValStr = product.toString();
    steps.push(currentValStr);
  }

  return {
    finalResult: parseInt(currentValStr, 10),
    steps
  };
}



/**
 * Legacy digital root reduction (summing digits) if needed.
 * Keeping it for potential use in other parts of the app.
 */
export function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return num;
}
