import wrap from '../utils/asyncWrapper';


const get = (agent) => wrap(async (req, res) => {
  const {patch: diff, latestContent} = await agent.get();
  if (diff) {
    return res.json({ status: 'success', result: {
      diff,
      url: agent.getUrl(),
      latestContent,
    } });
  }
  return res.sendStatus(400);
});

const config = (agent) => wrap(async (req, res) => {
  const result = await agent.config();
  if (result) {
    return res.json({ status: 'success', result });
  }
  return res.sendStatus(400);
});

export default {
  get,
  config,
};
