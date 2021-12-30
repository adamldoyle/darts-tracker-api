import handler from '../../libs/handler-lib';
import { getContextAttribute } from '../../libs/auth-lib';
import dynamoDb from '../../libs/dynamodb-lib';

export const list = handler(async (event, context) => {
  const email = await getContextAttribute(event.requestContext, 'email');

  const membershipParams = {
    TableName: 'leaguemembership',
    IndexName: 'emailIndex',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  };
  const membershipResult = await dynamoDb.query(membershipParams);
  const leagueKeys = membershipResult.Items.map((item) => item.leagueKey);

  const leagueParamMap = leagueKeys.reduce((acc, leagueKey, idx) => {
    acc[':league' + idx] = leagueKey;
    return acc;
  }, {});

  const leagueParams = {
    TableName: 'leagues',
    FilterExpression: 'leagueKey IN (' + Object.keys(leagueParamMap).join(', ') + ')',
    ExpressionAttributeValues: leagueParamMap,
  };
  const leaguesResult = await dynamoDb.scan(leagueParams);
  return {
    leagues: leaguesResult.Items,
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