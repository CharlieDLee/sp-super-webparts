import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, DisplayMode } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneHorizontalRule,
  IPropertyPaneField,
  PropertyPaneLabel} from '@microsoft/sp-webpart-base';
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';


import * as strings from 'DerrickWebPartStrings';
import Derrick from './components/Derrick';
import { IDerrickWebPartProps } from './IDerrickWebPartProps';
import { IDerrickProps } from './components/IDerrickProps';

export default class DerrickWebPart extends BaseClientSideWebPart<IDerrickWebPartProps> {
  public numberOfQnAs: number = 0;

  public onInit(): Promise<void> {
    this.numberOfQnAs = this.properties.QnAKBs.length;
    return Promise.resolve<void>();
  }

  public render(): void {
    const element: React.ReactElement<IDerrickProps > = React.createElement(
      Derrick,
      {}
    );

    if (this.displayMode === DisplayMode.Edit) {
      this.removeDerrick();
      ReactDom.render(element, this.domElement);
    } else {
      const beebotJSElement = document.getElementById('BeeBotJS');
      if (!beebotJSElement) {
        this.loadDerrick();
      }
      ReactDom.unmountComponentAtNode(this.domElement);
    }
  }

  public loadDerrick() {
    // inject beebot script to Head of the page
    let scriptTag: HTMLScriptElement = document.createElement("script");
    scriptTag.setAttribute('data-bot-color', this.properties.color);
    scriptTag.setAttribute('data-input-box-color', this.properties.inputBoxColor);
    scriptTag.setAttribute('data-bot-accuracy', String(this.properties.accuracy));
    scriptTag.setAttribute('data-enable-logging', String(this.properties.enableLogging));
    scriptTag.setAttribute('data-enable-feedback', String(this.properties.enableFeedback));
    scriptTag.setAttribute('data-enable-speeching', String(this.properties.enableSpeeching));
    scriptTag.setAttribute('data-show-welcome-popup', String(this.properties.showWelcomePopup));
    scriptTag.setAttribute('data-welcome-popup-text', this.properties.welcomePopupText);
    scriptTag.setAttribute('data-welcome-popup-time', this.properties.welcomePopupTime);
    scriptTag.setAttribute('data-qna-kbs', this.properties.QnAKBs.join(';'));
    scriptTag.setAttribute('data-qna-keys', this.properties.QnAKeys.join(';'));
    scriptTag.setAttribute('data-boost-key', this.properties.boostKey);
    scriptTag.setAttribute('data-boost-value', this.properties.boostValue);
    scriptTag.setAttribute('data-boost-multiplier', String(this.properties.boostMultiplier * 100));
    scriptTag.id = 'BeeBotJS';
    scriptTag.src = this.properties.derrickUrl || 'https://beebotdev.azurewebsites.net/beebot/beebot-0.1.1.js';
    scriptTag.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(scriptTag);
    this.runDerrick();
  }

  public runDerrick() {
    // script is already injected, have to init DOMContentLoaded event to run beebot script
    const runTask = setInterval(() => {
      const derrickElement = document.getElementById('beebot');
      if (derrickElement) {
        clearInterval(runTask);
        setTimeout(() => {
          this.setCustomPosition();
        }, 0);
      } else {
        window.document.dispatchEvent(new Event("DOMContentLoaded", {}));
      }
    }, 1);
  }

  public removeDerrick() {
    const derrickElement = document.getElementById('beebot') as HTMLElement;
    if (derrickElement) {
      derrickElement.parentNode.removeChild(derrickElement);
    }
    const derrickJS = document.getElementById('BeeBotJS') as HTMLElement;
    if (derrickJS) {
      derrickJS.parentNode.removeChild(derrickJS);
    }
  }

