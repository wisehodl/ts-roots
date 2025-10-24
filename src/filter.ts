import { FilterJSON } from "./filter_json";
import { FilterMatch } from "./filter_match";

export const Filter = {
  ...FilterMatch,
  ...FilterJSON,
};
