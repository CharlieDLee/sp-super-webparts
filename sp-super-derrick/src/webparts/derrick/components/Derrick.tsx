import * as React from 'react';
import styles from './Derrick.module.scss';
import { IDerrickProps } from './IDerrickProps';

const icon = require('../assets/icon.png');

export default class Derrick extends React.Component<IDerrickProps, {}> {
  public render(): React.ReactElement<IDerrickProps> {
    return (
      <div className={ styles.derrickWebPart }>
        <div className={ styles.text }>
          Thanks for adding me to your site. To configure my properties and behaviour, please edit this web parts properties using the pen icon to the left. Note: You will only see me here in edit mode, the rest of the time I will be displayed in the bottom right corner.<br />
          <br />
          Derrick
        </div>
        <img src={String(icon)} />
        <br style={{ clear: 'both' }} />
      </div>
    );
  }
}
