import * as debug from './debug-lib';
import { success, failure } from './response-lib';

export default function handler(lambda) {
  return async function (event, context) {
    debug.init(event, context);
    try {
      const result = await lambda(event, context);
      return success(result);
    } catch (err) {
      debug.flush(err);
      return failure({ error: err.message });
    }
  };
}
