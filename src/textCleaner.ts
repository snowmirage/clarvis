// Text cleaning for speech output
// Strips markdown, code blocks, tables, URLs, and symbols that aren't speakable

export function cleanForSpeech(text: string): string {
  let cleaned = text;

  // Remove code blocks (``` ... ```)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // Remove inline code (`...`)
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // Remove markdown tables (lines starting with | or containing |---|)
  cleaned = cleaned.replace(/^\|.*\|$/gm, '');
  cleaned = cleaned.replace(/^\s*[-|:]+\s*$/gm, '');

  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/\S+/g, '');

  // Convert markdown links [text](url) to just text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove markdown headers (# ## ### etc)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // Remove bold/italic markers
  cleaned = cleaned.replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1');
  cleaned = cleaned.replace(/_{1,3}([^_]+)_{1,3}/g, '$1');

  // Remove bullet points and numbered lists markers
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '');
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, '');

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // Remove file paths (things like /home/user/file.ts or ./src/index.ts)
  cleaned = cleaned.replace(/(?:\.\/|\/[\w.-]+){2,}[\w.-]*/g, '');

  // Remove common symbols that aren't speakable
  cleaned = cleaned.replace(/[{}[\]<>|\\~^]/g, '');

  // Collapse multiple newlines into double
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Collapse multiple spaces
  cleaned = cleaned.replace(/ {2,}/g, ' ');

  // Trim whitespace from each line and remove empty lines
  cleaned = cleaned
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join(' ');

  return cleaned.trim();
}
