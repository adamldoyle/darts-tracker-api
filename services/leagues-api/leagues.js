import handler from '../../libs/handler-lib';
import { getContextAttribute } from '../../libs/auth-lib';
import dynamoDb from '../../libs/dynamodb-lib';

export const list = handler(async (event, context) => {
  const email = getContextAttribute(event.requestContext, 'email');

  const membershipParams = {
    TableName: 'leaguemembership',
    IndexName: 'emailIndex',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  };
  console.log(JSON.stringify(membershipParams));
  const membershipResult = await dynamoDb.query(membershipParams);
  return {
    membership: membershipResult.Items,
  };
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