import { google } from 'googleapis';

// Gmail API scopes
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
];

// Types
export interface EmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  labels: string[];
}

export interface EmailThread {
  id: string;
  messages: EmailMessage[];
  snippet: string;
}

// Gmail API client setup
export function createGmailClient(accessToken: string) {
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  return google.gmail({ version: 'v1', auth });
}

// Helper function: List emails
export async function listEmails(
  gmail: ReturnType<typeof createGmailClient>,
  maxResults = 10
): Promise<EmailMessage[]> {
  console.log('Fetching emails...');

  try {
    console.log('Fetching message list...');
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
    });

    const messages = response.data.messages;
    if (!messages || messages.length === 0) {
      console.log('No messages found');
      return [];
    }

    console.log(`Found ${messages.length} messages`);

    const emailPromises = messages.map(async (message): Promise<EmailMessage> => {
      if (!message.id) {
        throw new Error('Message ID is required');
      }

      console.log(`Fetching message ${message.id}...`);
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });

      if (!email.data.payload?.headers) {
        throw new Error('Email headers not found');
      }

      const headers = email.data.payload.headers;
      const subject = headers.find((h) => h.name === 'Subject')?.value || '(No Subject)';
      const from = headers.find((h) => h.name === 'From')?.value || 'Unknown Sender';
      const date = headers.find((h) => h.name === 'Date')?.value || 'Unknown Date';

      let snippet = email.data.snippet || '';
      if (snippet.length > 100) {
        snippet = snippet.substring(0, 100) + '...';
      }

      return {
        id: message.id,
        threadId: message.threadId || '',
        subject,
        from,
        date,
        snippet,
        labels: email.data.labelIds || [],
      };
    });

    const emails = await Promise.all(emailPromises);
    console.log(`Successfully fetched ${emails.length} emails`);
    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}
