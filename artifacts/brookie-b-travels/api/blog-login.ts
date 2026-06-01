import { handleError, requireBlogAdmin } from "./_blog.js";

export default function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed." });
      return;
    }

    if (!requireBlogAdmin(req, res)) {
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    handleError(res, error);
  }
}
