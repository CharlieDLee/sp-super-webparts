import { WebPartContext } from "@microsoft/sp-webpart-base";

export default interface ISuperSearchFiltersWebPartProps {
  context: WebPartContext;
  titleLabel: string;
  noResultsText: string;
  filters: Array<{
    type: 'everything' | 'peoples',
    name: string,
    field: string
  }>;
}