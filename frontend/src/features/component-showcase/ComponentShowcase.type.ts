import React from 'react';

export interface ComponentExample {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
  code: string;
}

export interface ComponentShowcaseState {
  selectedComponent: string | null;
  components: ComponentExample[];
}

export interface ComponentShowcaseActions {
  handleComponentSelect: (id: string) => void;
}

export interface UseComponentShowcaseResult {
  state: ComponentShowcaseState;
  actions: ComponentShowcaseActions;
}
