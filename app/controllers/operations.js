import wrap from '../utils/asyncWrapper';


const get = (agent) => wrap(async (req, res) => {
  const {
    dates: {
      startDate,
      endDate,
    },
    url,
  } = req.body;
  const result = await agent.get(url, { dates: { startDate, endDate } });
  if (result) {
    const {
      patch, 
      // latestContent
    } = result;
    return res.json({ status: 'success', result: {
      diff: patch,
      url: agent.getUrl(),
      // latestContent,
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

const content = (agent) => wrap(async (req, res) => {
  const {
    url, // Already encoded url
    date, // Date Id
  } = req.body;
  console.log(req.body);
  const result = await agent.content(url, date);
  if (result) {
    return res.json({ status: 'success', result });
  }
  return res.sendStatus(400);
});

const directory = (agent) => wrap(async (req, res) => {
  const result = await agent.directory();
  if (result) {
    return res.json({ status: 'success', result });
  }
  return res.sendStatus(400);
});

export default {
  get,
  config,
  content,
  directory,
};
