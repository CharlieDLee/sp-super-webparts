import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import axios from 'axios';

import { RxJsEventEmitter } from '../../../../libraries/RxJsEventEmitter';
import styles from '../SuperSearchResults.module.scss';
import SuperSearchEverythingResult from './SuperSearchEverythingResult';
import ISuperSearchEverythingResult from './ISuperSearchEverythingResult';
import { ISuperSearchFilterSettings, getFiltersData } from '../../../../common/FiltersHelper';
import ISuperSearchEverythingResultProps from './ISuperSearchEverythingResultProps';
import { MdKeyboardArrowDown } from 'react-icons/md';

const loader = require('../../../../assets/loader.gif');

export interface ISuperSearchEverythingResultsState {
  results: Array<ISuperSearchEverythingResult>;
  filtersSettings: Array<ISuperSearchFilterSettings>;
  pagesLoaded: number;
  loading: boolean;
  showNextPageButton: boolean;
}

export default class SuperSearchEverythingResults extends React.Component<ISuperSearchEverythingResultProps, ISuperSearchEverythingResultsState> {
  private readonly _eventEmitter: RxJsEventEmitter = RxJsEventEmitter.getInstance();
  public context: WebPartContext;
  public absoluteUrl: string;

  constructor(props: ISuperSearchEverythingResultProps) {
    super(props);
    this.context = props.context;
    this.absoluteUrl = props.context.pageContext.web.absoluteUrl.slice(0, props.context.pageContext.web.absoluteUrl.indexOf(props.context.pageContext.web.serverRelativeUrl));

    this.state = {
      results: [],
      filtersSettings: [],
      pagesLoaded: 0,
      loading: false,
      showNextPageButton: false
    };
  }

  public componentDidMount(): void {
    this._eventEmitter.on('hashChange', this.hashChanged.bind(this));
  }

  public componentWillUnmount(): void {
    this._eventEmitter.off('hashChange');
  }

  /**
   * If hash changed it means query changed, so reset pagination
   */
  public hashChanged(): void {
    this.setState({
      pagesLoaded: 0
    });
    this.getData();
  }

  /**
   * 
   * @param results Results from search
   * 
   * Get results and send filters values to SuperSearch Filters web part
   * 
   */
  public getFiltersData(results: Array<ISuperSearchEverythingResult>): void {
    const availableFilters = getFiltersData(results, this.props.filtersSettings);
    this._eventEmitter.emit('filtersChange', availableFilters);
  }

  public async getAPIResponse(): Promise<Array<ISuperSearchEverythingResult>> {
    const { searchText, resultsPerPage, selectedFilters } = this.props;
    const { pagesLoaded } = this.state;

    // Handle filters selected on SuperSearch Filters
    const filtersArray = [];
    Object.keys(selectedFilters).forEach(filter => {
      const values = [];
      selectedFilters[filter].forEach(v => values.push(`"${v}"`));
      filtersArray.push(values.length > 1 ? `${filter}:or(${values.join(', ')})` : `${filter}:${values[0]}`);
    });

    // Handle filters selected on SuperSearch Results web part properties
    this.props.staticFilters.forEach(filter => {
      if (filter.operator === 'startswith') {
        filtersArray.push(`${filter.field}:starts-with("${filter.value}")`);
        return;
      }
      filtersArray.push(`${filter.field}:"${filter.value}"`);
    });

    const filters = filtersArray.length > 1 ? `and(${filtersArray.join(', ')})` : filtersArray[0];

    const response = await axios.get(`${this.absoluteUrl}/_api/search/query?` +
      `querytext='${searchText}'` +
      `&selectProperties='Created,LastModifiedTime,Title,Author,FileType,FileExtension,Path'` +
      `&rowLimit='${resultsPerPage}'` +
      `&startRow='${pagesLoaded * resultsPerPage}'` + 
      (filters ? `&refinementFilters='${filters}'` : '')
    );

    if (!response.data.PrimaryQueryResult) {
      return;
    }
    const relevantResults = response.data.PrimaryQueryResult.RelevantResults;

    const results: Array<ISuperSearchEverythingResult> = relevantResults.Table.Rows.map(r => {
      let result: any = {};
      r.Cells.forEach(c => result[c.Key] = c.Value);
      return result;
    });

    const showNextPageButton = relevantResults.TotalRows > relevantResults.RowCount + pagesLoaded * resultsPerPage;
    this.setState({
      showNextPageButton
    });

    return results;
  }

  public async getData(loadMore?: boolean): Promise<void> {
    if (!this.props.searchText) {
      return;
    }

    this.setState({ loading: true });
    if (!loadMore) {
      this.setState({ results: [], pagesLoaded: 0 });
    }

    let results = await this.getAPIResponse();
    if (!results) {
      this.setState({
        pagesLoaded: 0,
        loading: false
      });
      return;
    }

    if (loadMore) {
      results.unshift(...this.state.results);
    }

    this.getFiltersData(results);
    this.setState({
      results,
      pagesLoaded: this.state.pagesLoaded + 1,
      loading: false
    });
  }

  public render(): React.ReactElement<ISuperSearchEverythingResultProps> {
    const { searchText } = this.props;
    const { results, loading, showNextPageButton } = this.state;

    if (results.length === 0) {
      return (
        <div>
          <div className={ styles.superSearchResults }>
            {loading && <div className={ styles.superSearchLoader }>
              <img src={`${loader}`} />
            </div>}
            {!loading && searchText && <span>{this.props.noResultsMessage}</span>}
            {!loading && !searchText && <span>{this.props.noSearchTextMessage}</span>}
          </div>
        </div>
      );
    }

    return (<div className={ styles.superSearchResults }>
      {this.state.results.map(result => <SuperSearchEverythingResult result={result} />)}

      <div className={ styles.superSearchLoader }>
        {loading && <div>
          <br />
          <img src={`${loader}`} />
        </div>}
      </div>
      {!loading && showNextPageButton && <div className={ styles.superSearchLoader }>
        <div className={`${styles.superSearchLoadMore} ${styles.superSearchLoadEverything}`}>
          <hr />
          <span onClick={() => this.getData(true)}>Load more</span>
          <hr style={{ float: 'right' }} />
          <br />
          <span className={ styles.superSearchLoadMoreArrow } onClick={() => this.getData(true)}><MdKeyboardArrowDown /></span>
        </div>
      </div>}
      <br style={{ clear: 'both' }} />
    </div>);
  }
}
