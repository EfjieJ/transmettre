/* Voix optionnelle : voix naturelles préenregistrées (audio/*.mp3), sinon synthèse du navigateur. */
(() => {
  const SS = window.speechSynthesis; let frVoice = null, ka = null, cur = null, voiceOn = false;
  const WHO = { avant: { p: .85, r: .95 }, apres: { p: 1.3, r: 1.05 }, jeu: { p: 1.1, r: 1.1 }, gaston: { p: .7, r: .92 }, narr: { p: 1, r: 1 } };
  const fnv = t => { let h = 0x811c9dc5; for (const ch of t) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
  const clean = t => String(t).replace(/<[^>]+>/g, '').trim();
  const lineId = (t, who) => (WHO[who] ? who : 'narr') + '-' + fnv(clean(t));
  const pick = () => { if (!SS) return; const fr = (SS.getVoices() || []).filter(x => /^fr/i.test(x.lang)); const rank = x => (/fr[-_]CA/i.test(x.lang) ? 0 : /fr[-_]FR/i.test(x.lang) ? 1 : 2) - (x.localService ? .2 : 0); frVoice = fr.sort((a, b) => rank(a) - rank(b))[0] || null; };
  if (SS) { pick(); SS.addEventListener && SS.addEventListener('voiceschanged', pick); }
  const synth = (t, who) => { if (!SS) return; if (!frVoice) pick(); SS.cancel(); const w = WHO[who] || WHO.narr; const u = new SpeechSynthesisUtterance(clean(t)); u.lang = frVoice ? frVoice.lang : 'fr-CA'; if (frVoice) u.voice = frVoice; u.pitch = w.p; u.rate = w.r;
    clearInterval(ka); ka = setInterval(() => { if (!SS.speaking) return clearInterval(ka); SS.pause(); SS.resume(); }, 10000); u.onend = () => clearInterval(ka); SS.speak(u); };
  const stop = () => { if (cur) { cur.pause(); cur = null; } if (SS) SS.cancel(); };
  const speak = (t, who = 'narr') => {
    const id = lineId(t, who); (window.__speakCalls = window.__speakCalls || []).push(id);
    if (!voiceOn) return; stop();
    if (window.AUDIO_IDS && AUDIO_IDS.has(id)) { const a = new Audio('audio/' + id + '.mp3'); cur = a; (window.__audioPlays = window.__audioPlays || []).push(id);
      a.onerror = () => { if (cur === a) synth(t, who); }; const p = a.play(); if (p && p.catch) p.catch(e => { if (e && e.name !== 'NotAllowedError' && cur === a) synth(t, who); });
    } else synth(t, who);
  };
  const vb = document.getElementById('voice');
  const set = on => { voiceOn = on; vb.setAttribute('aria-pressed', on); vb.textContent = on ? '🔊 Voix : oui' : '🔇 Voix : non'; try { localStorage.setItem('tr-voice', on ? 'on' : 'off'); } catch (e) {} if (!on) stop(); };
  let pref = null; try { pref = localStorage.getItem('tr-voice'); } catch (e) {}
  set(false);
  vb.addEventListener('click', () => { try { const a = new Audio('audio/silence.mp3'); a.volume = 0; a.play().catch(() => {}); } catch (x) {} set(!voiceOn); if (voiceOn) speak('Allô! Je vais lire les bulles à voix haute.', 'gaston'); });
  /* si la personne avait choisi « oui » à sa dernière visite, on rallume au premier geste */
  if (pref === 'on') addEventListener('pointerdown', function u(e) { if (e.target.closest('#voice')) return; removeEventListener('pointerdown', u, true); try { new Audio('audio/silence.mp3').play().catch(() => {}); } catch (x) {} set(true); }, true);
  window.Talk = { speak, lineId, get voiceOn() { return voiceOn; } };
})();
