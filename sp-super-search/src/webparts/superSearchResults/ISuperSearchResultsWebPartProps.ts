import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ISuperSearchStaticFilter } from "../../common/FiltersHelper";

export default interface ISuperSearchResultsWebPartProps {
  context: WebPartContext;

  globalResultsPerPage: string;

  everythingNoResults: string;
  everythingNoSearchText: string;

  peopleNoResults: string;
  peopleRegex: string;

  filters: Array<ISuperSearchStaticFilter>;
}