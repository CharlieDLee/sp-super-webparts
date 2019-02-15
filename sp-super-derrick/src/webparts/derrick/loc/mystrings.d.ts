declare interface IDerrickWebPartStrings {
  PropertyPaneDescription: string;
  MainGroupName: string;
  DerrickURLFieldLabel: string;
  ColorFieldLabel: string;
  InputBoxColorFieldLabel: string;
  AccuracyFieldLabel: string;
  LoggingFieldLabel: string;
  FeedbackFieldLabel: string;
  SpeechingFieldLabel: string;
  PositionRightFieldLabel: string;
  PositionBottomFieldLabel: string;

  QnAGroupName: string;
  AddQnAButtonLabel: string;
  QnAKBIdFieldLabel: string;
  QnAKeyFieldLabel: string;
  RemoveQnAButtonLabel: string;

  BoostGroupName: string;
  UseMetadataBoostFieldLabel: string;
  BoostKeyFieldLabel: string;
  BoostValueFieldLabel: string;
  BoostMultiplierFieldLabel: string;

  WelcomePopupGroupName: string;
  ShowWelcomePopupFieldLabel: string;
  WelcomePopupTextFieldLabel: string;
  WelcomePopupTimeFieldLabel: string;
}

declare module 'DerrickWebPartStrings' {
  const strings: IDerrickWebPartStrings;
  export = strings;
}
