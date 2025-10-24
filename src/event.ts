import { EventID } from "./id";
import { Sign } from "./sign";
import { Validate } from "./validate";

export const Event = {
  ...EventID,
  ...Sign,
  ...Validate,
};
