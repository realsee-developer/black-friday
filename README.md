# black-friday

Black Friday Grand Promotion Event

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## SEO Configuration

### IndexNow Setup

IndexNow allows you to notify search engines (Bing, Yandex) about page updates for faster indexing.

1. Generate a unique API key (UUID format recommended):
   ```bash
   uuidgen | tr '[:upper:]' '[:lower:]'
   ```

2. Add the key to your `.env` file:
   ```
   INDEXNOW_KEY=your-generated-key-here
   ```

3. Create a key file in the public directory:
   ```bash
   echo "your-generated-key-here" > public/your-generated-key-here.txt
   ```

4. Submit your site for indexing:
   ```bash
   curl -X GET "https://black-friday.realsee.ai/api/indexnow?key=your-generated-key-here"
   ```

### Search Engine Verification

1. **Google Search Console**: Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to `.env`
2. **Bing Webmaster Tools**: Add `NEXT_PUBLIC_BING_SITE_VERIFICATION` to `.env`

### Analytics Setup

1. **Google Analytics 4**: Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to `.env`
2. **Google Tag Manager**: Add `NEXT_PUBLIC_GTM_ID` to `.env`

See `.env.example` for all available configuration options.
