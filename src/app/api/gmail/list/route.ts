import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { createGmailClient, listEmails } from '@/lib/gmail';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      console.error('No access token found in session');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('Creating Gmail client with token:', session.accessToken.substring(0, 10) + '...');
    const gmail = createGmailClient(session.accessToken as string);

    console.log('Fetching emails...');
    const emails = await listEmails(gmail);
    console.log(`Successfully fetched ${emails.length} emails`);

    return NextResponse.json(emails);
  } catch (error) {
    console.error('Gmail API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
