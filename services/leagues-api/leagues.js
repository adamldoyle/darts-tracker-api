import handler from '../../libs/handler-lib';

export const list = handler(async (event, context) => {
  return event.requestContext;
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