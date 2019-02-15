import * as React from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

import styles from '../SuperSearchResults.module.scss';

export interface ISuperSearchPeopleResultState {
  user: MicrosoftGraph.User;
  tenant: string;
}

export default class SuperSearchPeopleResult extends React.Component<ISuperSearchPeopleResultState> {
  public render(): React.ReactElement<MicrosoftGraph.User> {
    const { user, tenant } = this.props;
    const URL = `https://${tenant}-my.sharepoint.com/_layouts/15/me.aspx/?u=${user.id}&v=work`;

    return (
      <div className={ styles.superSearchPeople }>
        <div className={ styles.superSearchUserPhoto } style={{ 'background-image': `url(/_layouts/15/userphoto.aspx?size=L&accountname=${user.mail})` }}></div>
        <a href={URL} className={ styles.superSearchUserName } target="_blank">{user.displayName}</a>
        <span className={ styles.superSearchUserTitle }>{user.jobTitle || ' '}</span>
        <a href={`mailto:${user.mail}`}><FaEnvelope className={ styles.icon } /></a>
        {user.mobilePhone ? <a href={`tel:${user.mobilePhone}`}><FaPhone className={ styles.icon } /></a> : null}
      </div>
    );
  }
}
