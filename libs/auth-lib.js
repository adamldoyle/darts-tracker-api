import config from '../config';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognitoClient = new CognitoIdentityServiceProvider({ region: config.region });

export const getContextUser = async (context) => {
  const userSub = context.identity.cognitoAuthenticationProvider.split(':CognitoSignIn:')[1];
  const request = {
    UserPoolId: config.userPoolId,
    Filter: `sub = "${userSub}"`,
    Limit: 1,
  };
  const response = await cognitoClient.listUsers(request).promise();
  if (!response || !response.Users) {
    return undefined;
  }
  return response.Users[0];
}

export const getUserAttribute = (user, attributeName) => {
  if (!user || !user.Attributes) {
    return undefined;
  }
  const attribute = user.Attributes.find((attribute) => attribute.Name === attributeName);
  if (!attribute) {
    return undefined;
  }
  return attribute.Value;
}

export const getContextAttribute = async (context, attributeName) => {
  const user = await getContextUser(context);
  return getUserAttribute(user, attributeName);
}