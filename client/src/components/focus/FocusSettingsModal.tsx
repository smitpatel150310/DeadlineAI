import React, { useState, useEffect } from 'react';
import { FocusSettings, PRESETS, DEFAULT_SETTINGS } from '../../hooks/useFocusSettings';
import { X, Save, RotateCcw } from 'lucide-react';

interface FocusSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FocusSettings;
  onSave: (newSettings: Partial<FocusSettings>) => void;
}

export const FocusSettingsModal: React.FC<FocusSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [localSettings, setLocalSettings] = useState<FocusSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleRestore = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  const applyPreset = (presetName: keyof typeof PRESETS) => {
    setLocalSettings(prev => ({ ...prev, ...PRESETS[presetName] }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-md p-6 animate-in zoom-in-95 border-gh-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]" role="dialog" aria-modal="true">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Customize Timer</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors" aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <label className="block">
            <span className="text-sm text-white/70 font-medium">Presets</span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => applyPreset('classic')} className="btn-secondary py-2 text-[10px]">🍅 Classic</button>
              <button onClick={() => applyPreset('study')} className="btn-secondary py-2 text-[10px]">📚 Study</button>
              <button onClick={() => applyPreset('deepWork')} className="btn-secondary py-2 text-[10px]">⚡ Deep Work</button>
              <button onClick={() => applyPreset('sprint')} className="btn-secondary py-2 text-[10px]">🚀 Sprint</button>
            </div>
          </label>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-white/70 font-medium mb-1 block">Focus (min)</span>
              <input 
                type="number" min="1" max="180" 
                value={localSettings.focusDuration}
                onChange={(e) => setLocalSettings({ ...localSettings, focusDuration: parseInt(e.target.value) || 25 })}
                className="input-field"
              />
            </label>
            <label className="block">
              <span className="text-sm text-white/70 font-medium mb-1 block">Short Break (min)</span>
              <input 
                type="number" min="1" max="60" 
                value={localSettings.shortBreakDuration}
                onChange={(e) => setLocalSettings({ ...localSettings, shortBreakDuration: parseInt(e.target.value) || 5 })}
                className="input-field"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-white/70 font-medium mb-1 block">Long Break (min)</span>
              <input 
                type="number" min="1" max="60" 
                value={localSettings.longBreakDuration}
                onChange={(e) => setLocalSettings({ ...localSettings, longBreakDuration: parseInt(e.target.value) || 15 })}
                className="input-field"
              />
            </label>
            <label className="block">
              <span className="text-sm text-white/70 font-medium mb-1 block">Long Break After</span>
              <input 
                type="number" min="1" max="10" 
                value={localSettings.sessionsUntilLongBreak}
                onChange={(e) => setLocalSettings({ ...localSettings, sessionsUntilLongBreak: parseInt(e.target.value) || 4 })}
                className="input-field"
              />
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-white/70 font-medium">Auto-start next session</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={localSettings.autoStartNext}
                onChange={(e) => setLocalSettings({ ...localSettings, autoStartNext: e.target.checked })}
              />
              <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gh-accent-blue"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-white/70 font-medium">Notification Sounds</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={localSettings.soundEnabled}
                onChange={(e) => setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })}
              />
              <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gh-accent-blue"></div>
            </label>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <button onClick={handleRestore} className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm" aria-label="Restore defaults">
            <RotateCcw size={16} /> Defaults
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} className="btn-primary py-2 px-6 flex items-center gap-2">
              <Save size={16} /> Save
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
