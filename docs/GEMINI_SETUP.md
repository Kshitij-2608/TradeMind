# 🔑 Google Gemini API Setup

To enable the AI Chart Generation feature, you need to add your Google Gemini API key.

## Steps:

1.  Open the `.env.local` file in the root directory.
2.  Add the following line:

```env
GOOGLE_API_KEY=your_actual_api_key_here
```

## How to get a free API Key?
1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click "Create API Key".
3.  Copy the key and paste it into your `.env.local` file.

## Restart Server
After saving the file, restart your server:
1.  Stop the server (Ctrl+C)
2.  Run `npm run dev` again.
