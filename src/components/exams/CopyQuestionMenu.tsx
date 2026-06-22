'use client';

import { useState, useRef, useEffect } from 'react';
import { Copy, ChevronDown, Check } from 'lucide-react';
import sanitizeOption from 'src/utils/sanitizeOption';
import { cn } from '@/lib/utils';

interface CopyQuestionMenuProps {
  questionText: string;
  options: { name: string; order: string }[];
}

const CopyQuestionMenu: React.FC<CopyQuestionMenuProps> = ({ questionText, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  // Sort options by their order field to ensure correct letter assignment
  const sortedOptions = [...options].sort((a, b) => a.order.localeCompare(b.order));

  const getFormattedText = () => {
    const optionsText = sortedOptions.map((opt, idx) => {
      const letter = String.fromCharCode(65 + idx);
      return `${letter}) ${sanitizeOption(opt.name)}`;
    }).join('\n');
    return `Explica-me esta pergunta e as respetivas opções:\n\n${questionText}\n\n${optionsText}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getFormattedText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsOpen(false);
  };

  const handleSendTo = async (platform: 'chatgpt' | 'claude' | 'gemini') => {
    const promptText = getFormattedText();
    await navigator.clipboard.writeText(promptText);
    
    const encodedPrompt = encodeURIComponent(promptText);
    let url = '';
    
    if (platform === 'chatgpt') {
      url = `https://chatgpt.com/?q=${encodedPrompt}`;
    } else if (platform === 'claude') {
      url = `https://claude.ai/new?q=${encodedPrompt}`;
    } else if (platform === 'gemini') {
      url = 'https://gemini.google.com/app';
    }
    
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex text-left shrink-0" ref={menuRef}>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-r-0 border-border rounded-l-xl hover:bg-muted focus:outline-none transition-colors"
      >
        <Copy className="w-4 h-4" />
        <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
        {copied && <Check className="w-4 h-4 text-green-500" />}
      </button>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-2 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-r-xl hover:bg-muted focus:outline-none transition-colors"
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 w-48 mt-2 origin-top-right bg-popover border border-border rounded-xl shadow-md outline-none overflow-hidden">
          <div className="py-1">
            <button
              onClick={() => handleSendTo('chatgpt')}
              className="block w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-muted transition-colors"
            >
              Perguntar ao ChatGPT
            </button>
            <button
              onClick={() => handleSendTo('claude')}
              className="block w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-muted transition-colors"
            >
              Perguntar ao Claude
            </button>
            <button
              onClick={() => handleSendTo('gemini')}
              className="block w-full px-4 py-2 text-sm text-left text-popover-foreground hover:bg-muted transition-colors"
            >
              Perguntar ao Gemini
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyQuestionMenu;
