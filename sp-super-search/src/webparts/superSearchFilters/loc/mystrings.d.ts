declare interface ISuperSearchFiltersWebPartStrings {
  PropertyPaneDescription: string;
  FiltersTitleFieldLabel: string;
  NoFiltersFieldLabel: string;

  PeopleFiltersGroupName: string;
  EverythingFiltersGroupName: string;

  AddFilterButtonLabel: string;
  RemoveFilterButtonLabel: string;
  FilterNameFieldLabel: string;
  FilterValueFieldLabel: string;
}

declare module 'SuperSearchFiltersWebPartStrings' {
  const strings: ISuperSearchFiltersWebPartStrings;
  export = strings;
}
