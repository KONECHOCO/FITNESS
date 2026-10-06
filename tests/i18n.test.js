import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DICTS } from '../src/i18n/index.js';

const placeholders = s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');

test('tutte le lingue hanno le stesse chiavi e gli stessi segnaposto dell\'italiano', () => {
  const base = DICTS.it;
  for (const [lang, dict] of Object.entries(DICTS)) {
    for (const key of Object.keys(base)) {
      assert.ok(typeof dict[key] === 'string' && dict[key].length, `${lang}: manca ${key}`);
      assert.equal(placeholders(dict[key]), placeholders(base[key]), `${lang}.${key}: segnaposto diversi`);
    }
    for (const key of Object.keys(dict)) assert.ok(key in base, `${lang}: chiave in più ${key}`);
  }
});

test('giorni della settimana: 7 iniziali per lingua', () => {
  for (const [lang, dict] of Object.entries(DICTS)) assert.equal(dict.st_weekdays.split(',').length, 7, lang);
});
