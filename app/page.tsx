'use client';

import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { generateVideoPlan, type VideoPlan, type VisualStyle, defaultOptions } from '../lib/generator';

type FormState = {
  topic: string;
  mood: string;
  tone: string;
  visualStyle: VisualStyle;
  atmosphere: string;
  sceneCount: number;
  includeVoiceover: boolean;
  includeThumbnail: boolean;
};

const initialState: FormState = {
  topic: '',
  mood: defaultOptions.mood,
  tone: defaultOptions.tone,
  visualStyle: defaultOptions.visualStyle,
  atmosphere: defaultOptions.atmosphere,
  sceneCount: defaultOptions.sceneCount,
  includeVoiceover: false,
  includeThumbnail: false
};

export default function Page() {
  const [state, setState] = useState<FormState>(initialState);
  const [result, setResult] = useState<VideoPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const canGenerate = state.topic.trim().length > 0 && !loading;

  const onChange = (patch: Partial<FormState>) => setState(s => ({ ...s, ...patch }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canGenerate) return;
    setLoading(true);
    try {
      const plan = generateVideoPlan(state);
      setResult(plan);
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const copyJSON = async () => {
    if (!result) return;
    await copy(JSON.stringify(result, null, 2));
  };

  const sample = () => {
    onChange({
      topic: 'A lone cyclist racing sunrise through misty city streets',
      mood: 'energizing',
      tone: 'reflective',
      visualStyle: 'cinematic',
      atmosphere: 'neon reflections on wet streets',
      sceneCount: 6,
      includeVoiceover: true,
      includeThumbnail: true
    });
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">Text?to?Video Generator Agent</div>
          <div className="subtitle">Turn any idea into cinematic, production?ready video prompts</div>
        </div>
        <div className="inline">
          <button className="button ghost" type="button" onClick={sample}>Sample</button>
          <a className="button secondary" href="https://vercel.com" target="_blank" rel="noreferrer">Deploy</a>
        </div>
      </div>

      <form onSubmit={onSubmit} className="card">
        <div className="card-body grid">
          <div className="grid grid-2">
            <div>
              <div className="row">
                <label className="label">Topic</label>
                <textarea
                  className="textarea"
                  placeholder="e.g., A scientist discovers a bioluminescent forest at night"
                  value={state.topic}
                  onChange={e => onChange({ topic: e.target.value })}
                />
              </div>

              <div className="row">
                <label className="label">Mood</label>
                <input className="input" value={state.mood} onChange={e => onChange({ mood: e.target.value })} />
              </div>

              <div className="row">
                <label className="label">Tone</label>
                <input className="input" value={state.tone} onChange={e => onChange({ tone: e.target.value })} />
              </div>
            </div>

            <div>
              <div className="row">
                <label className="label">Visual Style</label>
                <select className="select" value={state.visualStyle} onChange={e => onChange({ visualStyle: e.target.value as VisualStyle })}>
                  <option value="cinematic">Cinematic</option>
                  <option value="realistic">Realistic</option>
                  <option value="emotional">Emotional</option>
                  <option value="animated">Animated</option>
                  <option value="documentary">Documentary</option>
                  <option value="surreal">Surreal</option>
                </select>
              </div>

              <div className="row">
                <label className="label">Atmosphere</label>
                <input className="input" value={state.atmosphere} onChange={e => onChange({ atmosphere: e.target.value })} />
              </div>

              <div className="row">
                <label className="label">Scenes</label>
                <div className="inline">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={state.sceneCount}
                    onChange={e => onChange({ sceneCount: Number(e.target.value) })}
                  />
                  <span className="small">{state.sceneCount} scenes</span>
                </div>
              </div>

              <div className="row">
                <label className="label">Extras</label>
                <div className="inline">
                  <label className="inline small">
                    <input type="checkbox" checked={state.includeVoiceover} onChange={e => onChange({ includeVoiceover: e.target.checked })} /> Voiceover lines
                  </label>
                  <label className="inline small">
                    <input type="checkbox" checked={state.includeThumbnail} onChange={e => onChange({ includeThumbnail: e.target.checked })} /> Thumbnail prompt
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="inline">
            <button className="button" type="submit" disabled={!canGenerate}>{loading ? 'Generating?' : 'Generate'}</button>
            {result && (
              <>
                <button className="button ghost" type="button" onClick={copyJSON}>Copy JSON</button>
                <button className="button ghost" type="button" onClick={() => copy(result.finalPrompt)}>Copy Final Prompt</button>
              </>
            )}
          </div>
        </div>
      </form>

      {result && (
        <div className="section">
          <div className="grid">
            <div className="card"><div className="card-body">
              <h3>1. Video Summary</h3>
              <div className="content">
                <div className="kv">
                  <div><strong>Short title</strong></div>
                  <div>{result.summary.title}</div>
                  <div><strong>One?sentence idea</strong></div>
                  <div>{result.summary.idea}</div>
                  <div><strong>Mood + tone</strong></div>
                  <div>{result.summary.mood} + {result.summary.tone}</div>
                  <div><strong>Visual style</strong></div>
                  <div>{result.summary.visualStyle}</div>
                </div>
              </div>
            </div></div>

            <div className="card"><div className="card-body">
              <h3>2. Scene Breakdown</h3>
              <div className="grid">
                {result.scenes.map(s => (
                  <div key={s.index} className="scene">
                    <h4>Scene {s.index}</h4>
                    <div className="kv">
                      <div><strong>Location + setting</strong></div><div>{s.setting}</div>
                      <div><strong>Characters</strong></div><div>{s.characters}</div>
                      <div><strong>Camera</strong></div><div>{s.camera}</div>
                      <div><strong>Lighting</strong></div><div>{s.lighting}</div>
                      <div><strong>Key actions</strong></div><div>{s.keyActions}</div>
                      <div><strong>Atmosphere</strong></div><div>{s.atmosphere}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div></div>

            <div className="card"><div className="card-body">
              <h3>3. Final Video Prompt</h3>
              <div className="content" style={{ whiteSpace: 'pre-wrap' }}>{result.finalPrompt}</div>
              <div className="copybar" style={{ marginTop: 10 }}>
                <button className="button ghost" type="button" onClick={() => copy(result.finalPrompt)}>Copy</button>
              </div>
            </div></div>

            {(state.includeVoiceover || state.includeThumbnail) && (
              <div className="card"><div className="card-body">
                <h3>4. Extras</h3>
                <div className="grid">
                  {state.includeVoiceover && result.extras?.voiceoverLines && (
                    <div className="content">
                      <strong>Voiceover lines</strong>
                      <ol>
                        {result.extras.voiceoverLines.map((l, i) => <li key={i}>{l}</li>)}
                      </ol>
                    </div>
                  )}
                  {state.includeThumbnail && result.extras?.thumbnailPrompt && (
                    <div className="content">
                      <strong>Thumbnail / poster prompt</strong>
                      <div style={{ marginTop: 6 }}>{result.extras.thumbnailPrompt}</div>
                    </div>
                  )}
                </div>
              </div></div>
            )}
          </div>

          <div className="footer">Built for high?clarity, production?ready AI video prompting.</div>
        </div>
      )}
    </div>
  );
}
