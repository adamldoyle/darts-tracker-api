import AWS from './aws-sdk';
import config from '../config';

const dynamoDb = () => new AWS.DynamoDB.DocumentClient();

const buildParams = (params) => ({
  ...params,
  TableName: `${config.resourcesStage}-dt-${params.TableName}`,
});

export default {
  get: (params) => dynamoDb().get(buildParams(params)).promise(),
  put: (params) => dynamoDb().put(buildParams(params)).promise(),
  query: (params) => dynamoDb().query(buildParams(params)).promise(),
  scan: (params) => dynamoDb().scan(buildParams(params)).promise(),
  update: (params) => dynamoDb().update(buildParams(params)).promise(),
  delete: (params) => dynamoDb().delete(buildParams(params)).promise(),
};
