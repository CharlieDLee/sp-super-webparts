import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

import ISuperSearchFilter from "../webparts/superSearchFilters/components/ISuperSearchFilter";
import ISuperSearchEverythingResult from '../webparts/superSearchResults/components/superSearchEverythingResults/ISuperSearchEverythingResult';

export interface ISuperSearchFilterSettings {
  type: 'everything' | 'peoples';
  name: string;
  field: string;
}

export interface ISuperSearchStaticFilter {
  type: 'everything' | 'peoples';
  field: string;
  operator: string;
  value: string;
}

export const AvailablePeoplesFilters = [
  'givenName',
  'surname',
  'displayName',
  'mail',
  'accountEnabled',
  'ageGroup',
  'city',
  'companyName',
  'country',
  'department',
  'jobTitle',
  'postalCode',
  'state',
  'userType',
  'skills (not yet implemented)', // Not yet supported on MS Graph
  'interests (not yet implemented)' // Not yet supported on MS Graph
];

export const AvailableEverythingFilters = [
  'Author',
  'FileExtension',
  'FileType',
  'IsDocument',
  'IsContainer'
];

export const AvailableMSGraphOperators = [{
  key: 'eq',
  text: 'equals'
}, {
  key: 'ne',
  text: 'not equals'
}, {
  key: 'gt',
  text: 'greater than'
}, {
  key: 'ge',
  text: 'greater than or equals'
}, {
  key: 'lt',
  text: 'less than'
}, {
  key: 'le',
  text: 'less than or equals'
}, {
  key: 'startswith',
  text: 'starts with'
}];

export const AvailableMSGraphUsersOperators = [{
  key: 'eq',
  text: 'equals'
}, {
  key: 'startswith',
  text: 'starts with'
}];

export const AvailableRestAPIOperators = [{
  key: 'eq',
  text: 'equals'
}, {
  key: 'startswith',
  text: 'starts with'
}];

/**
 * 
 * @param results Results of search
 * @param filtersSettings Settings of filters that comes from SuperSearch Filters web part
 * 
 * This function returns array of filters gathered from search results based on filters settings
 * 
 */
export function getFiltersData(results: Array<MicrosoftGraph.User | ISuperSearchEverythingResult>, filtersSettings: Array<ISuperSearchFilterSettings>): Array<ISuperSearchFilter> {
  const availableFilters: Array<ISuperSearchFilter> = [];
  filtersSettings.forEach(f => {
    availableFilters.push({
      filterName: f.name,
      filterField: f.field,
      values: []
    });
  });

  results.forEach(person => {
    availableFilters.forEach(filter => {
      const value = person[filter.filterField];
      if (value && filter.values.indexOf(value) === -1) {
        filter.values.push(value);
      }
    });
  });

  return availableFilters;
}