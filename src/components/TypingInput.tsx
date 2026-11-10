import { Keyboard } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';

interface TypingInputProps {
  value: string;
  disabled: boolean;
  feedback: { kind: 'error' | 'success'; text: string } | null;
  inputRef: RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
}

export default function TypingInput({ value, disabled, feedback, inputRef, onChange }: TypingInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase());
  }

  return (
    <div className={`typing-area ${feedback?.kind === 'error' ? 'has-error' : ''}`}>
      <div className="typing-input-wrap">
        <Keyboard className="input-icon" size={18} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={disabled ? '開始遊戲後，在此輸入英文單字' : '輸入正在落下的單字...'}
          aria-label="輸入英文單字"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
        />
        <span className="input-shortcut">英文輸入</span>
      </div>
      <div className={`input-feedback ${feedback?.kind ?? ''}`} aria-live="polite">
        {feedback ? <><span className="feedback-mark">{feedback.kind === 'error' ? '!' : '✓'}</span>{feedback.text}</> : <span>輸入正確單字即可消除，答錯不會扣除生命</span>}
      </div>
    </div>
  );
}
