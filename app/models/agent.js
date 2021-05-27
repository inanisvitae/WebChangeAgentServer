import { createPatch } from 'diff';

class Agent {
  constructor() {
    console.log('Initialized detector agent...');
  }

  get() {
    console.log('Get endpoint is invoked...');
    const patch = createPatch('Website Content Difference', 'example1_str...', 'example2_str....');
    return patch;
  }
}

export default Agent;
