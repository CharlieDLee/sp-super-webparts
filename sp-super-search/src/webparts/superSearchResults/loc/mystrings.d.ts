declare interface ISuperSearchResultsWebPartStrings {
  PropertyPaneDescription: string;
  GlobalGroupName: string;
  GlobalResultsPerPageFieldLabel: string;

  EverythingGroupName: string;
  EverythingNoResultsFieldLabel: string;
  EverythingNoSearchTextLabel: string;
  EverythingFiltersLabel: string;

  PeopleGroupName: string;
  PeopleNoResultsFieldLabel: string;
  PeopleRegexFieldLabel: string;
  PeopleFiltersLabel: string;

  FiltersGroupName: string;
  AddFilterButtonLabel: string;
  RemoveFilterButtonLabel: string;
  FilterFieldFieldLabel: string;
  FilterOperatorFieldLabel: string;
  FilterValueFieldLabel: string;
}

declare module 'SuperSearchResultsWebPartStrings' {
  const strings: ISuperSearchResultsWebPartStrings;
  export = strings;
}
