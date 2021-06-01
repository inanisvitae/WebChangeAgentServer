import operationController from '../../controllers/operations';

export default (router, agent) => {
  router.post('/get', operationController.get(agent));
  router.post('/config', operationController.config(agent));
  router.post('/directory', operationController.directory(agent));
  router.post('/content', operationController.content(agent));
};
