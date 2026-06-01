import { createOrUpdatePost, handleError, parseBody, readPosts, requireBlogAdmin } from "./_blog.js";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "GET") {
      res.status(200).json({ posts: await readPosts() });
      return;
    }

    if (req.method === "POST") {
      if (!requireBlogAdmin(req, res)) {
        return;
      }

      const { post, statusCode } = await createOrUpdatePost(parseBody(req));
      res.status(statusCode).json({ post });
      return;
    }

    res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    handleError(res, error);
  }
}
