export interface IDerrickWebPartProps {
  derrickUrl: string;
  color: string;
  inputBoxColor: string;
  accuracy: number;
  enableLogging: boolean;
  enableFeedback: boolean;
  enableSpeeching: boolean;
  positionRight: string;
  positionBottom: string;
  QnAKBs: Array<string>;
  QnAKeys: Array<string>;
  useMetadataBoost: boolean;
  boostKey: string;
  boostValue: string;
  boostMultiplier: number;
  showWelcomePopup: boolean;
  welcomePopupText: string;
  welcomePopupTime: string;
}