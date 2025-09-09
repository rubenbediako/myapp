
'use server';

/**
 * @fileOverview A flow for generating a podcast from text using Text-to-Speech.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const GeneratePodcastInputSchema = z.object({
  title: z.string().describe("The title of the podcast."),
  narrationScript: z.string().describe("The full text narration for the podcast, formatted with speaker labels (e.g., 'Rita:', 'Das:')."),
});

export type GeneratePodcastInput = z.infer<typeof GeneratePodcastInputSchema>;

const GeneratePodcastOutputSchema = z.object({
  audioUrl: z.string().describe("The data URI of the generated audio file in WAV format."),
});

export type GeneratePodcastOutput = z.infer<typeof GeneratePodcastOutputSchema>;

export async function generatePodcast(input: GeneratePodcastInput): Promise<GeneratePodcastOutput> {
    return generatePodcastFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generatePodcastFlow = ai.defineFlow(
    {
        name: 'generatePodcastFlow',
        inputSchema: GeneratePodcastInputSchema,
        outputSchema: GeneratePodcastOutputSchema,
    },
    async (input) => {
        // Standardize speaker labels to prevent TTS model errors
        let narrationScript = input.narrationScript
            .replace(/^(Rita|Rita \(Host\)|Speaker1):/gim, 'Speaker1:')
            .replace(/^(Das|Das \(Economist\)|Speaker2):/gim, 'Speaker2:');
        
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-preview-tts',
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    multiSpeakerVoiceConfig: {
                        speakerVoiceConfigs: [
                            {
                                speaker: 'Speaker1', // Rita
                                voiceConfig: {
                                    prebuiltVoiceConfig: { voiceName: 'Achernar' }, // A female voice
                                },
                            },
                            {
                                speaker: 'Speaker2', // Das
                                voiceConfig: {
                                    prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A male voice
                                },
                            },
                        ],
                    },
                },
            },
            prompt: narrationScript,
        });

        if (!media || !media.url) {
            throw new Error('No audio media returned from the TTS model.');
        }

        const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
        );

        const wavBase64 = await toWav(audioBuffer);

        return {
            audioUrl: `data:audio/wav;base64,${wavBase64}`,
        };
    }
);
