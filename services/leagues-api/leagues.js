import { v4 as uuid } from 'uuid';
import handler from '../../libs/handler-lib';
import { getContextAttribute } from '../../libs/auth-lib';
import dynamoDb from '../../libs/dynamodb-lib';

const checkAuth = async (event) => {
  const email = await getContextAttribute(event.requestContext, 'email');
  if (!email) {
    throw new Error('Not authenticated');
  }
  return email;
};

const getLeague = async (leagueKey, email = undefined) => {
  const leagueParams = {
    TableName: 'leagues',
    Key: {
      leagueKey: leagueKey,
    },
  };
  const leagueResult = await dynamoDb.get(leagueParams);
  if (!leagueResult || !leagueResult.Item) {
    throw new Error('Unknown league');
  }
  const league = leagueResult.Item;

  if (email) {
    const membershipParams = {
      TableName: 'leaguemembership',
      Key: {
        email: email,
        leagueKey: league.leagueKey,
      },
    };
    const membershipResult = await dynamoDb.get(membershipParams);
    if (!membershipResult || !membershipResult.Item) {
      throw new Error('Unknown league');
    }
  }

  return league;
};

export const list = handler(async (event, context) => {
  const email = await checkAuth(event);

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
  const email = await checkAuth(event);

  const leagueKey = event.pathParameters.leagueKey;
  const league = await getLeague(leagueKey, email);

  const membershipParams = {
    TableName: 'leaguemembership',
    KeyConditionExpression: 'leagueKey = :leagueKey',
    ExpressionAttributeValues: {
      ':leagueKey': league.leagueKey,
    },
  };
  const membershipResult = await dynamoDb.query(membershipParams);

  return {
    ...league,
    membership: membershipResult.Items,
  };
});

export const create = handler(async (event, context) => {
  const email = await checkAuth(event);

  const data = JSON.parse(event.body);
  if (!data.leagueKey || !data.name) {
    throw new Error(`leagueKey and name required`);
  }
  let league;
  try {
    league = await getLeague(data.leagueKey);
  } catch (err) {}
  if (league) {
    throw new Error(`leagueKey in use`);
  }

  const leagueParams = {
    TableName: 'leagues',
    Item: {
      leagueKey: data.leagueKey,
      name: data.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };
  await dynamoDb.put(leagueParams);

  const membershipParams = {
    TableName: 'leaguemembership',
    Item: {
      leagueKey: data.leagueKey,
      email: email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };
  await dynamoDb.put(membershipParams);

  return {};
});

export const patchMembership = handler(async (event, context) => {
  const email = await checkAuth(event);

  const leagueKey = event.pathParameters.leagueKey;
  const league = await getLeague(leagueKey, email);

  const membershipParams = {
    TableName: 'leaguemembership',
    KeyConditionExpression: 'leagueKey = :leagueKey',
    ExpressionAttributeValues: {
      ':leagueKey': league.leagueKey,
    },
  };
  const membershipResult = await dynamoDb.query(membershipParams);
  const membership = membershipResult.Items.map((item) => item.email);

  const data = JSON.parse(event.body);
  await Promise.all(
    data
      .filter((newEmail) => !membership.includes(newEmail))
      .map((newEmail) => {
        const membershipParams = {
          TableName: 'leaguemembership',
          Item: {
            leagueKey: league.leagueKey,
            email: newEmail,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        };
        return dynamoDb.put(membershipParams);
      }),
  );

  await Promise.all(
    membership
      .filter((oldEmail) => !data.includes(oldEmail) && oldEmail !== email)
      .map((oldEmail) => {
        const membershipParams = {
          TableName: 'leaguemembership',
          Key: {
            leagueKey: league.leagueKey,
            email: oldEmail,
          },
        };
        return dynamoDb.delete(membershipParams);
      }),
  );

  return {};
});

export const saveGame = handler(async (event, context) => {
  const email = await checkAuth(event);

  const leagueKey = event.pathParameters.leagueKey;
  const league = await getLeague(leagueKey, email);

  const gameId = uuid();
  const data = JSON.parse(event.body);

  const gameParams = {
    TableName: 'games',
    Item: {
      leagueKey: league.leagueKey,
      gameId,
      data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };
  await dynamoDb.put(gameParams);
});

export const listGames = handler(async (event, context) => {
  const email = await checkAuth(event);

  const leagueKey = event.pathParameters.leagueKey;
  const league = await getLeague(leagueKey, email);

  const gameParams = {
    TableName: 'games',
    KeyConditionExpression: 'leagueKey = :leagueKey',
    ExpressionAttributeValues: {
      ':leagueKey': league.leagueKey,
    },
  };
  const gamesResult = await dynamoDb.query(gameParams);
  return {
    games: gamesResult.Items,
  };
});
