export interface PageProps {
  setCurrentView: (view: string) => void;
  warningsOnly: boolean;
  setWarningsOnly: (value: boolean) => void;
}