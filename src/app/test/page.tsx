'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { EmailMessage } from '@/lib/gmail';

export default function TestPage() {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchEmails();
    }
  }, [status, session]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/gmail/list');
      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }
      const data = await response.json();
      setEmails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-4">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
        <p className="mb-4">Please sign in to access Gmail.</p>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gmail Test Page</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
        <p>Status: {status}</p>
        <p>Email: {session?.user?.email}</p>
      </div>

      <div className="mb-4">
        <button
          onClick={fetchEmails}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Emails'}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Emails</h2>
        {emails.length === 0 ? (
          <p>No emails found</p>
        ) : (
          <div className="space-y-4">
            {emails.map((email) => (
              <div key={email.id} className="border p-4 rounded">
                <h3 className="font-semibold">{email.subject}</h3>
                <p className="text-sm text-gray-600">From: {email.from}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(email.date).toLocaleString()}
                </p>
                <p className="mt-2">{email.snippet}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
