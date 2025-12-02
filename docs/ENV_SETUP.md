# 🔐 Environment Setup Required

To make the authentication work, you need to create a `.env.local` file in the root directory of your project.

## Steps:

1.  Create a new file named `.env.local` in the root folder (same level as `package.json`).
2.  Add the following lines to it:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=supersecretkey123
```

> **Note:** You can change `supersecretkey123` to any random string.

## Why is this needed?
NextAuth.js requires a secret to encrypt session cookies and the URL to know where the app is hosted. Without this, you might see errors when trying to log in.

## Restart Server
After creating the file, you might need to restart your development server:
1.  Stop the server (Ctrl+C)
2.  Run `npm run dev` again.
