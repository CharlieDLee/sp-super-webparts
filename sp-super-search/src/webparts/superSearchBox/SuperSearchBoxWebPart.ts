import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  WebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'SuperSearchBoxWebPartStrings';
import SuperSearchBox from './components/SuperSearchBox';
import ISuperSearchBoxWebPartProps from './ISuperSearchBoxWebPartProps';
import ISuperSearchBoxProps from './components/ISuperSearchBoxProps';

export default class SuperSearchBoxWebPart extends BaseClientSideWebPart<ISuperSearchBoxWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ISuperSearchBoxProps> = React.createElement(
      SuperSearchBox,
      {
        context: this.context,
        defaultTab: this.properties.defaultTab,
        searchInputText: this.properties.searchInputText,
        searchButtonText: this.properties.searchButtonText,
        everythingDisplayTab: this.properties.everythingDisplayTab,
        peopleDisplayTab: this.properties.peopleDisplayTab
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                PropertyPaneDropdown('defaultTab', {
                  label: strings.DefaultTabFieldLabel,
                  options: [{
                    key: 'everything',
                    text: 'Everything'
                  }, {
                    key: 'people',
                    text: 'People'
                  }],
                  selectedKey: this.properties.defaultTab
                }),
                PropertyPaneTextField('searchInputText', {
                  label: strings.SearchInputFieldLabel,
                  value: this.properties.searchInputText
                }),
                PropertyPaneTextField('searchButtonText', {
                  label: strings.SearchButtonFieldLabel,
                  value: this.properties.searchButtonText
                })
              ]
            }, {
              groupName: strings.EverythingGroupName,
              groupFields: [
                PropertyPaneToggle('everythingDisplayTab', {
                  label: strings.EverythingDisplayTabFieldLabel
                })
              ]
            }, {
              groupName: strings.PeopleGroupName,
              groupFields: [
                PropertyPaneToggle('peopleDisplayTab', {
                  label: strings.PeopleDisplayTabFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
