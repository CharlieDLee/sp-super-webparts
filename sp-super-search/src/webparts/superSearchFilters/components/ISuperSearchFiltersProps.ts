import { WebPartContext } from "@microsoft/sp-webpart-base";

export default interface ISuperSearchFiltersProps {
  context: WebPartContext;
  titleLabel: string;
  noResultsText: string;
}
