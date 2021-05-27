import wrap from '../utils/asyncWrapper';


const get = (agent) => wrap(async (req, res) => {
  const result = await agent.get();
  if (result) {
    return res.json({ status: 'success', result });
  }
  return res.sendStatus(400);
});

export default {
  get,
};
