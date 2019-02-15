import * as React from 'react';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { RxJsEventEmitter } from '../../../../libraries/RxJsEventEmitter';
import styles from '../SuperSearchResults.module.scss';
import ISuperSearchPeopleResultProps from './ISuperSearchPeopleResultProps';
import SuperSearchPeopleResult from './SuperSearchPeopleResult';
import { getFiltersData, ISuperSearchFilterSettings } from '../../../../common/FiltersHelper';

const loader = require('../../../../assets/loader.gif');

export interface ISuperSearchPeopleResultsState {
  peoples: Array<MicrosoftGraph.User>;
  filtersSettings: Array<ISuperSearchFilterSettings>;
  nextPageToken: string;
  loading: boolean;
  errorMessage: string;
}

export default class SuperSearchPeoplesResults extends React.Component<ISuperSearchPeopleResultProps, ISuperSearchPeopleResultsState> {
  private readonly _eventEmitter: RxJsEventEmitter = RxJsEventEmitter.getInstance();
  public tenant: string;

  constructor(props: ISuperSearchPeopleResultProps) {
    super(props);
    this.tenant = props.context.pageContext.web.absoluteUrl.slice(8, props.context.pageContext.web.absoluteUrl.indexOf('.sharepoint'));

    this.state = {
      peoples: [],
      filtersSettings: [],
      nextPageToken: null,
      loading: false,
      errorMessage: null
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
      nextPageToken: null
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
  public getFiltersData(results: Array<MicrosoftGraph.User>): void {
    const availableFilters = getFiltersData(results, this.props.filtersSettings);
    this._eventEmitter.emit('filtersChange', availableFilters);
  }

  public async getMSGraphResponse({ apiEndpoint, filters, fieldsSelected, orderBy }: {
    apiEndpoint: string, filters?: string, fieldsSelected?: string, orderBy?: string
  }): Promise<Array<MicrosoftGraph.User>> {
    this.setState({ errorMessage: null });
    const graphClient = await this.props.context.msGraphClientFactory.getClient();

    const { nextPageToken } = this.state;
    const { resultsPerPage } = this.props;
    let response;

    try {
      if (nextPageToken) {
        response = await graphClient.api(apiEndpoint).filter(filters).top(resultsPerPage).orderby(orderBy).skipToken(nextPageToken).select(fieldsSelected).get();
      } else {
        response = await graphClient.api(apiEndpoint).filter(filters).top(resultsPerPage).orderby(orderBy).select(fieldsSelected).get();
      }
    } catch (e) {
      this.setState({
        errorMessage: e.body.message
      });
      return null;
    }

    // Get next page token from response
    if (response['@odata.nextLink']) {
      response['@odata.nextLink'].split('$').forEach(value => {
        if (value.indexOf('skiptoken') > -1 || value.indexOf('skipToken') > -1) {
          this.setState({ nextPageToken: `X%27${value.split('%27')[1]}%27` });
        }
      });
    } else {
      this.setState({ nextPageToken: null });
    }

    return [...response.value];
  }

  public async getData(loadMore?: boolean): Promise<void> {
    this.setState({ loading: true });
    if (!loadMore) {
      this.setState({ peoples: [] });
    }

    const apiEndpoint = '/users';
    const filters = this.prepareQueryFilters();
    const fieldsSelected = 'id,displayName,mail,mobilePhone,accountEnabled,ageGroup,city,companyName,country,department,jobTitle,postalCode,state,userType';
    let peoples: Array<MicrosoftGraph.User> = await this.getMSGraphResponse({ apiEndpoint, filters, fieldsSelected });

    // Test by regex on client side
    const testPersonByRegex = (p) => this.props.regex ? !(new RegExp(this.props.regex).test(p.displayName)) : true;
    peoples = peoples.filter(p => testPersonByRegex(p));
    if (!peoples) {
      return;
    }

    if (loadMore) {
      peoples.unshift(...this.state.peoples);
    }

    this.getFiltersData(peoples);
    this.setState({
      peoples,
      loading: false
    });
  }

  public prepareQueryFilters(): string {
    const { selectedFilters } = this.props;
    const { searchText } = this.props;
    const filtersArray: Array<string> = [];

    // Add search text to query
    if (searchText) {
      filtersArray.push(`(startsWith(givenName, '${searchText}') or startsWith(surname, '${searchText}') or startsWith(displayName, '${searchText}') or startsWith(jobTitle, '${searchText}'))`);
    }

    // Handle filters selected on SuperSearch Filters
    Object.keys(selectedFilters).forEach(filter => {
      const values = [];
      selectedFilters[filter].forEach(value => values.push(`${filter} eq '${value}'`));
      filtersArray.push(values.join(' or '));
    });

    // Handle filters selected on SuperSearch Results web part properties
    this.props.staticFilters.forEach(filter => {
      if (filter.operator === 'startswith') {
        filtersArray.push(`startswith(${filter.field}, '${filter.value}')`);
        return;
      }
      filtersArray.push(`${filter.field} ${filter.operator} '${filter.value}'`);
    });

    return filtersArray.length > 0 ? filtersArray.join(' and ') : '';
  }

  public searchForLetter(letter?: string): void {
    let keywordHashExists = false;
    const hashes = [];
    window.location.hash.slice(1).split('&').forEach(hash => {
      if (hash.indexOf('k=') > -1) {
        keywordHashExists = true;
        if (letter) {
          hashes.push(`k=${letter}`);
        }
        return;
      }
      hashes.push(hash);
    });
    if (!keywordHashExists && letter) {
      hashes.push(`k=${letter}`);
    }
    window.location.href = `${window.location.origin}${window.location.pathname}${window.location.search}#${hashes.map(hash => hash)}`.split(',').join('&');
  }

  public getLetters(): React.ReactElement<ISuperSearchPeopleResultProps> {
    const { searchText } = this.props;
    return (<div>
      <div className={ styles.superSearchByLetter }>
        <div onClick={() => this.searchForLetter()} className={ styles.showAll }>Show all</div>
      </div>
      <div className={ styles.superSearchByLetter }>
        <div onClick={() => this.searchForLetter('A')} className={ searchText.slice(-1) === 'A' ? styles.active : '' }>A</div>
        <div onClick={() => this.searchForLetter('B')} className={ searchText.slice(-1) === 'B' ? styles.active : '' }>B</div>
        <div onClick={() => this.searchForLetter('C')} className={ searchText.slice(-1) === 'C' ? styles.active : '' }>C</div>
        <div onClick={() => this.searchForLetter('D')} className={ searchText.slice(-1) === 'D' ? styles.active : '' }>D</div>
        <div onClick={() => this.searchForLetter('E')} className={ searchText.slice(-1) === 'E' ? styles.active : '' }>E</div>
        <div onClick={() => this.searchForLetter('F')} className={ searchText.slice(-1) === 'F' ? styles.active : '' }>F</div>
        <div onClick={() => this.searchForLetter('G')} className={ searchText.slice(-1) === 'G' ? styles.active : '' }>G</div>
        <div onClick={() => this.searchForLetter('H')} className={ searchText.slice(-1) === 'H' ? styles.active : '' }>H</div>
        <div onClick={() => this.searchForLetter('I')} className={ searchText.slice(-1) === 'I' ? styles.active : '' }>I</div>
        <div onClick={() => this.searchForLetter('J')} className={ searchText.slice(-1) === 'J' ? styles.active : '' }>J</div>
        <div onClick={() => this.searchForLetter('K')} className={ searchText.slice(-1) === 'K' ? styles.active : '' }>K</div>
        <div onClick={() => this.searchForLetter('L')} className={ searchText.slice(-1) === 'L' ? styles.active : '' }>L</div>
        <div onClick={() => this.searchForLetter('M')} className={ searchText.slice(-1) === 'M' ? styles.active : '' }>M</div>
        <div onClick={() => this.searchForLetter('N')} className={ searchText.slice(-1) === 'N' ? styles.active : '' }>N</div>
        <div onClick={() => this.searchForLetter('O')} className={ searchText.slice(-1) === 'O' ? styles.active : '' }>O</div>
        <div onClick={() => this.searchForLetter('P')} className={ searchText.slice(-1) === 'P' ? styles.active : '' }>P</div>
        <div onClick={() => this.searchForLetter('Q')} className={ searchText.slice(-1) === 'Q' ? styles.active : '' }>Q</div>
        <div onClick={() => this.searchForLetter('R')} className={ searchText.slice(-1) === 'R' ? styles.active : '' }>R</div>
        <div onClick={() => this.searchForLetter('S')} className={ searchText.slice(-1) === 'S' ? styles.active : '' }>S</div>
        <div onClick={() => this.searchForLetter('T')} className={ searchText.slice(-1) === 'T' ? styles.active : '' }>T</div>
        <div onClick={() => this.searchForLetter('U')} className={ searchText.slice(-1) === 'U' ? styles.active : '' }>U</div>
        <div onClick={() => this.searchForLetter('V')} className={ searchText.slice(-1) === 'V' ? styles.active : '' }>V</div>
        <div onClick={() => this.searchForLetter('W')} className={ searchText.slice(-1) === 'W' ? styles.active : '' }>W</div>
        <div onClick={() => this.searchForLetter('X')} className={ searchText.slice(-1) === 'X' ? styles.active : '' }>X</div>
        <div onClick={() => this.searchForLetter('Y')} className={ searchText.slice(-1) === 'Y' ? styles.active : '' }>Y</div>
        <div onClick={() => this.searchForLetter('Z')} className={ searchText.slice(-1) === 'Z' ? styles.active : '' }>Z</div>
        <div onClick={() => this.searchForLetter()} className={ styles.all }>All</div>
      </div>
    </div>);
  }

  public render(): React.ReactElement<ISuperSearchPeopleResultProps> {
    const { peoples, loading, nextPageToken, errorMessage } = this.state;

    if (peoples.length === 0) {
      return (
        <div>
          {this.getLetters()}
          <div className={ styles.superSearchResults }>
            {loading && errorMessage && <span>{errorMessage}</span>}
            {loading && !errorMessage && <div className={ styles.superSearchLoader }>
              <img src={`${loader}`} />
            </div>}
            {!loading && <span>{this.props.noResultsMessage}</span>}
          </div>
        </div>
      );
    }

    return (
      <div>
        {this.getLetters()}
        <div className={ styles.superSearchResults }>
          {peoples.map(people => <SuperSearchPeopleResult user={people} tenant={this.tenant} />)}

          <div className={ styles.superSearchLoader }>
            {loading && <img src={`${loader}`} />}
          </div>
          <br style={{ clear: 'both' }} />
        </div>
        {!loading && nextPageToken && <div className={ styles.superSearchLoader }>
          <div className={ styles.superSearchLoadMore }>
            <hr />
            <span onClick={() => this.getData(true)}>Load more</span>
            <hr style={{ float: 'right' }} />
            <br />
            <span className={ styles.superSearchLoadMoreArrow } onClick={() => this.getData(true)}><MdKeyboardArrowDown /></span>
          </div>
        </div>}
      </div>
    );
  }
}
