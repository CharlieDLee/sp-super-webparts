import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneHorizontalRule,
  PropertyPaneLabel
} from '@microsoft/sp-webpart-base';

import * as strings from 'SuperSearchResultsWebPartStrings';
import SuperSearchResults from './components/SuperSearchResults';
import ISuperSearchResultsWebPartProps from './ISuperSearchResultsWebPartProps';
import ISuperSearchResultsProps from './components/ISuperSearchResultsProps';
import { AvailablePeoplesFilters, AvailableMSGraphUsersOperators, AvailableRestAPIOperators, AvailableEverythingFilters } from '../../common/FiltersHelper';

export default class SuperSearchResultsWebPart extends BaseClientSideWebPart<ISuperSearchResultsWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ISuperSearchResultsProps> = React.createElement(
      SuperSearchResults,
      {
        context: this.context,
        resultsPerPage: parseInt(this.properties.globalResultsPerPage, 10),
        everythingNoResults: this.properties.everythingNoResults,
        everythingNoSearchText: this.properties.everythingNoSearchText,
        peopleNoResults: this.properties.peopleNoResults,
        peopleRegex: this.properties.peopleRegex,
        staticFilters:  this.properties.filters
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

  public getFilters(type: 'everything' | 'peoples'): Array<any> {
    const availableFilters = type === 'everything' ? AvailableEverythingFilters : AvailablePeoplesFilters;
    const availableOperators = type === 'everything' ? AvailableRestAPIOperators : AvailableMSGraphUsersOperators;
    const filtersArray = [];
    for (let i = 0; i < this.properties.filters.length; i++) {
      if (this.properties.filters[i].type !== type) {
        continue;
      }
      filtersArray.push(
        ...[
          PropertyPaneDropdown(`filters[${i}].field`, {
            label: strings.FilterFieldFieldLabel,
            options: availableFilters.map(f => ({ key: f, text: f }))
          }),
          PropertyPaneDropdown(`filters[${i}].operator`, {
            label: strings.FilterOperatorFieldLabel,
            options: availableOperators
          }),
          PropertyPaneTextField(`filters[${i}].value`, {
            label: strings.FilterValueFieldLabel,
          }),
          PropertyPaneButton(`buttonRemoveFilter`, {
            text: strings.RemoveFilterButtonLabel,
            buttonType: PropertyPaneButtonType.Hero,
            icon: 'Delete',
            onClick: this.removeFilter.bind(this, i)
          }),
          PropertyPaneHorizontalRule()
        ]
      );
    }
    return filtersArray;
  }

  public addFilter(type: 'everything' | 'peoples') {
    this.properties.filters.push({
      type,
      field: '',
      operator: '',
      value: ''
    });
  }

  public removeFilter(index: number) {
    this.properties.filters.splice(index, 1);
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
              groupName: strings.GlobalGroupName,
              groupFields: [
                PropertyPaneTextField('globalResultsPerPage', {
                  label: strings.GlobalResultsPerPageFieldLabel
                })
              ]
            },
            {
              groupName: strings.EverythingGroupName,
              groupFields: [
                PropertyPaneTextField('everythingNoResults', {
                  label: strings.EverythingNoResultsFieldLabel
                }),
                PropertyPaneTextField('everythingNoSearchText', {
                  label: strings.EverythingNoSearchTextLabel
                }),
                PropertyPaneLabel('emptyLine', { text: '' }),
                PropertyPaneLabel('everythingFiltersLabel', {
                  text: strings.EverythingFiltersLabel
                }),
                ...this.getFilters('everything'),
                PropertyPaneButton('buttonAddFilter', {
                  text: strings.AddFilterButtonLabel,
                  buttonType: PropertyPaneButtonType.Hero,
                  icon: 'Add',
                  onClick: this.addFilter.bind(this, 'everything')
                })
              ]
            },
            {
              groupName: strings.PeopleGroupName,
              groupFields: [
                PropertyPaneTextField('peopleNoResults', {
                  label: strings.PeopleNoResultsFieldLabel
                }),
                PropertyPaneTextField('peopleRegex', {
                  label: strings.PeopleRegexFieldLabel
                }),
                PropertyPaneLabel('emptyLine', { text: '' }),
                PropertyPaneLabel('peopleFiltersLabel', {
                  text: strings.PeopleFiltersLabel
                }),
                ...this.getFilters('peoples'),
                PropertyPaneButton('buttonAddFilter', {
                  text: strings.AddFilterButtonLabel,
                  buttonType: PropertyPaneButtonType.Hero,
                  icon: 'Add',
                  onClick: this.addFilter.bind(this, 'peoples')
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
