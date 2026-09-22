// Vercel serverless entrypoint. `vercel.json` rewrites every request to this
// function; Vercel's Node runtime adapts the exported Express app to the
// (req, res) handler signature it expects, so no extra glue is needed here.
import { createApp } from '../src/app.js';

const app = createApp();

export default app;
