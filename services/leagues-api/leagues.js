import handler from '../../libs/handler-lib';
import * as config from '../../config';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognitoClient = new CognitoIdentityServiceProvider({ region: config.region });

export const list = handler(async (event, context) => {
  const userSub = event.requestContext.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1];
  console.log('config', config);
  console.log('userSub', userSub);
  const request = {
    UserPoolId: config.userPoolId,
    Filter: `sub = "${userSub}"`,
    Limit: 1,
  };
  const users = await cognitoClient.listUsers(request).promise();
  return users;
});

export const get = handler(async (event, context) => {
  return {};
});

export const create = handler(async (event, context) => {
  return {};
});

export const patchMembership = handler(async (event, context) => {
  return {};
});