import React, { useState } from 'react';
import { TimelineEntry } from '../../types';
import { MessageSquare, Send, Clock, UserCheck, Bot } from 'lucide-react';

interface ActivityTimelineProps {
  timeline: TimelineEntry[];
  onAddNote: (note: string) => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ timeline, onAddNote }) => {
  const [noteText, setNoteText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(noteText.trim());
    setNoteText('');
  };

  return (
    <div className="space-y-4">
      {/* New Note Input Box */}
      <form onSubmit={handleSubmit} className="p-3 rounded-xl bg-navy-850 border border-slate-800">
        <label htmlFor="analyst-note" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Add Analyst Note or Incident Triage Assessment
        </label>
        <textarea
          id="analyst-note"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add a note about this finding..."
          rows={3}
          className="w-full p-2.5 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 resize-none transition-all"
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-500">
            Notes will be appended to the permanent audit trail.
          </span>
          <button
            type="submit"
            disabled={!noteText.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>Add note</span>
          </button>
        </div>
      </form>

      {/* Timeline Stream */}
      <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((entry) => {
          const isBot = entry.author.toLowerCase().includes('bot') || entry.author.toLowerCase().includes('scanner');

          return (
            <div key={entry.id} className="relative flex items-start gap-3 pl-8 text-xs">
              {/* Dot icon */}
              <div 
                className={`absolute left-2.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full border flex items-center justify-center ${
                  isBot 
                    ? 'bg-navy-900 border-slate-700 text-slate-400' 
                    : 'bg-navy-900 border-cyan-500/50 text-cyan-400'
                }`}
              >
                {isBot ? <Bot className="w-2.5 h-2.5" /> : <UserCheck className="w-2.5 h-2.5" />}
              </div>

              {/* Content */}
              <div className="flex-1 p-3 rounded-xl bg-navy-850/80 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white">{entry.author}</span>
                    <span className="text-[10px] text-slate-500">({entry.role})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {entry.timestamp}
                  </span>
                </div>

                <p className="text-slate-300 font-medium text-xs mb-1">
                  {entry.action}
                </p>

                {entry.note && (
                  <div className="mt-1.5 p-2 rounded-lg bg-navy-900 border border-slate-800/90 text-slate-200 text-xs italic">
                    &ldquo;{entry.note}&rdquo;
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
