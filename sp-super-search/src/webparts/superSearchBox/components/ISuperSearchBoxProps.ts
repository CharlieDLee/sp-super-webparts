import { WebPartContext } from "@microsoft/sp-webpart-base";

export default interface ISuperSearchBoxProps {
  context: WebPartContext;
  defaultTab: string;
  searchInputText: string;
  searchButtonText: string;
  everythingDisplayTab: boolean;
  peopleDisplayTab: boolean;
}
