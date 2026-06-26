import { useState, useEffect } from 'react';

export interface FocusSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  autoStartNext: boolean;
  soundEnabled: boolean;
}

export const DEFAULT_SETTINGS: FocusSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartNext: false,
  soundEnabled: true,
};

export const PRESETS = {
  classic: { focusDuration: 25, shortBreakDuration: 5, longBreakDuration: 15, sessionsUntilLongBreak: 4 },
  study: { focusDuration: 45, shortBreakDuration: 10, longBreakDuration: 20, sessionsUntilLongBreak: 4 },
  deepWork: { focusDuration: 50, shortBreakDuration: 10, longBreakDuration: 20, sessionsUntilLongBreak: 4 },
  sprint: { focusDuration: 90, shortBreakDuration: 20, longBreakDuration: 30, sessionsUntilLongBreak: 3 },
};

// Developer testing mode override
export const IS_DEV_TESTING = false;

export function useFocusSettings() {
  const [settings, setSettings] = useState<FocusSettings>(() => {
    const saved = localStorage.getItem('deadlineai_focus_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('deadlineai_focus_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<FocusSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const getEffectiveSettings = (): FocusSettings => {
    if (IS_DEV_TESTING) {
      return {
        ...settings,
        focusDuration: 10 / 60, // 10 seconds (stored in minutes)
        shortBreakDuration: 5 / 60,
        longBreakDuration: 8 / 60,
      };
    }
    return settings;
  };

  return { settings, effectiveSettings: getEffectiveSettings(), updateSettings };
}
