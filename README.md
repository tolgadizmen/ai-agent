# AI Personal Assistant Agent

An intelligent personal assistant that integrates with Gmail to help manage and respond to emails using AI.

## Features

- 📧 Gmail integration for email management
- 🔐 Google OAuth authentication
- 🎨 Modern UI with Tailwind CSS
- ⚡ Real-time email fetching
- 🔄 Automatic session management

## Tech Stack

- Next.js 15.3.2
- TypeScript
- Gmail API
- NextAuth.js for authentication
- Tailwind CSS

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd ai-agent
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Configure Google OAuth:

   - Go to the [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Gmail API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3000/api/auth/signin/google`

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000/test](http://localhost:3000/test) to test the Gmail integration.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth configuration
│   │   └── gmail/        # Gmail API endpoints
│   └── test/             # Test page for Gmail
├── lib/                   # Utility functions
│   ├── auth.ts           # Auth configuration
│   └── gmail.ts          # Gmail client
└── components/           # React components
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Gmail API Documentation](https://developers.google.com/gmail/api/guides)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
