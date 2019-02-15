import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ISuperSearchFilterSettings } from "../../../../common/FiltersHelper";

export default interface ISuperSearchEverythingResultProps {
    context: WebPartContext;
    resultsPerPage: number;
    noResultsMessage: string;
    noSearchTextMessage: string;
    staticFilters: Array<{
      field: string,
      operator: string,
      value: string
    }>;
    searchText?: string;
    selectedFilters: { [filterField: string]: Array<string> };
    filtersSettings: Array<ISuperSearchFilterSettings>;
}
  