import * as React from 'react';

import { RxJsEventEmitter } from '../../../libraries/RxJsEventEmitter';
import styles from './SuperSearchResults.module.scss';
import ISuperSearchResultsProps from './ISuperSearchResultsProps';
import SuperSearchPeoplesResults from './superSearchPeopleResults/SuperSearchPeoplesResults';
import SuperSearchEverythingResults from './superSearchEverythingResults/SuperSearchEverythingResults';
import { getHashValues, ISuperSearchParameters } from '../../../common/UrlHelper';
import { ISuperSearchFilterSettings } from '../../../common/FiltersHelper';

export interface ISuperSearchResultsState {
  selectedPage: string;
  searchText?: string;
  selectedFilters: { [filterField: string]: Array<string> };
  filtersSettings: Array<ISuperSearchFilterSettings>;
}

export default class SuperSearchResults extends React.Component<ISuperSearchResultsProps, ISuperSearchResultsState> {
  private readonly _eventEmitter: RxJsEventEmitter = RxJsEventEmitter.getInstance();

  constructor(props: ISuperSearchResultsProps) {
    super(props);

    const hashValues: ISuperSearchParameters = getHashValues(window.location.hash);
    this.state = {
      selectedPage: hashValues.p,
      searchText: hashValues.k,
      selectedFilters: JSON.parse(decodeURIComponent(hashValues.f)),
      filtersSettings: []
    };

    this._eventEmitter.on('filtersSettingsChange', this.setFiltersData.bind(this));
    window.addEventListener('hashchange', this.hashChanged.bind(this));
  }

  public componentWillUnmount() {
    this._eventEmitter.off('filtersSettingsChange');
  }

  public setFiltersData(filtersSettings: Array<ISuperSearchFilterSettings>): void {
    this.setState({ filtersSettings });
    this._eventEmitter.emit("hashChange", undefined);
  }

  public hashChanged(): void {
    const hashValues: ISuperSearchParameters = getHashValues(window.location.hash);
    this.setState({
      selectedPage: hashValues.p,
      searchText: hashValues.k,
      selectedFilters: JSON.parse(decodeURIComponent(hashValues.f))
    });
    this._eventEmitter.emit("hashChange", undefined);
  }

  public render(): React.ReactElement<ISuperSearchResultsProps> {
    const { context, resultsPerPage, everythingNoResults, everythingNoSearchText, peopleNoResults, peopleRegex, staticFilters } = this.props;
    const { selectedPage, searchText, selectedFilters, filtersSettings } = this.state;

    return (<div className={ styles.superSearchResult }>
        {selectedPage === 'everything' ? 
          <SuperSearchEverythingResults
            context={context}
            resultsPerPage={resultsPerPage}
            searchText={searchText}
            noResultsMessage={everythingNoResults}
            noSearchTextMessage={everythingNoSearchText}
            staticFilters={staticFilters.filter(f => f.type === 'everything')}
            selectedFilters={selectedFilters}
            filtersSettings={filtersSettings.filter(f => f.type === 'everything')}
          /> : ''}
        {selectedPage === 'people' ?
          <SuperSearchPeoplesResults
            context={context}
            resultsPerPage={resultsPerPage}
            searchText={searchText}
            noResultsMessage={peopleNoResults}
            regex={peopleRegex}
            staticFilters={staticFilters.filter(f => f.type === 'peoples')}
            selectedFilters={selectedFilters}
            filtersSettings={filtersSettings.filter(f => f.type === 'peoples')}
          /> : ''}
        <br style={{ 'clear': 'both' }} />
      </div>
    );
  }
}