  public setCustomPosition() {
    const iconElement = document.getElementsByClassName('beebot-message-icon')[0] as HTMLElement;
    iconElement.style.right = this.properties.positionRight;
    iconElement.style.bottom = this.properties.positionBottom;
    const popupElement = document.getElementsByClassName('beebot-welcome')[0] as HTMLElement;
    popupElement.style.right = `${parseInt(this.properties.positionRight, 10) + 87}px`;
    popupElement.style.bottom = `${parseInt(this.properties.positionBottom, 10) + 27}px`;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  public renderQnAEndpointsProperties(): Array<IPropertyPaneField<any>> {
    const QnAsArray = [];
    for (let i = 0; i < this.numberOfQnAs; i++) {
      QnAsArray.push(
        ...[
          PropertyPaneTextField(`QnAKBs[${i}]`, {
            label: strings.QnAKBIdFieldLabel,
          }),
          PropertyPaneTextField(`QnAKeys[${i}]`, {
            label: strings.QnAKeyFieldLabel,
          }),
          PropertyPaneButton(`buttonRemoveQnA[${i}]`, {
            text: strings.RemoveQnAButtonLabel,
            buttonType: PropertyPaneButtonType.Hero,
            icon: 'Delete',
            onClick: this.removeQnA.bind(this, i)
          }),
          PropertyPaneHorizontalRule()
        ]
      );
    }
    if (QnAsArray.length === 0) {
      QnAsArray.push(PropertyPaneLabel('noQnAsLabel', {
        text: 'You should add at least one QnA endpoint.'
      }));
    }
    return QnAsArray;
  }

  public addQnA() {
    this.numberOfQnAs++;
  }

  public removeQnA(index: number) {
    this.properties.QnAKBs.splice(index, 1);
    this.properties.QnAKeys.splice(index, 1);
    this.numberOfQnAs--;
  }

  protected renderMetadataBoostProperties(): Array<IPropertyPaneField<any>> {
    if (!this.properties.useMetadataBoost) {
      return [];
    }

    return [
      PropertyPaneTextField('boostKey', {
        label: strings.BoostKeyFieldLabel,
        value: this.properties.boostKey
      }),
      PropertyPaneTextField('boostValue', {
        label: strings.BoostValueFieldLabel,
        value: this.properties.boostValue
      }),
      PropertyPaneSlider('boostMultiplier', {
        label: strings.BoostMultiplierFieldLabel,
        step: 0.1,
        min: 1,
        max: 2,
        value: this.properties.boostMultiplier
      })
    ];
  }

  protected renderWelcomePopupProperties(): Array<IPropertyPaneField<any>> {
    if (!this.properties.showWelcomePopup) {
      return [];
    }

    return [
      PropertyPaneTextField('welcomePopupText', {
        label: strings.WelcomePopupTextFieldLabel,
        value: this.properties.welcomePopupText,
        multiline: true
      }),
      PropertyPaneTextField('welcomePopupTime', {
        label: strings.WelcomePopupTimeFieldLabel,
        value: this.properties.welcomePopupTime
      })
    ];
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
              groupName: strings.MainGroupName,
              groupFields: [
                PropertyPaneTextField('derrickUrl', {
                  label: strings.DerrickURLFieldLabel,
                  value: this.properties.derrickUrl
                }),
                PropertyFieldColorPicker('color', {
                  label: strings.ColorFieldLabel,
                  selectedColor: this.properties.color,
                  onPropertyChange: () => {},
                  key: 'colorFieldId',
                  properties: this.properties,
                  iconName: 'Precipitation',
                  style: PropertyFieldColorPickerStyle.Inline
                }),
                PropertyFieldColorPicker('inputBoxColor', {
                  label: strings.InputBoxColorFieldLabel,
                  selectedColor: this.properties.inputBoxColor,
                  onPropertyChange: () => {},
                  key: 'inputBoxColorFieldId',
                  properties: this.properties,
                  iconName: 'Precipitation',
                  style: PropertyFieldColorPickerStyle.Inline
                }),
                PropertyPaneSlider('accuracy', {
                  label: strings.AccuracyFieldLabel,
                  min: 1,
                  max: 100,
                  value: this.properties.accuracy
                }),
                PropertyPaneToggle('enableLogging', {
                  label: strings.LoggingFieldLabel,
                  checked: this.properties.enableLogging
                }),
                PropertyPaneToggle('enableFeedback', {
                  label: strings.FeedbackFieldLabel,
                  checked: this.properties.enableFeedback
                }),
                PropertyPaneToggle('enableSpeeching', {
                  label: strings.SpeechingFieldLabel,
                  checked: this.properties.enableSpeeching
                }),
                PropertyPaneTextField('positionRight', {
                  label: strings.PositionRightFieldLabel,
                  value: this.properties.positionRight
                }),
                PropertyPaneTextField('positionBottom', {
                  label: strings.PositionBottomFieldLabel,
                  value: this.properties.positionBottom
                })
              ]
            }, , {
              groupName: strings.QnAGroupName,
              groupFields: [
                ...this.renderQnAEndpointsProperties(),
                PropertyPaneButton('buttonAddFilter', {
                  text: strings.AddQnAButtonLabel,
                  buttonType: PropertyPaneButtonType.Hero,
                  icon: 'Add',
                  onClick: this.addQnA.bind(this)
                })
              ]
            }, {
              groupName: strings.BoostGroupName,
              groupFields: [
                PropertyPaneToggle('useMetadataBoost', {
                  label: strings.UseMetadataBoostFieldLabel,
                  checked: this.properties.useMetadataBoost
                }),
                ...this.renderMetadataBoostProperties()
              ]
            }, {
              groupName: strings.WelcomePopupGroupName,
              groupFields: [
                PropertyPaneToggle('showWelcomePopup', {
                  label: strings.ShowWelcomePopupFieldLabel,
                  checked: this.properties.showWelcomePopup
                }),
                ...this.renderWelcomePopupProperties()
              ]
            }
          ]
        }
      ]
    };
  }
}
