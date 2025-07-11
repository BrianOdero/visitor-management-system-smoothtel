// Optimized email service with retry logic and caching
import { apiCache } from './apiCache';

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const EMAIL_API_URL = 'https://vms-backend-86ch.onrender.com/api/send-email';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Send email with retry logic and timeout
export async function sendEmailWithRetry(
  emailData: EmailData, 
  signal: AbortSignal,
  retryCount = 0
): Promise<Response> {
  try {
    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
      signal
    });

    if (!response.ok && retryCount < MAX_RETRIES) {
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return sendEmailWithRetry(emailData, signal, retryCount + 1);
    }

    return response;
  } catch (error) {
    if (retryCount < MAX_RETRIES && error instanceof Error && error.name !== 'AbortError') {
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return sendEmailWithRetry(emailData, signal, retryCount + 1);
    }
    throw error;
  }
}

// Batch email sending for parallel execution
export async function sendEmailsBatch(emails: EmailData[], signal: AbortSignal): Promise<PromiseSettledResult<Response>[]> {
  const emailPromises = emails.map(email => sendEmailWithRetry(email, signal));
  return Promise.allSettled(emailPromises);
}

// Cache email templates to avoid regeneration
const templateCache = new Map<string, string>();

export function getCachedTemplate(key: string, generator: () => string): string {
  if (!templateCache.has(key)) {
    templateCache.set(key, generator());
  }
  return templateCache.get(key)!;
}

// Clear template cache when needed
export function clearTemplateCache(): void {
  templateCache.clear();
}