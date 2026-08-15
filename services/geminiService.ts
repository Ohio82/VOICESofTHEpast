/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HistoricalScenario } from "../types";

export type SynthesisLine = {
  speaker: string;
  text: string;
  translation?: string;
  voicePersona?: string; // e.g., 'Puck', 'Kore'
  gender?: 'male' | 'female';
  lang?: string; // BCP-47 language tag if known
};

export type SynthesisPackage = {
  lines: SynthesisLine[];
  accentProfile?: string;
  characters?: any[];
};

export async function researchLocationAndDate(location: string, date: string): Promise<HistoricalScenario> {
  const resp = await fetch('/api/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, date })
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Research failed: ${txt}`);
  }
  return await resp.json();
}

// New: client-side TTS generator that returns a SynthesisPackage to be spoken with the Web Speech API.
export async function generateDialogueAudio(scenario: HistoricalScenario): Promise<AudioBuffer | SynthesisPackage> {
  // Build a list of SynthesisLines mapping speakers to safe names and including translation.
  const lines: SynthesisLine[] = [];

  const charMap: Record<string, any> = {};
  (scenario.characters || []).forEach((c) => {
    charMap[c.name] = c;
  });

  (scenario.script || []).forEach((line: any) => {
    const char = charMap[line.speaker] || null;
    lines.push({
      speaker: line.speaker,
      text: line.text || '',
      translation: line.translation || undefined,
      voicePersona: char?.voice,
      gender: char?.gender,
      // accentProfile may be a human readable string; not always a BCP-47 tag
      lang: scenario.accentProfile || undefined
    });
  });

  // Return a synthesis package instead of an AudioBuffer. The UI will use speechSynthesis to play it.
  const pkg: SynthesisPackage = {
    lines,
    accentProfile: scenario.accentProfile,
    characters: scenario.characters
  };

  return pkg;
}

export async function generateCharacterAvatar(description: string, context: string, style: string = 'Photo-real'): Promise<string | null> {
  try {
    const resp = await fetch('/api/generate-avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, context, style })
    });
    if (!resp.ok) {
      const txt = await resp.text();
      console.warn('Avatar generation failed:', txt);
      return null;
    }
    const json = await resp.json();
    return json.dataUrl || null;
  } catch (e) {
    console.warn('Avatar generation error', e);
    return null;
  }
}
