import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';

// Voice configurations (copied from ai_voices.ts)
type VoiceConfig = {
  name: string;
  description: string;
  sampleText: string;
};

const voices: { [key: string]: VoiceConfig } = {
  alloy: {
    name: 'Alloy',
    description: 'Upbeat and approachable, great for everyday conversations',
    sampleText:
      "Hey friend! I'm Alloy, and I'm here to make learning fun and easy to understand!",
  },
  ash: {
    name: 'Ash',
    description: 'Steady and reassuring, perfect for calm explanations',
    sampleText:
      "Hi, I'm Ash. Let's take things step by step so everything feels clear and simple.",
  },
  ballad: {
    name: 'Ballad',
    description: 'Playful and musical, adds rhythm to learning',
    sampleText:
      "Hello! I'm Ballad. Let's turn our ideas into stories and songs you’ll always remember!",
  },
  coral: {
    name: 'Coral',
    description: 'Cheerful and bubbly, adds excitement to lessons',
    sampleText:
      "Hi there! I'm Coral, and I can't wait to dive into something fun and exciting with you!",
  },
  echo: {
    name: 'Echo',
    description: 'Relaxing and thoughtful, encourages winding down',
    sampleText:
      "Hello, my friend. I'm Echo, and I’d love to share a calm story with you tonight.",
  },
  fable: {
    name: 'Fable',
    description: 'Imaginative and lively, makes stories come alive',
    sampleText:
      "Greetings! I'm Fable, and I can't wait to whisk you away on an amazing adventure!",
  },
  nova: {
    name: 'Nova',
    description: 'Lively and dynamic, sparks curiosity and excitement',
    sampleText:
      "Hey there! I'm Nova, and I'm ready to blast off into a world of discovery with you!",
  },
  sage: {
    name: 'Sage',
    description: 'Patient and wise, guides learning with care',
    sampleText:
      "Hello. I'm Sage, and I enjoy helping you find answers and discover new ideas.",
  },
  shimmer: {
    name: 'Shimmer',
    description: 'Soft and nurturing, builds a safe learning space',
    sampleText:
      "Hi there, sweet one! I'm Shimmer, and I'm here to have kind, caring talks with you.",
  },
  verse: {
    name: 'Verse',
    description: 'Clear and rhythmic, helps with memory and repetition',
    sampleText:
      "Hello! I'm Verse, and I love practicing words and rhythms to make learning stick!",
  },
};

// Fetch OpenAI API key from environment variable or command-line argument
const args = minimist(process.argv.slice(2));
if (typeof args.apiKey !== "string" || args.apiKey.trim() === "") {
  console.error('❌ Error: OpenAI API key must be provided.');
  process.exit(1);
}
const openai = new OpenAI({
  apiKey: args.apiKey,
});

// Create output directory for voice files
const outputDir = path.join(__dirname, '../assets/voices');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadVoiceSample(voiceId: string, voiceConfig: VoiceConfig): Promise<string> {
  try {
    console.log(
      `Downloading voice sample for: ${voiceConfig.name} (${voiceId})`,
    );

    const response = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: voiceId,
      input: voiceConfig.sampleText,
      instructions: voiceConfig.description,
      response_format: 'mp3',
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `${voiceId}.mp3`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Successfully saved: ${filename}`);

    return filepath;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ Error downloading ${voiceId}:`, error.message);
      throw error;
    } else {
      console.error(`❌ Error downloading ${voiceId}:`, error);
      throw error;
    }
  }
}

async function downloadAllVoices(): Promise<void> {
  console.log('Starting voice sample downloads...\n');

  const voiceIds = Object.keys(voices);
  const results: { voiceId: string; success: boolean; filepath?: string; error?: string }[] = [];

  for (const voiceId of voiceIds) {
    try {
      const filepath = await downloadVoiceSample(voiceId, voices[voiceId]);
      results.push({ voiceId, success: true, filepath });

      // Add a small delay between requests to be respectful to the API
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error: unknown) {
      if (error instanceof Error) {
        results.push({ voiceId, success: false, error: error.message });
      } else {
        results.push({ voiceId, success: false, error: String(error) });
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('DOWNLOAD SUMMARY');
  console.log('='.repeat(50));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Successful downloads: ${successful.length}`);
  successful.forEach((r) => {
    console.log(`   - ${r.voiceId}.mp3`);
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed downloads: ${failed.length}`);
    failed.forEach((r) => {
      console.log(`   - ${r.voiceId}: ${r.error}`);
    });
  }

  console.log(`\nFiles saved to: ${outputDir}`);
}

// Run the download process
downloadAllVoices()
  .then(() => {
    console.log('\n🎉 Voice download process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
