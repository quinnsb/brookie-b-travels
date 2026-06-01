# Brookie B Travels Blog Backend

The deployed Vercel site includes simple admin API routes for publishing blog posts from `/admin/blog`.

## Admin Login

Default local development login:

- Username: `brooke`
- Password: `travel2026`

Production requires explicit environment variables:

```bash
BLOG_ADMIN_USERNAME=brooke
BLOG_ADMIN_PASSWORD=change-this-before-sharing
```

## Vercel Environment Variables

Add these to the Vercel project:

```bash
BLOG_ADMIN_USERNAME=brooke
BLOG_ADMIN_PASSWORD=change-this-before-sharing
BLOG_GITHUB_TOKEN=github_fine_grained_token_here
GITHUB_REPO=quinnsb/brookie-b-travels
GITHUB_BRANCH=main
```

`BLOG_GITHUB_TOKEN` should be a fine-grained GitHub token with **Contents: Read and write** access to only the `quinnsb/brookie-b-travels` repository.

## How It Works

- `GET /api/blog-posts` reads published client-created posts from `data/blog-posts.json`.
- `POST /api/blog-login` validates the admin username/password.
- `POST /api/blog-posts` saves the blog post JSON and uploads the featured image into the GitHub repo.
- Uploaded images are stored under `public/blog-uploads` and returned as raw GitHub image URLs.
- The admin UI compresses featured images in the browser before upload.

## Client Workflow

1. Visit `/admin/blog`.
2. Log in with the blog admin username/password.
3. Fill out the title, excerpt, keywords, featured image, image alt text, and body.
4. Use blank lines in the body field to create paragraphs.
5. Click **Save Blog Post**.
6. Use the **View post** link to review the new article.

## Notes

The public site has static fallback posts. If the API is temporarily unavailable, the marketing site and existing static blog content still load.
