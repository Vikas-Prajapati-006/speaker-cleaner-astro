import { defineCollection, z } from 'astro:content';

const devicesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    brand: z.string(),
    brandSlug: z.string(),
    models: z.array(
      z.object({
        name: z.string(),
        slug: z.string(),
        releaseYear: z.number(),
        ipRating: z.string(),
        speakerSetup: z.string(),
        recommendedFrequency: z.number(), // Specific ejection resonance in Hz
        waterProofingLimits: z.string(),
        commonIssues: z.array(z.string()),
      })
    ),
  }),
});

export const collections = {
  devices: devicesCollection,
};