import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ISuperSearchStaticFilter } from "../../../common/FiltersHelper";

export default interface ISuperSearchResultsProps {
  context: WebPartContext;
  resultsPerPage: number;
  everythingNoResults: string;
  everythingNoSearchText: string;
  peopleNoResults: string;
  peopleRegex: string;
  staticFilters: Array<ISuperSearchStaticFilter>;
}
