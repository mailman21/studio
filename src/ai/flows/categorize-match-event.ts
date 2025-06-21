'use server';

/**
 * @fileOverview An AI agent to categorize match events with descriptions.
 *
 * - categorizeMatchEvent - A function that categorizes match events.
 * - CategorizeMatchEventInput - The input type for the categorizeMatchEvent function.
 * - CategorizeMatchEventOutput - The return type for the categorizeMatchEvent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeMatchEventInputSchema = z.object({
  eventDescription: z
    .string()
    .describe('A description of the match event that needs categorization.'),
});
export type CategorizeMatchEventInput = z.infer<typeof CategorizeMatchEventInputSchema>;

const CategorizeMatchEventOutputSchema = z.object({
  category: z.string().describe('The category of the match event.'),
  detailedDescription: z
    .string()
    .describe('A detailed description of the match event for consistent logging.'),
});
export type CategorizeMatchEventOutput = z.infer<typeof CategorizeMatchEventOutputSchema>;

export async function categorizeMatchEvent(
  input: CategorizeMatchEventInput
): Promise<CategorizeMatchEventOutput> {
  return categorizeMatchEventFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeMatchEventPrompt',
  input: {schema: CategorizeMatchEventInputSchema},
  output: {schema: CategorizeMatchEventOutputSchema},
  prompt: `You are an expert match event categorizer for sports referees.

  Given a description of a match event, you will categorize the event and provide a detailed description for consistent logging.

  Description: {{{eventDescription}}}

  Respond with the category and a detailed description of the event.
  `,
});

const categorizeMatchEventFlow = ai.defineFlow(
  {
    name: 'categorizeMatchEventFlow',
    inputSchema: CategorizeMatchEventInputSchema,
    outputSchema: CategorizeMatchEventOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
