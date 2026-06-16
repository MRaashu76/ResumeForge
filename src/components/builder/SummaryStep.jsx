import React from 'react'
import { Textarea } from '../ui'
import { Sparkles } from 'lucide-react'

const tips = [
  'Keep it 2–4 sentences focused on your strongest qualifications.',
  'Mention your years of experience and key expertise areas.',
  'Include what you bring to the role, not just your job history.',
  'Avoid generic phrases like "hard-working team player".',
]

export default function SummaryStep({ data, onChange }) {
  const charCount = data?.length || 0
  const ideal = charCount >= 150 && charCount <= 500

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Professional Summary
        </label>
        <textarea
          rows={6}
          value={data || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Experienced software engineer with 5+ years building scalable web applications. Passionate about clean architecture, developer experience, and shipping products people love..."
          className="input-field resize-none"
        />
        <div className="flex justify-between mt-1.5">
          <span className={`text-xs ${ideal ? 'text-green-500' : charCount > 0 ? 'text-yellow-500' : 'text-text-secondary'}`}>
            {charCount > 0 ? (ideal ? '✓ Good length' : charCount < 150 ? 'Add a bit more detail' : 'Consider trimming') : 'Aim for 150–500 characters'}
          </span>
          <span className="text-xs text-text-secondary">{charCount} chars</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-semibold text-primary">Writing Tips</span>
        </div>
        <ul className="space-y-1.5">
          {tips.map((tip, i) => (
            <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
              <span className="text-primary mt-0.5 flex-shrink-0">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
