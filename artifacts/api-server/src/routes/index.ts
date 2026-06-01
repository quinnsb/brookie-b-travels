import { Router, type IRouter } from "express";
import blogRouter from "./blog";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blogRouter);

export default router;
