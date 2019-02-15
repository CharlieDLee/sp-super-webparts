import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneButton,
  WebPartContext,
  PropertyPaneButtonType,
  PropertyPaneHorizontalRule,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';
import { RxJsEventEmitter } from '../../libraries/RxJsEventEmitter';

import * as strings from 'SuperSearchFiltersWebPartStrings';
import SuperSearchFilters from './components/SuperSearchFilters';
import ISuperSearchFiltersWebPartProps from './ISuperSearchFiltersWebPartProps';
import ISuperSearchFiltersProps from './components/ISuperSearchFiltersProps';
import { AvailablePeoplesFilters, AvailableEverythingFilters, ISuperSearchFilterSettings } from '../../common/FiltersHelper';

export default class SuperSearchFiltersWebPart extends BaseClientSideWebPart<ISuperSearchFiltersWebPartProps> {
  private readonly _eventEmitter: RxJsEventEmitter = RxJsEventEmitter.getInstance();

  public render(): void {
    this.sendFiltersSettings();
    const element: React.ReactElement<ISuperSearchFiltersProps> = React.createElement(
      SuperSearchFilters,
      {
        context: this.context,
        titleLabel: this.properties.titleLabel,
        noResultsText: this.properties.noResultsText
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

  /**
   * Send filters settings to SuperSearch Results web part
   */
  public sendFiltersSettings(): void {
    const { filters } = this.properties;
    const filtersArray: Array<ISuperSearchFilterSettings> = [];
    for (let i = 0; i < this.properties.filters.length; i++) {
      filtersArray.push({
        type: filters[i].type,
        name: filters[i].name,
        field: filters[i].field
      });
    }
    setTimeout(() => this._eventEmitter.emit("filtersSettingsChange", filters), 1000);
  }

  public renderFilters(type: 'everything' | 'peoples'): Array<any> {
    const availableFilters = type === 'everything' ? AvailableEverythingFilters : AvailablePeoplesFilters;
    const filtersArray = [];
    for (let i = 0; i < this.properties.filters.length; i++) {
      if (this.properties.filters[i].type !== type) {
        continue;
      }
      filtersArray.push(
        ...[
          PropertyPaneTextField(`filters[${i}].name`, {
            label: strings.FilterNameFieldLabel,
          }),
          PropertyPaneDropdown(`filters[${i}].field`, {
            label: strings.FilterValueFieldLabel,
            options: availableFilters.map(f => ({ key: f, text: f }))
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

  public addFilter(type: 'everything' | 'peoples'): void {
    this.properties.filters.push({
      type,
      name: '',
      field: ''
    });
  }

  public removeFilter(index: number): void {
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
              groupFields: [
                PropertyPaneTextField('titleLabel', {
                  label: strings.FiltersTitleFieldLabel
                }),
                PropertyPaneTextField('noResultsText', {
                  label: strings.NoFiltersFieldLabel
                }),
              ]
            }, {
              groupName: strings.PeopleFiltersGroupName,
              groupFields: [
                ...this.renderFilters('peoples'),
                PropertyPaneButton('buttonAddFilter', {
                  text: strings.AddFilterButtonLabel,
                  buttonType: PropertyPaneButtonType.Hero,
                  icon: 'Add',
                  onClick: this.addFilter.bind(this, 'peoples')
                })
              ]
            }, {
              groupName: strings.EverythingFiltersGroupName,
              groupFields: [
                ...this.renderFilters('everything'),
                PropertyPaneButton('buttonAddFilter', {
                  text: strings.AddFilterButtonLabel,
                  buttonType: PropertyPaneButtonType.Hero,
                  icon: 'Add',
                  onClick: this.addFilter.bind(this, 'everything')
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
