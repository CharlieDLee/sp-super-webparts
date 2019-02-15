import * as React from 'react';
import axios from 'axios';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { RxJsEventEmitter } from '../../../libraries/RxJsEventEmitter';
import styles from './SuperSearchFilters.module.scss';
import ISuperSearchFiltersProps from './ISuperSearchFiltersProps';
import ISuperSearchFilter from './ISuperSearchFilter';
import { getHashValues, ISuperSearchParameters } from '../../../common/UrlHelper';

export interface ISuperSearchFiltersState {
  filters: Array<ISuperSearchFilter>;
  selectedFilters: { [filterField: string]: Array<string> };
}

export default class SuperSearchFilters extends React.Component<ISuperSearchFiltersProps, ISuperSearchFiltersState> {
  private readonly _eventEmitter: RxJsEventEmitter = RxJsEventEmitter.getInstance();
  public context: WebPartContext;
  public absoluteUrl: string;

  constructor(props: ISuperSearchFiltersProps) {
    super(props);
    this.context = props.context;
    this.absoluteUrl = props.context.pageContext.web.absoluteUrl;
    axios.defaults.headers.common['Accept'] = 'application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8';

    const hashValues: ISuperSearchParameters = getHashValues(window.location.hash);
    this.state = {
      filters: [],
      selectedFilters: JSON.parse(decodeURIComponent(hashValues.f))
    };

    window.addEventListener('hashchange', this.hashChanged.bind(this));
    this._eventEmitter.on('filtersChange', this.availableFiltersChanged.bind(this));
  }

  public hashChanged(): void {
    const hashValues: ISuperSearchParameters = getHashValues(window.location.hash);
    this.setState({
      filters: [],
      selectedFilters: JSON.parse(decodeURIComponent(hashValues.f))
    });
    this.setFilters();
  }

  /**
   * 
   * @param filters Array of filters that comes from SuperSearch Results web part
   * 
   * This method saves available filters from results
   * 
   */
  public availableFiltersChanged(filters: Array<ISuperSearchFilter>): void {
    this.setState({
      filters
    });
    this.setFilters();
  }

  /**
   * Set HTML elements to fit selected filters
   */
  public setFilters(): void {
    const { selectedFilters } = this.state;
    if (Object.keys(selectedFilters).length === 0) {
      this.state.filters.forEach(f => {
        f.values.forEach(v => {
          const filterCheckbox = document.getElementById(`filter-${v}`) as HTMLInputElement;
          if (filterCheckbox) {
            filterCheckbox.checked = false;
          }
        });
      });
      return;
    }

    Object.keys(selectedFilters).forEach(f => {
      selectedFilters[f].forEach(v => {
        const filterCheckbox = document.getElementById(`filter-${v}`) as HTMLInputElement;
        if (filterCheckbox) {
          filterCheckbox.checked = true;
        }
      });
    });
  }

  public getFilterValues(filter: ISuperSearchFilter): Array<string> {
    const values = filter.values.map(v => {
      const filterCheckbox = document.getElementById(`filter-${v}`) as HTMLInputElement;
      if (filterCheckbox.checked) {
        return `"${v}"`;
      }
      return;
    }).filter(v => !!v);
    return values;
  }

  public prepareFilters(filter: ISuperSearchFilter, hash: string, clear?: boolean): string {
    // Parse current filters from hash
    const selectedFilters = JSON.parse(decodeURIComponent(hash.slice(2)));
    let filterFound = false;
    const filterUris = [];

    // Check if applied filter exists on hashes
    Object.keys(selectedFilters).forEach(f => {
      if (f === filter.filterField) {
        // If yes, replace the filter with current values
        filterFound = true;

        // If clear is set to true then do not apply filters
        if (clear) {
          this.setFilters();
          return;
        }

        const newValues = this.getFilterValues(filter);
        if (newValues.length > 0) {
          filterUris.push(`"${f}":[${newValues.join(',')}]`);
        }
        return;
      }

      // If the filter was not applied previously then add it
      filterUris.push(`"${f}":[${selectedFilters[f].map(v => `"${v}"`).join(',')}]`);
    });

    // If applied filter was not found on hashes then add it
    if (!filterFound) {
      const newValues = this.getFilterValues(filter);
      if (newValues.length > 0) {
        filterUris.push(`"${filter.filterField}":[${newValues.join(',')}]`);
      }
    }

    if (filterUris.length === 0) {
      return '';
    }
    return 'f=' + encodeURIComponent(`{${filterUris.join(',')}}`);
  }

  public applyFilters(filter: ISuperSearchFilter, clear?: boolean): void {
    let filterHashExists = false;
    const hashes = [];
    window.location.hash.slice(1).split('&').forEach(hash => {

      // Check if filter hash (f=) exists on hashes
      if (hash.indexOf('f=') > -1) {
        filterHashExists = true;

        // Prepare filters
        hash = this.prepareFilters(filter, hash, clear);
      }

      if (hash) {
        hashes.push(hash);
      }
    });

    // If there is no filter hash (f=) add it
    if (!filterHashExists && filter && !clear) {
      const selectedFilters = this.getFilterValues(filter);
      hashes.push('f=' + encodeURIComponent(`{"${filter.filterField}":[${selectedFilters.join(',')}]}`));
    }

    window.location.href = `${window.location.origin}${window.location.pathname}#${hashes.map(hash => hash).join('&')}`;
  }

  public clearFilters(): void {
    const hashes = window.location.hash.slice(1).split('&').filter(hash => hash.indexOf('f=') === -1);
    window.location.href = `${window.location.origin}${window.location.pathname}#${hashes.map(hash => hash).join('&')}`;
  }

  public renderFilter(filter: string): React.ReactElement<ISuperSearchFiltersProps> {
    return <div className={ styles.filter }>
      <input type="checkbox" id={`filter-${filter}`} />
      <label htmlFor={`filter-${filter}`}>{String(filter)}</label>
    </div>;
  }

  public renderFilters(filter: ISuperSearchFilter): React.ReactElement<ISuperSearchFiltersProps> {
    if (filter.values.length === 0) {
      return;
    }
    return <div className={ styles.filters }>
      <span className={ styles.name }>{filter.filterName}</span><br />
      {filter.values.map(value => this.renderFilter(value))}
      <span className={ styles.button } onClick={() => this.applyFilters(filter)}>Apply</span>
      <span className={ styles.spacer }>|</span>
      <span className={ styles.button } onClick={() => this.applyFilters(filter, true)}>Clear</span>
    </div>;
  }

  public renderFiltersSection(): React.ReactElement<ISuperSearchFiltersProps> {
    const { filters } = this.state;
    return <div className={ styles.superSearchFilters }>
      <span className={ styles.title }>{this.props.titleLabel}</span>
      {!filters.some(f => f.values.length > 0) && <div className={ styles.noFilters }>{this.props.noResultsText}</div>}
      {filters.map(filter => this.renderFilters(filter))}
      {filters.some(f => f.values.length > 0) && <span className={ styles.button } style={{ 'margin-top': '10px' }} onClick={ () => this.clearFilters() }>Clear all filters</span>}
    </div>;
  }

  public render(): React.ReactElement<ISuperSearchFiltersProps> {
    return (
      <div>
        {this.renderFiltersSection()}
      </div>
    );
  }
}
