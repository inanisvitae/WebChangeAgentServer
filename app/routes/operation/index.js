import operationController from '../../controllers/operations';

export default (router, agent) => {
  router.post('/get', operationController.get(agent));
};
