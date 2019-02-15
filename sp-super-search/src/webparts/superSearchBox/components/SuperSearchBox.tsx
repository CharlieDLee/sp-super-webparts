import * as React from 'react';
import axios from 'axios';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import styles from './SuperSearchBox.module.scss';
import ISuperSearchBoxProps from './ISuperSearchBoxProps';
import { getHashValues, ISuperSearchParameters } from '../../../common/UrlHelper';

export interface ISuperSearchBoxState {
  selectedPage: string;
  searchText?: string;
  selectedFilters: { [filterField: string]: Array<string> };
}

export default class SuperSearchBox extends React.Component<ISuperSearchBoxProps, ISuperSearchBoxState> {
  public context: WebPartContext;
  public absoluteUrl: string;

  constructor(props: ISuperSearchBoxProps) {
    super(props);
    this.context = props.context;
    this.absoluteUrl = props.context.pageContext.web.absoluteUrl;
    axios.defaults.headers.common['Accept'] = 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8';

    const hashValues: ISuperSearchParameters = getHashValues(window.location.hash);
    this.state = {
      selectedPage: hashValues.p || this.props.defaultTab,
      searchText: hashValues.k,
      selectedFilters: JSON.parse(decodeURIComponent(hashValues.f))
    };

    // Execute first search to set the hash if it is not provided
    this.search();
    window.addEventListener("hashchange", this.hashChanged.bind(this));
  }

  public hashChanged(): void {
    const hashValues: ISuperSearchParameters = getHashValues(window.location.hash);
    this.setState({
      selectedPage: hashValues.p,
      searchText: hashValues.k,
      selectedFilters: JSON.parse(decodeURIComponent(hashValues.f))
    });
  }

  public changeTab(selectedPage: string): void {
    this.setState({ selectedPage, selectedFilters: {} });

    // Make sure that state was updated before searching
    setTimeout(this.search.bind(this), 0);
  }

  /**
   * Search method sets the URL parameters which is processed by SuperSearch Results
   */
  public search(): void {
    const { selectedPage, searchText, selectedFilters } = this.state;
    const query = searchText ? `&k=${searchText}` : '';
    const filters = Object.keys(selectedFilters).length > 0 ? `&f=${JSON.stringify(selectedFilters)}` : '';
    switch (selectedPage) {
      case 'everything':
        window.location.href = `${window.location.origin}${window.location.pathname}${window.location.search}#p=everything${query}${filters}`;
        break;
      case 'people':
        window.location.href = `${window.location.origin}${window.location.pathname}${window.location.search}#p=people${query}${filters}`;
        break;
    }
  }

  /**
   * Keep hash always decoded
   */
  public decodeHash(): void {
    window.location.hash = decodeURIComponent(window.location.hash);
  }

  public renderTab(page: string, selectedPage: string): React.ReactElement<ISuperSearchBoxProps> {
    if (!this.props[`${page}DisplayTab`]) {
      return;
    }

    const name = `${page[0].toUpperCase()}${page.slice(1)}`; // Capitalize the name
    return (
      <div
        className={`${styles.superSearchNavigationItem} ${page === selectedPage ? styles.active : ''}`}
        onClick={() => this.changeTab(page)}
      >
        {name}
      </div>
    );
  }

  public render(): React.ReactElement<ISuperSearchBoxProps> {
    this.decodeHash();

    const { selectedPage } = this.state;
    return (
      <div className={styles.superSearchBox}>
        <div className={styles.superSearchNavigation}>
          {this.renderTab('everything', selectedPage)}
          {this.renderTab('people', selectedPage)}
        </div>
        <div className={styles.superSearchBody}>
          <input
            className={styles.superSearchInput}
            placeholder={this.props.searchInputText}
            value={this.state.searchText}
            onChange={(event) => this.setState({ searchText: event.target.value })}
            onKeyPress={(event) => event.charCode === 13 ? this.search() : false}
          />
          <button
            className={styles.superSearchButton}
            onClick={this.search.bind(this)}
          >{this.props.searchButtonText}</button>
        </div>
        <br style={{ 'clear': 'both' }} />
      </div>
    );
  }
}
