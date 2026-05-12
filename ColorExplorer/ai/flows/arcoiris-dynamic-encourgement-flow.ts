'use server';
/**
 * @fileOverview This file exports a Genkit flow for generating dynamic and encouraging messages
 * for the "Arcoíris" character in the Color Explorer app.
 *
 * - generateArcoirisMessage - A function that generates an encouraging message based on game state.
 * - ArcoirisMessageInput - The input type for the generateArcoirisMessage function.
 * - ArcoirisMessageOutput - The return type for the generateArcoirisMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArcoirisMessageInputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the player got the answer correct.'),
  attemptNumber:
    z.number()
      .int()
      .min(1)
      .describe('The attempt number for the current question (1 for first try, 2 for second, etc.).'),
  colorName: z.string().optional().describe('The name of the color being guessed, if relevant.'),
});
export type ArcoirisMessageInput = z.infer<typeof ArcoirisMessageInputSchema>;

const ArcoirisMessageOutputSchema = z.object({
  message: z.string().describe('An encouraging message from Arcoíris.'),
});
export type ArcoirisMessageOutput = z.infer<typeof ArcoirisMessageOutputSchema>;

export async function generateArcoirisMessage(
  input: ArcoirisMessageInput,
): Promise<ArcoirisMessageOutput> {
  return arcoirisDynamicEncouragementFlow(input);
}

const arcoirisMessagePrompt = ai.definePrompt({
  name: 'arcoirisMessagePrompt',
  input: {schema: ArcoirisMessageInputSchema},
  output: {schema: ArcoirisMessageOutputSchema},
  prompt: `You are Arcoíris, a cute, friendly, and encouraging animated star character in a children's educational game.
Your goal is to provide short, positive, and varied messages to a 7-year-old child learning colors.
Always respond in Spanish. Keep the messages around 3-8 words. Use emojis if appropriate.

Here is the current game context:
- Did the player get the answer correct? {{{isCorrect}}}
- This was their attempt number: {{{attemptNumber}}}
{{#if colorName}}
- The color was: {{{colorName}}}
{{/if}}

If the player got it CORRECT (isCorrect is true):
Generate a message that celebrates their success and is enthusiastic. Vary your messages to avoid repetition.
Examples: "¡Increíble! 🎉", "¡Fabuloso! ✨", "¡Excelente trabajo! 🌈", "¡Lo lograste! ⭐", "¡Así se hace! 💪"

If the player got it WRONG (isCorrect is false):
Generate a message that is encouraging and gentle, prompting them to try again without making them feel bad. Vary your messages.
Examples: "¡Casi! 💪 Inténtalo otra vez.", "¡No te rindas! ¡Estás cerca! 🤔", "¡Un pequeño error, sigue adelante! 💡", "¡Vamos, tú puedes! 👍"

Your message should be tailored to the context. Focus on positive reinforcement for correct answers and gentle encouragement for wrong ones.`,
});

const arcoirisDynamicEncouragementFlow = ai.defineFlow(
  {
    name: 'arcoirisDynamicEncouragementFlow',
    inputSchema: ArcoirisMessageInputSchema,
    outputSchema: ArcoirisMessageOutputSchema,
  },
  async input => {
    try {
      const {output} = await arcoirisMessagePrompt(input);
      if (!output) {
        throw new Error('Failed to generate Arcoíris message.');
      }
      return output;
    } catch (error) {
      console.error('Genkit Error in arcoirisDynamicEncouragement:', error);
      // Fallback Spanish messages if AI service is unavailable
      if (input.isCorrect) {
        const happyMessages = ["¡Muy bien! 🎉", "¡Excelente! ✨", "¡Lo lograste! 🌈", "¡Fabuloso! ⭐"];
        return { message: happyMessages[Math.floor(Math.random() * happyMessages.length)] };
      } else {
        const encouragingMessages = ["¡Casi! Inténtalo otra vez. 💪", "¡Vamos, tú puedes! 👍", "¡Sigue intentando! 💡"];
        return { message: encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)] };
      }
    }
  },
);
