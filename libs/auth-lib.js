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
  const user = response.Users?.[0] ?? undefined;
  return user;
}

export const getUserAttribute = (user, attributeName) => {
  return user?.Attributes.find((attribute) => attribute.Name === attributeName)?.Value ?? undefined;
}

export const getContextAttribute = async (context, attributeName) => {
  const user = await getContextUser(context);
  return getUserAttribute(user, attributeName);
}