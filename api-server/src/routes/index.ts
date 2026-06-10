import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import adminRouter from "./admin.js";
import ordersRouter from "./orders.js";
import contactRouter from "./contact.js";
import trackRouter from "./track.js";
import productsRouter from "./products.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/admin", adminRouter);
router.use("/orders", ordersRouter);
router.use("/contacts", contactRouter);
router.use("/track", trackRouter);
router.use("/products", productsRouter);

export default router;
