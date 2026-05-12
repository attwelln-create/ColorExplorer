'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating age-appropriate
 * hints about colors, to help children identify them.
 *
 * - arcoirisContextualHints - A function that generates a contextual hint for a given color.
 * - ArcoirisContextualHintsInput - The input type for the arcoirisContextualHints function.
 * - ArcoirisContextualHintsOutput - The return type for the arcoirisContextualHints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArcoirisContextualHintsInputSchema = z.object({
  colorName: z.string().describe('The name of the color for which to generate a hint.'),
});
export type ArcoirisContextualHintsInput = z.infer<typeof ArcoirisContextualHintsInputSchema>;

const ArcoirisContextualHintsOutputSchema = z.object({
  hint: z.string().describe('An age-appropriate hint related to an object of the given color.'),
});
export type ArcoirisContextualHintsOutput = z.infer<typeof ArcoirisContextualHintsOutputSchema>;

const arcoirisContextualHintsPrompt = ai.definePrompt({
  name: 'arcoirisContextualHintsPrompt',
  input: {schema: ArcoirisContextualHintsInputSchema},
  output: {schema: ArcoirisContextualHintsOutputSchema},
  prompt: `You are a friendly, helpful educational assistant for young children learning colors.
  
  Provide a very simple, age-appropriate hint for the color "{{{colorName}}}".
  Relate the color to one common, easily recognizable object.
  Keep the hint to one short sentence.

  Example:
  Input: Red
  Output: {"hint": "Think of a juicy, ripe apple!"}

  Input: Yellow
  Output: {"hint": "Like the bright sun in the sky!"}
  `,
});

const arcoirisContextualHintsFlow = ai.defineFlow(
  {
    name: 'arcoirisContextualHintsFlow',
    inputSchema: ArcoirisContextualHintsInputSchema,
    outputSchema: ArcoirisContextualHintsOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await arcoirisContextualHintsPrompt(input);
      if (!output) {
        throw new Error('Failed to generate a hint.');
      }
      return output;
    } catch (error) {
      console.error('Genkit Error in arcoirisContextualHints:', error);
      // Fallback hint if AI service is unavailable
      return {
        hint: `¡Es el color ${input.colorName}! ✨`,
      };
    }
  }
);

export async function arcoirisContextualHints(
  input: ArcoirisContextualHintsInput
): Promise<ArcoirisContextualHintsOutput> {
  return arcoirisContextualHintsFlow(input);
}
