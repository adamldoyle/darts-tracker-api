const stage = process.env.stage;
const resourcesStage = process.env.resourcesStage;

const stageConfigs = {
  dev: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_RZmCTlmyP',
  },
  prod: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_RZmCTlmyP',
  },
};

const config = stageConfigs[stage] || stageConfigs.dev;

export default {
  stage,
  resourcesStage,
  ...config,
};
