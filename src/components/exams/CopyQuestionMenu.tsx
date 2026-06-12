'use client';

import { useState, useRef, useEffect } from 'react';
import { Copy, ChevronDown } from 'lucide-react';
import sanitizeOption from 'src/utils/sanitizeOption';
import { cn } from '@/lib/utils';

interface CopyQuestionMenuProps {
  questionText: string;
  options: { name: string; order: string }[];
}

const CopyQuestionMenu: React.FC<CopyQuestionMenuProps> = ({ questionText, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFormattedText = () => {
    const optionsText = options.map((opt, idx) => {
      const letter = String.fromCharCode(65 + idx);
      return `${letter}) ${sanitizeOption(opt.name)}`;
    }).join('\n');
    return `${questionText}\n\n${optionsText}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getFormattedText());
    setIsOpen(false);
  };

  const handleSendTo = async (url: string) => {
    await navigator.clipboard.writeText(getFormattedText());
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left shrink-0" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-xl hover:bg-muted focus:outline-none transition-colors"
      >
        <Copy className="w-4 h-4" />
        <span className="hidden sm:inline">Copy</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-popover border border-border rounded-xl shadow-md outline-none overflow-hidden">
          <div className="py-1">
            <button
              onClick={handleCopy}
              className="block w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-muted transition-colors"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => handleSendTo('https://chatgpt.com')}
              className="block w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-muted transition-colors"
            >
              Copy & Open ChatGPT
            </button>
            <button
              onClick={() => handleSendTo('https://claude.ai')}
              className="block w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-muted transition-colors"
            >
              Copy & Open Claude
            </button>
            <button
              onClick={() => handleSendTo('https://gemini.google.com')}
              className="block w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-muted transition-colors"
            >
              Copy & Open Gemini
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyQuestionMenu;
