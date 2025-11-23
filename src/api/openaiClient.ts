const OPENAI_TIMEOUT_MS = 15000;

export interface GenerateAiTextParams {
  fieldKey: string;
  userInput: string;
  additionalContext?: string;
}

export class AiError extends Error {
  code?: string;
  status?: number;
  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "AiError";
    this.code = code;
    this.status = status;
  }
}

export async function generateAiText({
  fieldKey,
  userInput,
  additionalContext,
}: GenerateAiTextParams): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new AiError(
      "OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.",
      "MISSING_API_KEY"
    );
  }

  const prompt = `
You are helping a citizen fill out a government social support application.
Write a clear, respectful, and honest paragraph for the field "${fieldKey}".

User rough notes:
${userInput || "No notes provided."}

Additional context (if any):
${additionalContext || "None."}

Constraints:
- Neutral and formal tone.
- No exaggeration.
- Do not invent facts.
- 3–6 sentences maximum.
`.trim();

  // Timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.4,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AiError(
          "Authentication with OpenAI failed. Please check your API key.",
          "UNAUTHORIZED",
          response.status
        );
      }
      if (response.status === 429) {
        throw new AiError(
          "OpenAI rate limit exceeded. Please wait a moment and try again.",
          "RATE_LIMIT",
          response.status
        );
      }
      if (response.status >= 500) {
        throw new AiError(
          "OpenAI service is temporarily unavailable. Please try again later.",
          "SERVER_ERROR",
          response.status
        );
      }

      throw new AiError(
        `OpenAI API returned an error (status ${response.status}).`,
        "HTTP_ERROR",
        response.status
      );
    }

    const json = await response.json();

    const content = json?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new AiError(
        "AI did not return any suggestion. Please try again.",
        "EMPTY_RESPONSE"
      );
    }

    return content;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new AiError(
        "The AI request took too long and was cancelled. Please check your internet connection and try again.",
        "TIMEOUT"
      );
    }

    if (err instanceof AiError) {
      throw err;
    }
    
    throw new AiError(
      "An unexpected error occurred while generating the AI suggestion. Please try again.",
      "UNKNOWN"
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
