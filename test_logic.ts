import { calculateArabicPower } from './src/lib/calculate';

const tests = [
    { text: "نور ونوره", expected: 8 },
    { text: "جار جلال", expected: 8 },
    { text: "عسل طبيعي", expected: 2 },
    { text: "ماء احمد", expected: 0 } // Expected unknown for now
];

tests.forEach(({ text, expected }) => {
    try {
        const result = calculateArabicPower(text);
        console.log(`Input: ${text}`);
        console.log(`Sequence: ${result.sequence.map(s => s.groupSum).join(' * ')}`);
        console.log(`Product: ${result.step4Product}`);
        console.log(`Reduction Steps: ${result.reductionSteps.join(' -> ')}`);
        console.log(`Final Result: ${result.finalReduced} (Expected: ${expected})`);
        console.log('---');
    } catch (e) {
        console.error(`Error for ${text}:`, e);
    }
});

