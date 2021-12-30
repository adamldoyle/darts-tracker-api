import handler from '../../libs/handler-lib';
import { getContextAttribute } from '../../libs/auth-lib';

export const list = handler(async (event, context) => {
  const email = getContextAttribute(event.requestContext, 'email');
  return email;
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