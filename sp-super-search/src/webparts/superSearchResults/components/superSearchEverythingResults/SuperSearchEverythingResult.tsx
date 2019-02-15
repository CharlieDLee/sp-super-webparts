import * as React from 'react';
import * as moment from 'moment';

import styles from '../SuperSearchResults.module.scss';
import ISuperSearchEverythingResult from './ISuperSearchEverythingResult';
import { getFileIcon } from '../../../../common/IconsHelper';

export interface ISuperSearchEverythingResultState {
  result: ISuperSearchEverythingResult;
}

export default class SuperSearchEverythingResult extends React.Component<ISuperSearchEverythingResultState, {}> {
  public renderDetail(detail: {
    label: string;
    value: string;
  }): JSX.Element {
    return (<div className={ styles.superSearchEverythingDetail }>
      <span className={ styles.superSearchEverythingDetailLabel }>{detail.label}: </span>
      <span>{detail.value}</span>
    </div>);
  }
  public renderDetails(): JSX.Element {
    const { result } = this.props;
    
    const details: Array<JSX.Element> = [];
    details.push(this.renderDetail({ label: 'Author', value: result.Author.split(';').join(', ') }));
    if (result.Created) {
      details.push(this.renderDetail({ label: 'Created', value: moment(result.Created).format('DD/MM/YYYY') }));
    }
    if (result.LastModifiedTime) {
      details.push(this.renderDetail({ label: 'Last update', value: moment(result.LastModifiedTime).format('DD/MM/YYYY') }));
    }
    if (result.FileType) {
      details.push(this.renderDetail({ label: 'File type', value: result.FileType }));
    }

    return (<div>
      {...details}
    </div>);
  }

  public render(): React.ReactElement<ISuperSearchEverythingResult> {
    const { result } = this.props;

    return (
      <div className={ styles.superSearchEverything }>
        <img className={ styles.icon } src={getFileIcon(result.FileExtension)} />
        <div className={ styles.superSearchEverythingDetails }>
          <a className={ styles.superSearchEverythingTitle } href={result.Path}>{result.Title || ' '}</a><br />
          {this.renderDetails()}
        </div>
        <br style={{ clear: 'both' }} />
      </div>
    );
  }
}
