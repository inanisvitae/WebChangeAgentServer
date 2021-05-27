import { Router } from 'express';
import operation from './operation';

export default (agent) => {
  const router = Router();
  operation(router, agent);
  return router;
};
