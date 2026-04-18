// scenes.jsx — Cosmic scale animation scenes
// eduLAB charte: Poppins titles / Montserrat body
// Colors: cyan #7EC0C8, gold #EFB243, pink #EA4E86, ink #3D3938, paper #F5F5F5

const INK   = '#3D3938';
const PAPER = '#F5F5F5';
const DIM   = '#8a8481';
const RULE  = '#d9d5d1';
const CYAN  = '#7EC0C8';
const GOLD  = '#EFB243';
const PINK  = '#EA4E86';

const HELV = '"Poppins", "Helvetica Neue", Helvetica, Arial, sans-serif';       // titles
const BODY = '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif';    // paragraphs
const MONO = '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif';

// Ticker label in the corner showing current fact count / total
function HUD({ index, total, label }) {
  return (
    <div style={{
      position: 'absolute', left: 40, top: 32,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: HELV, color: INK, zIndex: 50,
    }}>
      <div style={{
        fontSize: 11, letterSpacing: '0.22em',
        textTransform: 'uppercase', fontWeight: 700,
      }}>
        eduLAB · Échelles cosmiques
      </div>
      <div style={{ width: 1, height: 14, background: INK, opacity: 0.4 }}/>
      <div style={{
        fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: DIM, fontWeight: 500,
      }}>
        {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')} · {label}
      </div>
    </div>
  );
}

// Bottom ruler showing "you are here" on a log scale of the universe
function ScaleRuler({ logMeters, label }) {
  // Range: 10^6 (1000 km) to 10^27 (observable universe)
  const min = 6, max = 27;
  const t = clamp((logMeters - min) / (max - min), 0, 1);
  return (
    <div style={{
      position: 'absolute', left: 40, right: 40, bottom: 36,
      fontFamily: HELV, color: INK, zIndex: 50,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: DIM, marginBottom: 8, fontWeight: 500,
      }}>
        <span>10⁶ m</span>
        <span>{label}</span>
        <span>10²⁷ m</span>
      </div>
      <div style={{ position: 'relative', height: 2, background: RULE }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: 2,
          width: `${t * 100}%`, background: INK,
        }}/>
        {/* tick marks at each power of 10 */}
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${(i / (max - min)) * 100}%`,
            top: -3, width: 1, height: 8,
            background: i / (max - min) < t ? INK : RULE,
            transform: 'translateX(-0.5px)',
          }}/>
        ))}
        {/* playhead marker */}
        <div style={{
          position: 'absolute', left: `${t * 100}%`, top: -6,
          width: 14, height: 14, marginLeft: -7,
          borderRadius: 7, background: PAPER,
          border: `2px solid ${INK}`,
        }}/>
      </div>
    </div>
  );
}

// A celestial body rendered as a circle with a label.
// dx/dy offsets, diameter in px, stroke/fill treatments.
function Body({ cx, cy, d, fill = INK, stroke = null, label, labelOffset = [0, 0], labelAlign = 'center', subLabel }) {
  return (
    <>
      <div style={{
        position: 'absolute', left: cx - d/2, top: cy - d/2,
        width: d, height: d, borderRadius: '50%',
        background: fill,
        border: stroke ? `1.5px solid ${stroke}` : 'none',
        boxSizing: 'border-box',
      }}/>
      {label && (
        <div style={{
          position: 'absolute',
          left: cx + labelOffset[0],
          top: cy + labelOffset[1],
          transform: labelAlign === 'center' ? 'translate(-50%, 0)' :
                     labelAlign === 'right'  ? 'translate(-100%, 0)' : 'translate(0, 0)',
          fontFamily: HELV, fontSize: 13, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 700, color: INK,
        }}>
          {label}
          {subLabel && (
            <div style={{
              fontSize: 10, letterSpacing: '0.14em',
              color: DIM, fontWeight: 500, marginTop: 3,
            }}>
              {subLabel}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// A full-width "fact" headline block
function FactBlock({ top, eyebrow, figure, figureUnit, body, figureColor }) {
  return (
    <div style={{
      position: 'absolute', left: 40, top, right: 40,
      fontFamily: HELV, color: INK,
    }}>
      {eyebrow && (
        <div style={{
          fontSize: 11, letterSpacing: '0.24em',
          textTransform: 'uppercase', fontWeight: 700,
          color: DIM, marginBottom: 14,
        }}>
          {eyebrow}
        </div>
      )}
      {figure && (
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 16,
          marginBottom: 12,
        }}>
          <div style={{
            fontSize: 120, fontWeight: 700, lineHeight: 0.9,
            letterSpacing: '-0.04em',
            color: figureColor || INK,
          }}>
            {figure}
          </div>
          {figureUnit && (
            <div style={{
              fontSize: 22, fontWeight: 500, color: DIM,
              letterSpacing: '0.02em',
            }}>
              {figureUnit}
            </div>
          )}
        </div>
      )}
      {body && (
        <div style={{
          fontSize: 22, fontWeight: 400, lineHeight: 1.35,
          maxWidth: 760, color: INK, fontFamily: BODY,
        }}>
          {body}
        </div>
      )}
    </div>
  );
}

// ─── Scene 00: Title ────────────────────────────────────────────────────────
function SceneTitle({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime, progress }) => {
        // Pulsing single point that represents "everything starts here"
        const pulseT = Math.min(localTime, 2.5);
        const r = interpolate([0, 1, 2.5], [0, 60, 120], Easing.easeOutCubic)(pulseT);
        const opacity = interpolate([0, 0.4, dur - 0.6, dur], [0, 1, 1, 0])(localTime);

        return (
          <>
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: r, height: r, borderRadius: '50%',
              border: `1px solid ${INK}`, opacity: opacity * 0.5,
            }}/>
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 8, height: 8, borderRadius: '50%',
              background: INK, opacity,
            }}/>
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: `translate(-50%, calc(-50% + 120px))`,
              opacity: interpolate([0, 0.6, dur - 0.6, dur], [0, 1, 1, 0])(localTime),
              textAlign: 'center', fontFamily: HELV, color: INK,
            }}>
              <div style={{
                fontSize: 13, letterSpacing: '0.32em',
                textTransform: 'uppercase', fontWeight: 700,
                marginBottom: 18,
              }}>
                Un voyage en huit étapes
              </div>
              <div style={{
                fontSize: 96, fontWeight: 700,
                letterSpacing: '-0.04em', lineHeight: 0.95,
              }}>
                Échelles cosmiques
              </div>
              <div style={{
                fontSize: 14, letterSpacing: '0.22em',
                textTransform: 'uppercase', fontWeight: 500,
                marginTop: 22, color: DIM,
              }}>
                Du mètre à l'univers observable
              </div>
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

// ─── Scene 01: Earth alone ──────────────────────────────────────────────────
function SceneEarth({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.6, dur - 0.5, dur], [0, 1, 1, 0])(localTime);
        // subtle drift zoom
        const scale = 1 + 0.06 * (localTime / dur);
        // rotate a tiny marker around Earth to suggest motion
        const angle = (localTime / dur) * Math.PI * 2;
        const mx = 960 + Math.cos(angle) * 260;
        const my = 540 + Math.sin(angle) * 260;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut, transform: `scale(${scale})`, transformOrigin: 'center' }}>
            <HUD index={1} total={8} label="La Terre" />
            <Body cx={960} cy={540} d={420} fill={CYAN} label="TERRE" labelOffset={[0, 230]} />
            {/* orbiting dot with trail */}
            <div style={{
              position: 'absolute', left: mx - 4, top: my - 4,
              width: 8, height: 8, borderRadius: '50%', background: INK,
            }}/>
            <div style={{
              position: 'absolute', left: 960 - 265, top: 540 - 265,
              width: 530, height: 530, borderRadius: '50%',
              border: `1px dashed ${RULE}`,
            }}/>
            <FactBlock
              top={140}
              figureColor="#7EC0C8"
              eyebrow="Fait 01 · Chez nous"
              figure="12,742"
              figureUnit="km de diamètre"
              body="Une sphère de roche et d'eau. Si petite que la lumière en fait le tour en 0,13 seconde — ce qui semblera lent par rapport à ce qui suit."
            />
            <ScaleRuler logMeters={7} label="Diamètre Terre · 10⁷ m" />
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── Scene 02: Earth + Moon, distance ───────────────────────────────────────
function SceneMoon({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.6, dur - 0.5, dur], [0, 1, 1, 0])(localTime);
        // Earth on left; Moon flies in from far right
        const moonX = interpolate([0, 1.2, 3, dur], [2200, 1500, 1500, 1480], Easing.easeOutCubic)(localTime);

        // Earth radius 6371 km rendered as 80px → scale 80/6371
        // Earth-Moon distance ~ 384,400 km; at this scale ~ 4830 px. We'll compress visually for readability.
        // But we show "à l'échelle" annotation.
        const earthX = 300;
        const earthY = 540;
        const moonY = 540;
        const earthR = 80;
        const moonR = 22;

        // dotted distance line drawn progressively
        const lineProgress = interpolate([1.2, 3], [0, 1], Easing.easeOutCubic)(localTime);
        const lineEnd = earthX + (moonX - earthX) * lineProgress;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut }}>
            <HUD index={2} total={8} label="La Lune" />
            <Body cx={earthX} cy={earthY} d={earthR * 2} fill={CYAN} label="TERRE" labelOffset={[0, earthR + 16]} />
            <Body cx={moonX} cy={moonY} d={moonR * 2} stroke={INK} fill={PAPER} label="LUNE" labelOffset={[0, moonR + 16]} />

            {/* distance bracket */}
            <div style={{
              position: 'absolute', left: earthX + earthR + 8, top: earthY - 1,
              height: 2, width: lineEnd - (earthX + earthR + 8),
              background: 'transparent',
              borderTop: `1.5px dashed ${INK}`,
            }}/>
            {/* ticks */}
            {lineProgress > 0.1 && (
              <>
                <div style={{ position: 'absolute', left: earthX + earthR + 8, top: earthY - 8, width: 1, height: 12, background: INK }}/>
                <div style={{ position: 'absolute', left: lineEnd - 1, top: earthY - 8, width: 1, height: 12, background: INK }}/>
              </>
            )}
            {localTime > 2.4 && (
              <div style={{
                position: 'absolute',
                left: (earthX + moonX) / 2, top: earthY - 48,
                transform: 'translate(-50%, 0)',
                fontFamily: HELV, fontSize: 13, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 700, color: INK,
                opacity: interpolate([2.4, 3], [0, 1])(localTime),
              }}>
                384,400 km
              </div>
            )}

            <FactBlock
              top={120}
              figureColor="#EFB243"
              eyebrow="Fait 02 · Distance lunaire"
              figure="30"
              figureUnit="Terres bout à bout"
              body="On pourrait aligner toutes les autres planètes du système solaire — Mercure, Vénus, Mars, Jupiter, Saturne, Uranus, Neptune — entre la Terre et la Lune. Et il resterait de la place."
            />
            <ScaleRuler logMeters={8.58} label="Terre–Lune · 3,84×10⁸ m" />
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── Scene 03: Sun vs Earth ─────────────────────────────────────────────────
function SceneSun({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.6, dur - 0.5, dur], [0, 1, 1, 0])(localTime);
        // Sun grows from a small circle to huge. Earth stays tiny.
        // Sun:Earth diameter = 109:1
        const sunR = interpolate([0, 3], [60, 440], Easing.easeInOutCubic)(localTime);
        const earthR = 4; // 440/109 ≈ 4

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut }}>
            <HUD index={3} total={8} label="Le Soleil" />
            {/* corona rings */}
            <div style={{
              position: 'absolute', left: 640 - sunR - 20, top: 540 - sunR - 20,
              width: (sunR + 20) * 2, height: (sunR + 20) * 2,
              borderRadius: '50%', border: `1px solid ${RULE}`,
            }}/>
            <div style={{
              position: 'absolute', left: 640 - sunR - 44, top: 540 - sunR - 44,
              width: (sunR + 44) * 2, height: (sunR + 44) * 2,
              borderRadius: '50%', border: `1px solid ${RULE}`, opacity: 0.5,
            }}/>
            <Body cx={640} cy={540} d={sunR * 2} fill={GOLD} />

            {/* Earth for comparison — labeled with arrow */}
            <Body cx={1320} cy={540} d={earthR * 2} fill={INK} />
            <div style={{
              position: 'absolute', left: 1340, top: 540 - 8,
              fontFamily: HELV, fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: 700, color: INK,
            }}>
              ← Terre
              <div style={{ fontSize: 10, letterSpacing: '0.14em', color: DIM, marginTop: 3, fontWeight: 500 }}>
                to scale
              </div>
            </div>

            {/* Sun label */}
            {localTime > 2.5 && (
              <div style={{
                position: 'absolute', left: 640, top: 540 + sunR + 20,
                transform: 'translate(-50%, 0)',
                fontFamily: HELV, fontSize: 13, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 700, color: INK,
                opacity: interpolate([2.5, 3.2], [0, 1])(localTime),
              }}>
                Le Soleil
              </div>
            )}

            <FactBlock
              top={80}
              figureColor="#EFB243"
              eyebrow="Fait 03 · Masse stellaire"
              figure="1.3M"
              figureUnit="Terres tiennent dedans"
              body="Le Soleil concentre 99,86 % de la masse du système solaire. Tout le reste — planètes, lunes, astéroïdes, vous — n'est qu'une erreur d'arrondi."
            />
            <ScaleRuler logMeters={9.14} label="Diamètre Soleil · 1,39×10⁹ m" />
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── Scene 04: Jupiter vs Earth ─────────────────────────────────────────────
function SceneJupiter({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.6, dur - 0.5, dur], [0, 1, 1, 0])(localTime);
        // Jupiter is 11 Earth diameters across. Show Jupiter as a field
        // of Earth-sized dots being packed in, then the outline of Jupiter.
        const packProgress = interpolate([0.5, 3.5], [0, 1], Easing.easeOutCubic)(localTime);

        const cx = 1200, cy = 540;
        const jupiterR = 260;
        const earthR = jupiterR / 11;

        // Generate a grid of Earth-sized circles inside Jupiter's disk
        const dots = [];
        const step = earthR * 2 + 2;
        let count = 0;
        for (let y = cy - jupiterR + earthR; y <= cy + jupiterR - earthR; y += step) {
          for (let x = cx - jupiterR + earthR; x <= cx + jupiterR - earthR; x += step) {
            const dx = x - cx, dy = y - cy;
            if (dx*dx + dy*dy <= (jupiterR - earthR) ** 2) {
              dots.push({ x, y, i: count });
              count++;
            }
          }
        }
        const total = dots.length;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut }}>
            <HUD index={4} total={8} label="Jupiter" />
            {/* Jupiter outline */}
            <div style={{
              position: 'absolute', left: cx - jupiterR, top: cy - jupiterR,
              width: jupiterR * 2, height: jupiterR * 2, borderRadius: '50%',
              border: `1.5px solid ${INK}`, boxSizing: 'border-box',
            }}/>
            {/* Jupiter bands */}
            {[0.25, 0.5, 0.75].map(f => (
              <div key={f} style={{
                position: 'absolute',
                left: cx - jupiterR, top: cy - jupiterR + jupiterR * 2 * f,
                width: jupiterR * 2, height: 1,
                background: RULE, opacity: 0.6,
              }}/>
            ))}

            {/* Earth-sized dots appearing */}
            {dots.map((d, i) => {
              const visibleN = Math.floor(total * packProgress);
              const visible = i < visibleN;
              return (
                <div key={i} style={{
                  position: 'absolute',
                  left: d.x - earthR, top: d.y - earthR,
                  width: earthR * 2, height: earthR * 2,
                  borderRadius: '50%',
                  background: INK,
                  opacity: visible ? 1 : 0,
                  transition: 'opacity 120ms linear',
                }}/>
              );
            })}

            {/* One single "Earth" reference on the left */}
            <Body cx={420} cy={540} d={earthR * 4} fill={INK} label="UNE TERRE" labelOffset={[0, earthR * 2 + 20]} />
            <div style={{
              position: 'absolute', left: 420, top: 540 - earthR * 2 - 20,
              transform: 'translate(-50%, -100%)',
              fontFamily: HELV, fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: 700, color: DIM,
            }}>
              agrandie 2× pour lisibilité
            </div>

            {/* Count label */}
            <div style={{
              position: 'absolute', left: cx, top: cy + jupiterR + 24,
              transform: 'translate(-50%, 0)',
              fontFamily: HELV, fontSize: 13, letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: 700, color: INK,
            }}>
              Jupiter · {Math.floor(total * packProgress)} / {total}+ Terres
            </div>

            <FactBlock
              top={100}
              figureColor="#EA4E86"
              eyebrow="Fait 04 · Géante gazeuse"
              figure="1,321"
              figureUnit="Terres en volume"
              body="Jupiter est plus du double de la masse de toutes les autres planètes réunies. Sa Grande Tache rouge — une seule tempête — fait rage depuis au moins 350 ans et pourrait engloutir la Terre entière."
            />
            <ScaleRuler logMeters={8.16} label="Diamètre Jupiter · 1,4×10⁸ m" />
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── Scene 05: Solar system — light from the Sun ────────────────────────────
function SceneLightSpeed({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.6, dur - 0.5, dur], [0, 1, 1, 0])(localTime);

        // Sun left, Earth right. A photon travels from sun to earth over 8s.
        const sunX = 220, earthX = 1700, y = 640;
        const travelDur = Math.min(5, dur - 1.5);
        const tStart = 1.2;
        const photonT = clamp((localTime - tStart) / travelDur, 0, 1);
        const photonX = sunX + (earthX - sunX) * photonT;

        // minutes counter
        const minutes = (photonT * 8.33).toFixed(2);

        // Draw inner planets as small dots between Sun and Earth
        const planets = [
          { name: 'MERCURE', x: 0.15, d: 6 },
          { name: 'VÉNUS',   x: 0.28, d: 9 },
          { name: 'TERRE',   x: 1.0,  d: 14 },
        ];

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut }}>
            <HUD index={5} total={8} label="Vitesse de la lumière" />

            {/* Sun */}
            <div style={{
              position: 'absolute', left: sunX - 90, top: y - 90,
              width: 180, height: 180, borderRadius: '50%',
              border: `1px solid ${RULE}`, opacity: 0.5,
            }}/>
            <Body cx={sunX} cy={y} d={120} fill={GOLD} label="SOLEIL" labelOffset={[0, 80]} />

            {/* Planets */}
            {planets.map((p, i) => {
              const px = sunX + (earthX - sunX) * p.x;
              return (
                <React.Fragment key={i}>
                  <Body cx={px} cy={y} d={p.d} fill={INK} />
                  <div style={{
                    position: 'absolute', left: px, top: y + 28,
                    transform: 'translate(-50%, 0)',
                    fontFamily: HELV, fontSize: 10, letterSpacing: '0.18em',
                    textTransform: 'uppercase', fontWeight: 700, color: DIM,
                  }}>
                    {p.name}
                  </div>
                </React.Fragment>
              );
            })}

            {/* track line */}
            <div style={{
              position: 'absolute', left: sunX, top: y - 0.5,
              width: earthX - sunX, height: 1, background: RULE,
            }}/>

            {/* photon */}
            {localTime > tStart && photonT < 1 && (
              <>
                <div style={{
                  position: 'absolute', left: photonX - 6, top: y - 6,
                  width: 12, height: 12, borderRadius: '50%',
                  background: INK,
                }}/>
                {/* trail */}
                <div style={{
                  position: 'absolute', left: sunX, top: y - 1,
                  width: photonX - sunX, height: 2, background: INK,
                }}/>
                {/* minutes readout */}
                <div style={{
                  position: 'absolute', left: photonX, top: y - 40,
                  transform: 'translate(-50%, 0)',
                  fontFamily: HELV, fontSize: 13, letterSpacing: '0.18em',
                  textTransform: 'uppercase', fontWeight: 700, color: INK,
                  background: PAPER, padding: '3px 8px',
                  border: `1px solid ${INK}`,
                }}>
                  {minutes} min
                </div>
              </>
            )}
            {photonT >= 1 && (
              <div style={{
                position: 'absolute', left: earthX, top: y - 44,
                transform: 'translate(-50%, 0)',
                fontFamily: HELV, fontSize: 13, letterSpacing: '0.18em',
                textTransform: 'uppercase', fontWeight: 700, color: INK,
                background: INK, color2: PAPER,
                padding: '4px 10px',
              }}>
                <span style={{ color: PAPER }}>ARRIVÉE · 8:20</span>
              </div>
            )}

            <FactBlock
              top={100}
              figureColor="#EFB243"
              eyebrow="Fait 05 · Retard de la lumière"
              figure="8:20"
              figureUnit="minutes de trajet"
              body="La lumière du Soleil qui vous touche en ce moment est partie il y a huit minutes. Si le Soleil disparaissait, vous continueriez à sentir sa chaleur pendant huit minutes avant de remarquer quoi que ce soit."
            />
            <ScaleRuler logMeters={11.17} label="1 UA · 1,5×10¹¹ m" />
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── Scene 06: Proxima Centauri distance ────────────────────────────────────
function SceneProxima({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.6, dur - 0.5, dur], [0, 1, 1, 0])(localTime);

        // Our solar system as a single dot on the left. Proxima on the right.
        const years = (localTime > 1 ? Math.min(4.24, ((localTime - 1) / 3) * 4.24) : 0);
        const t = years / 4.24;

        const sunX = 200, proxX = 1720, y = 540;
        const photonX = sunX + (proxX - sunX) * t;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut }}>
            <HUD index={6} total={8} label="Étoile voisine" />

            {/* Starfield */}
            {Array.from({ length: 40 }, (_, i) => {
              const rx = (i * 97 + 13) % 1920;
              const ry = (i * 53 + 71) % 200 + 780;
              const s = (i % 3) + 1;
              return (
                <div key={i} style={{
                  position: 'absolute', left: rx, top: ry,
                  width: s, height: s, background: INK, opacity: 0.3,
                  borderRadius: '50%',
                }}/>
              );
            })}

            <Body cx={sunX} cy={y} d={28} fill={GOLD} label="SOLEIL" labelOffset={[0, 24]} subLabel="notre étoile" />
            <Body cx={proxX} cy={y} d={20} stroke={PINK} fill={PAPER}
                  label="PROXIMA CENTAURI" labelOffset={[0, 20]} subLabel="étoile la plus proche" />

            {/* dashed line */}
            <div style={{
              position: 'absolute', left: sunX, top: y - 1,
              width: proxX - sunX, height: 2,
              borderTop: `1.5px dashed ${RULE}`,
            }}/>
            <div style={{
              position: 'absolute', left: sunX, top: y - 1,
              width: photonX - sunX, height: 2,
              borderTop: `1.5px solid ${INK}`,
            }}/>

            {/* photon */}
            {localTime > 1 && t < 1 && (
              <>
                <div style={{
                  position: 'absolute', left: photonX - 5, top: y - 5,
                  width: 10, height: 10, borderRadius: '50%', background: INK,
                }}/>
                <div style={{
                  position: 'absolute', left: photonX, top: y - 44,
                  transform: 'translate(-50%, 0)',
                  fontFamily: HELV, fontSize: 13, letterSpacing: '0.2em',
                  textTransform: 'uppercase', fontWeight: 700, color: INK,
                  background: PAPER, padding: '3px 8px',
                  border: `1px solid ${INK}`,
                }}>
                  {years.toFixed(2).replace('.', ',')} AL
                </div>
              </>
            )}
            {t >= 1 && (
              <div style={{
                position: 'absolute', left: proxX, top: y - 50,
                transform: 'translate(-50%, 0)',
                fontFamily: HELV, fontSize: 13, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 700, color: PAPER,
                background: INK, padding: '4px 10px',
              }}>
                4,24 AL · ARRIVÉE
              </div>
            )}

            <FactBlock
              top={100}
              figureColor="#7EC0C8"
              eyebrow="Fait 06 · L'étoile la plus proche"
              figure="4.24"
              figureUnit="années-lumière"
              body="Voyager 1, l'objet humain le plus rapide jamais lancé, file à 17 km/s. À cette vitesse, il faudrait 73 000 ans pour atteindre Proxima Centauri — et la sonde ne va même pas dans cette direction."
            />
            <ScaleRuler logMeters={16.6} label="Proxima · 4×10¹⁶ m" />
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── Scene 07: Milky Way galaxy ─────────────────────────────────────────────
function SceneGalaxy({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.7, dur - 0.5, dur], [0, 1, 1, 0])(localTime);

        // Build a spiral galaxy of dots
        const cx = 960, cy = 560;
        const spiralProgress = interpolate([0, 3.5], [0, 1], Easing.easeOutCubic)(localTime);
        const rotate = (localTime / dur) * 0.4; // gentle rotation

        const dots = [];
        const N = 900;
        for (let i = 0; i < N; i++) {
          const frac = i / N;
          // 2 arms
          const arm = i % 2;
          const angle = frac * Math.PI * 6 + arm * Math.PI + rotate;
          const radius = 40 + frac * 360;
          // jitter
          const j = ((i * 17) % 40) - 20;
          const jr = ((i * 31) % 30) - 15;
          const r = radius + jr;
          dots.push({
            x: cx + Math.cos(angle) * r + j * 0.5,
            y: cy + Math.sin(angle) * r * 0.35 + j * 0.3, // flattened
            size: frac < 0.15 ? 2 : 1,
            frac,
          });
        }
        const visibleN = Math.floor(N * spiralProgress);

        // bulge
        const bulgeR = 70;

        // "You are here" marker — in outer spiral
        const youAngle = Math.PI * 0.3 + rotate;
        const youR = 240;
        const youX = cx + Math.cos(youAngle) * youR;
        const youY = cy + Math.sin(youAngle) * youR * 0.35;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut }}>
            <HUD index={7} total={8} label="Voie lactée" />

            {/* galactic bulge glow */}
            <div style={{
              position: 'absolute', left: cx - bulgeR * 2, top: cy - bulgeR,
              width: bulgeR * 4, height: bulgeR * 2, borderRadius: '50%',
              background: GOLD, opacity: 0.25, filter: 'blur(20px)',
            }}/>
            <div style={{
              position: 'absolute', left: cx - bulgeR, top: cy - bulgeR * 0.5,
              width: bulgeR * 2, height: bulgeR, borderRadius: '50%',
              background: INK,
            }}/>

            {/* stars */}
            {dots.slice(0, visibleN).map((d, i) => (
              <div key={i} style={{
                position: 'absolute', left: d.x, top: d.y,
                width: d.size, height: d.size, borderRadius: '50%',
                background: INK, opacity: d.frac < 0.2 ? 1 : 0.7,
              }}/>
            ))}

            {/* "you are here" marker */}
            {localTime > 2.5 && (
              <>
                <div style={{
                  position: 'absolute', left: youX - 5, top: youY - 5,
                  width: 10, height: 10, borderRadius: '50%',
                  border: `2px solid ${INK}`, background: PAPER,
                  opacity: interpolate([2.5, 3], [0, 1])(localTime),
                }}/>
                <div style={{
                  position: 'absolute', left: youX + 12, top: youY - 8,
                  fontFamily: HELV, fontSize: 11, letterSpacing: '0.2em',
                  textTransform: 'uppercase', fontWeight: 700, color: INK,
                  opacity: interpolate([2.5, 3], [0, 1])(localTime),
                }}>
                  Vous êtes ici
                  <div style={{ fontSize: 9, letterSpacing: '0.14em', color: DIM, marginTop: 2, fontWeight: 500 }}>
                    26 000 AL du centre
                  </div>
                </div>
              </>
            )}

            {/* Diameter label */}
            {localTime > 3 && (
              <div style={{
                position: 'absolute', left: cx, top: cy + 200,
                transform: 'translate(-50%, 0)',
                fontFamily: HELV, fontSize: 11, letterSpacing: '0.22em',
                textTransform: 'uppercase', fontWeight: 700, color: INK,
                opacity: interpolate([3, 3.5], [0, 1])(localTime),
              }}>
                ⟵ 100 000 années-lumière ⟶
              </div>
            )}

            <FactBlock
              top={90}
              figureColor="#EA4E86"
              eyebrow="Fait 07 · Notre galaxie"
              figure="100–400"
              figureUnit="milliards d'étoiles"
              body="En comptant une étoile par seconde, il vous faudrait plus de 3 000 ans pour toutes les énumérer. Et la Voie lactée n'est qu'une galaxie parmi deux mille milliards."
            />
            <ScaleRuler logMeters={21} label="Voie lactée · 10²¹ m" />
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── Scene 08: Observable universe ──────────────────────────────────────────
function SceneUniverse({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.7, dur - 0.5, dur], [0, 1, 1, 0])(localTime);

        const cx = 960, cy = 540;
        // Build concentric rings with dots to represent galaxies
        const rings = [];
        for (let r = 60; r < 440; r += 12) {
          const count = Math.floor(r * 0.6);
          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + r * 0.01;
            const jitter = ((i * 37 + r * 13) % 20) - 10;
            const rr = r + jitter * 0.6;
            rings.push({
              x: cx + Math.cos(angle) * rr,
              y: cy + Math.sin(angle) * rr,
              size: ((i + r) % 3) + 1,
              depth: r / 440,
            });
          }
        }

        const zoomOut = interpolate([0, 3.5], [0.3, 1], Easing.easeInOutCubic)(localTime);
        const visibleN = Math.floor(rings.length * interpolate([0, 3], [0, 1], Easing.easeOutCubic)(localTime));

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut }}>
            <HUD index={8} total={8} label="Univers observable" />

            <div style={{
              position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
              transform: `scale(${zoomOut})`, transformOrigin: 'center',
            }}>
              {/* outer boundary */}
              <div style={{
                position: 'absolute', left: cx - 440, top: cy - 440,
                width: 880, height: 880, borderRadius: '50%',
                border: `1.5px solid ${INK}`,
              }}/>
              <div style={{
                position: 'absolute', left: cx - 460, top: cy - 460,
                width: 920, height: 920, borderRadius: '50%',
                border: `1px dashed ${RULE}`,
              }}/>

              {/* galaxy dots */}
              {rings.slice(0, visibleN).map((g, i) => (
                <div key={i} style={{
                  position: 'absolute', left: g.x, top: g.y,
                  width: g.size, height: g.size, borderRadius: '50%',
                  background: INK, opacity: 0.3 + (1 - g.depth) * 0.7,
                }}/>
              ))}

              {/* center dot: observer */}
              {localTime > 2.5 && (
                <>
                  <div style={{
                    position: 'absolute', left: cx - 3, top: cy - 3,
                    width: 6, height: 6, borderRadius: '50%', background: PINK,
                    opacity: interpolate([2.5, 3], [0, 1])(localTime),
                  }}/>
                  <div style={{
                    position: 'absolute', left: cx - 40, top: cy - 40,
                    width: 80, height: 80, borderRadius: '50%',
                    border: `1px solid ${PINK}`,
                    opacity: interpolate([2.5, 3], [0, 0.6])(localTime),
                  }}/>
                  <div style={{
                    position: 'absolute', left: cx + 12, top: cy - 6,
                    fontFamily: HELV, fontSize: 11, letterSpacing: '0.22em',
                    textTransform: 'uppercase', fontWeight: 700, color: INK,
                    opacity: interpolate([2.5, 3], [0, 1])(localTime),
                  }}>
                    Ici
                  </div>
                </>
              )}
            </div>

            {/* Diameter label — outside the zoomed group */}
            {localTime > 3.2 && (
              <div style={{
                position: 'absolute', left: cx, bottom: 130,
                transform: 'translate(-50%, 0)',
                fontFamily: HELV, fontSize: 12, letterSpacing: '0.22em',
                textTransform: 'uppercase', fontWeight: 700, color: INK,
                opacity: interpolate([3.2, 3.7], [0, 1])(localTime),
              }}>
                ⟵ 93 000 000 000 années-lumière ⟶
              </div>
            )}

            <FactBlock
              top={90}
              figureColor="#7EC0C8"
              eyebrow="Fait 08 · Tout ce que l'on voit"
              figure="93"
              figureUnit="milliards d'al de diamètre"
              body="L'univers a 13,8 milliards d'années — mais son expansion fait que l'univers observable est bien plus vaste que ce que la lumière aurait pu parcourir. Au-delà de cet horizon : sans doute davantage, mais invisible à jamais."
            />
            <ScaleRuler logMeters={27} label="Univers observable · 10²⁷ m" />
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── Scene 09: Outro ────────────────────────────────────────────────────────
function SceneOutro({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.6, dur - 0.5, dur], [0, 1, 1, 0])(localTime);

        // A row of scale dots: atom → planet → star → galaxy → universe
        const scales = [
          { label: '10⁷', name: 'Terre',    d: 6 },
          { label: '10⁹', name: 'Soleil',      d: 12 },
          { label: '10¹¹',name: 'UA',       d: 18 },
          { label: '10¹⁶',name: 'Proxima',  d: 26 },
          { label: '10²¹',name: 'Galaxie',   d: 40 },
          { label: '10²⁷',name: 'Univers', d: 80 },
        ];

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              fontFamily: HELV, fontSize: 13, letterSpacing: '0.32em',
              textTransform: 'uppercase', fontWeight: 700, color: DIM,
              marginBottom: 32,
            }}>
              — Vingt ordres de grandeur —
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 40, marginBottom: 36,
            }}>
              {scales.map((s, i) => {
                const appear = interpolate([i * 0.25, i * 0.25 + 0.5], [0, 1], Easing.easeOutCubic)(localTime);
                return (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 10,
                    opacity: appear,
                    transform: `translateY(${(1 - appear) * 10}px)`,
                  }}>
                    <div style={{
                      width: s.d, height: s.d, borderRadius: '50%', background: INK,
                    }}/>
                    <div style={{
                      fontFamily: HELV, fontSize: 10, letterSpacing: '0.18em',
                      textTransform: 'uppercase', fontWeight: 700, color: INK,
                    }}>
                      {s.name}
                    </div>
                    <div style={{
                      fontFamily: HELV, fontSize: 10, letterSpacing: '0.14em',
                      color: DIM, fontWeight: 500,
                    }}>
                      {s.label} m
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              fontFamily: HELV, fontSize: 72, fontWeight: 700,
              letterSpacing: '-0.03em', color: INK,
              opacity: interpolate([2, 2.8], [0, 1])(localTime),
              textAlign: 'center',
            }}>
              Vous êtes ici, quelque part.
            </div>
            <div style={{
              fontFamily: HELV, fontSize: 18, fontWeight: 400,
              color: DIM, marginTop: 16, letterSpacing: '0.02em',
              opacity: interpolate([2.4, 3.2], [0, 1])(localTime),
            }}>
              Un miracle d'échelle.
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── Scene 10: Zoom back — dezoom to human scale ───────────────────────────
function SceneZoomBack({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.5, dur - 0.5, dur], [0, 1, 1, 0])(localTime);

        // Steps we pass through, in reverse order.
        // Each has a log-meters position (log10) and a label.
        const steps = [
          { log: 27,  name: 'Univers observable', sub: '10²⁷ m',      color: INK },
          { log: 21,  name: 'Voie lactée',        sub: '10²¹ m',      color: INK },
          { log: 16.6,name: 'Proxima Centauri',    sub: '4×10¹⁶ m',    color: INK },
          { log: 11.17,name:'Système solaire',     sub: '1,5×10¹¹ m',  color: INK },
          { log: 9.14,name: 'Le Soleil',           sub: '1,39×10⁹ m',  color: INK },
          { log: 7,   name: 'La Terre',            sub: '1,27×10⁷ m',  color: INK },
          { log: 5.5, name: 'La Belgique',         sub: '~3×10⁵ m',    color: INK },
          { log: 4.3, name: 'Charleroi',           sub: '~2×10⁴ m',    color: INK },
          { log: 2.0, name: 'eduLAB',              sub: '~1×10² m',    color: CYAN },
        ];

        // Animate through steps over the scene
        const settleTime = dur - 1.2; // time at which we settle on eduLAB
        const rawProg = Math.min(localTime / settleTime, 1);
        // easing: start slow (cosmic), accelerate, slow again at end
        const eased = Easing.easeInOutCubic(rawProg);
        const idxF = eased * (steps.length - 1);
        const idx = Math.floor(idxF);
        const frac = idxF - idx;

        const current = steps[idx];
        const next = steps[Math.min(idx + 1, steps.length - 1)];

        // interpolate log value for ruler position
        const logNow = current.log + (next.log - current.log) * frac;

        // Big current-step label
        const activeName = frac < 0.5 ? current.name : next.name;
        const activeSub  = frac < 0.5 ? current.sub  : next.sub;
        const activeColor = frac < 0.5 ? current.color : next.color;
        const stepFade = Math.abs(0.5 - frac) * 2; // 1 at tick, 0 at mid-transition
        const labelOpacity = stepFade;

        // How many orders of magnitude left until eduLAB
        const ordersLeft = Math.max(0, logNow - 2.0);

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut }}>
            <HUD index={9} total={10} label="Retour vers vous" />

            {/* Kicker top-right */}
            <div style={{
              position: 'absolute', top: 140, right: 100, textAlign: 'right',
              fontFamily: HELV, color: INK,
            }}>
              <div style={{
                fontSize: 13, letterSpacing: '0.32em',
                textTransform: 'uppercase', fontWeight: 700, color: DIM,
                marginBottom: 14,
              }}>
                Retour à la maison
              </div>
              <div style={{
                fontSize: 52, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.0,
                color: INK, maxWidth: 640,
              }}>
                Maintenant,<br/>dans l'autre sens.
              </div>
              <div style={{
                marginTop: 18, fontFamily: BODY, fontSize: 17, lineHeight: 1.55,
                color: DIM, maxWidth: 560, marginLeft: 'auto',
              }}>
                De 10<sup>27</sup> m jusqu'à un bâtiment précis. Regardez l'échelle fondre.
              </div>
            </div>

            {/* Big center stack: current scale name */}
            <div style={{
              position: 'absolute', left: 100, top: '50%',
              transform: 'translate(0, -50%)',
              fontFamily: HELV, color: INK, maxWidth: 900,
            }}>
              <div style={{
                fontSize: 13, letterSpacing: '0.32em',
                textTransform: 'uppercase', fontWeight: 700, color: DIM,
                marginBottom: 20,
              }}>
                Actuellement
              </div>
              <div style={{
                fontSize: 120, fontWeight: 700, letterSpacing: '-0.04em',
                lineHeight: 0.95, color: activeColor,
                opacity: labelOpacity,
                transform: `translateY(${(1 - labelOpacity) * 14}px)`,
                transition: 'none',
              }}>
                {activeName}
              </div>
              <div style={{
                marginTop: 18, fontSize: 22, letterSpacing: '0.14em',
                fontWeight: 500, color: DIM, opacity: labelOpacity,
              }}>
                {activeSub}
              </div>

              {/* orders of magnitude readout */}
              <div style={{
                marginTop: 56, display: 'flex', alignItems: 'baseline', gap: 20,
                fontFamily: BODY,
              }}>
                <div style={{
                  fontSize: 13, letterSpacing: '0.28em', textTransform: 'uppercase',
                  fontWeight: 700, color: DIM,
                }}>
                  Distance restante
                </div>
                <div style={{
                  fontFamily: HELV, fontSize: 48, fontWeight: 700,
                  color: INK, letterSpacing: '-0.02em',
                }}>
                  {ordersLeft.toFixed(1)}
                </div>
                <div style={{
                  fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase',
                  fontWeight: 500, color: DIM,
                }}>
                  ordres de grandeur
                </div>
              </div>
            </div>

            <ScaleRuler logMeters={logNow} label={`${activeName} · ${activeSub}`} />
          </div>
        );
      }}
    </Sprite>
  );
}

// ─── eduLAB logo — faceted gem icon + "edu" gray + "LAB" teal + orange dot ───
function EduLabLogo({ width = 520 }) {
  const LTEAL   = '#4DB6AC';
  const LGRAY   = '#5A5A5A';
  const LORANGE = '#F5A623';
  return (
    <svg width={width} viewBox="0 0 820 270" xmlns="http://www.w3.org/2000/svg"
         style={{ display: 'block' }}>
      <defs>
        {/* 8-sided concave star: 4 outer vertices + 4 inner junctions */}
        <clipPath id="gemClip">
          <polygon points="120,8 150,125 232,155 178,250 120,268 62,250 8,155 90,125"/>
        </clipPath>
      </defs>

      {/* ── Faceted teal gem icon ── */}
      <g clipPath="url(#gemClip)">
        <polygon points="120,8 150,125 232,155 178,250 120,268 62,250 8,155 90,125"
                 fill={LTEAL}/>
        {/* 4 white seams radiating from hub to outer vertices */}
        <line x1="120" y1="170" x2="90"  y2="125" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        <line x1="120" y1="170" x2="150" y2="125" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        <line x1="120" y1="170" x2="62"  y2="250" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        <line x1="120" y1="170" x2="178" y2="250" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      </g>

      {/* ── "edu" — gray, light weight ── */}
      <text x="284" y="168"
            fontFamily="Poppins,'Helvetica Neue',Helvetica,sans-serif"
            fontSize="120" fontWeight="300"
            fill={LGRAY}>edu</text>

      {/* ── orange dot ── */}
      <circle cx="510" cy="118" r="13" fill={LORANGE}/>

      {/* ── "LAB" — teal, bold ── */}
      <text x="530" y="168"
            fontFamily="Poppins,'Helvetica Neue',Helvetica,sans-serif"
            fontSize="120" fontWeight="700"
            fill={LTEAL}>LAB</text>

      {/* ── "by technofutur tic" ── */}
      <text x="284" y="213"
            fontFamily="Poppins,'Helvetica Neue',Helvetica,sans-serif"
            fontSize="30" fontWeight="400"
            fill={LGRAY}>by technofutur</text>
      <text x="553" y="200"
            fontFamily="Poppins,'Helvetica Neue',Helvetica,sans-serif"
            fontSize="19" fontWeight="400"
            fill={LGRAY}>tic</text>
    </svg>
  );
}

// ─── Scene 11: eduLAB final CTA ─────────────────────────────────────────────
function SceneEduLab({ start, dur }) {
  return (
    <Sprite start={start} end={start + dur}>
      {({ localTime }) => {
        const inOut = interpolate([0, 0.7, dur - 0.6, dur], [0, 1, 1, 0])(localTime);

        // Logo pops in first
        const logoIn = interpolate([0.2, 1.2], [0, 1], Easing.easeOutCubic)(localTime);
        // Then tagline
        const taglineIn = interpolate([1.0, 1.8], [0, 1], Easing.easeOutCubic)(localTime);
        // Then main headline
        const headlineIn = interpolate([1.6, 2.4], [0, 1], Easing.easeOutCubic)(localTime);
        // Then comparison stat
        const statIn = interpolate([2.6, 3.4], [0, 1], Easing.easeOutCubic)(localTime);
        // Then the three pills
        const pillsIn = interpolate([3.6, 4.6], [0, 1], Easing.easeOutCubic)(localTime);
        // Then CTA
        const ctaIn = interpolate([4.8, 5.6], [0, 1], Easing.easeOutCubic)(localTime);

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: inOut,
                        display: 'flex', flexDirection: 'column' }}>
            <HUD index={10} total={10} label="eduLAB · Vous êtes arrivés" />

            {/* Two-column: left = logo + pitch, right = comparison diagram */}
            <div style={{
              flex: 1, display: 'grid',
              gridTemplateColumns: '1.15fr 1fr',
              gap: 80, padding: '180px 120px 160px 120px',
              alignItems: 'center',
            }}>
              {/* LEFT */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  opacity: logoIn,
                  transform: `translateY(${(1 - logoIn) * 14}px)`,
                }}>
                  <EduLabLogo width={420} color={INK} accent={CYAN} />
                </div>

                <div style={{
                  marginTop: 40,
                  fontFamily: HELV, fontSize: 13, letterSpacing: '0.32em',
                  textTransform: 'uppercase', fontWeight: 700, color: CYAN,
                  opacity: taglineIn,
                  transform: `translateY(${(1 - taglineIn) * 10}px)`,
                }}>
                  Formations STEAM &amp; IA · par Technofutur TIC
                </div>

                <div style={{
                  marginTop: 20, fontFamily: HELV,
                  fontSize: 68, fontWeight: 700, letterSpacing: '-0.03em',
                  lineHeight: 1.0, color: INK,
                  opacity: headlineIn,
                  transform: `translateY(${(1 - headlineIn) * 14}px)`,
                  textWrap: 'balance',
                }}>
                  Vous êtes déjà<br/>presque là.
                </div>

                <div style={{
                  marginTop: 26, fontFamily: BODY,
                  fontSize: 20, lineHeight: 1.55, color: INK,
                  maxWidth: 620,
                  opacity: headlineIn,
                }}>
                  L'eduLAB accompagne les enseignants qui veulent
                  ouvrir leurs classes au numérique, à la robotique,
                  à l'IA et aux démarches STEAM.
                </div>

                {/* three topic pills */}
                <div style={{
                  marginTop: 34, display: 'flex', gap: 10, flexWrap: 'wrap',
                  opacity: pillsIn,
                  transform: `translateY(${(1 - pillsIn) * 10}px)`,
                }}>
                  {[
                    { label: 'STEAM en classe', color: CYAN },
                    { label: 'IA pour enseignants', color: PINK },
                    { label: 'Numérique éducatif', color: GOLD },
                  ].map((p, i) => (
                    <div key={i} style={{
                      padding: '12px 20px',
                      border: `1.5px solid ${p.color}`,
                      borderRadius: 999,
                      fontFamily: HELV, fontSize: 14, fontWeight: 600,
                      letterSpacing: '0.04em', color: INK,
                      background: 'transparent',
                    }}>
                      <span style={{
                        display: 'inline-block', width: 8, height: 8,
                        borderRadius: '50%', background: p.color, marginRight: 10,
                        verticalAlign: 'middle',
                      }}/>
                      {p.label}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div style={{
                  marginTop: 48, display: 'flex', alignItems: 'center', gap: 24,
                  opacity: ctaIn,
                  transform: `translateY(${(1 - ctaIn) * 10}px)`,
                }}>
                  <div style={{
                    padding: '18px 32px',
                    background: INK, color: PAPER,
                    fontFamily: HELV, fontSize: 16, fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    borderRadius: 4,
                  }}>
                    Franchissez le dernier pas →
                  </div>
                  <div style={{
                    fontFamily: BODY, fontSize: 15, color: DIM,
                    letterSpacing: '0.02em',
                  }}>
                    technofuturtic.be · edulab
                  </div>
                </div>
              </div>

              {/* RIGHT: scale comparison */}
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'stretch', justifyContent: 'center',
                opacity: statIn,
                transform: `translateY(${(1 - statIn) * 14}px)`,
              }}>
                <div style={{
                  fontFamily: HELV, fontSize: 13, letterSpacing: '0.32em',
                  textTransform: 'uppercase', fontWeight: 700, color: DIM,
                  marginBottom: 28, textAlign: 'center',
                }}>
                  Mise en perspective
                </div>

                {/* Big comparison */}
                <div style={{
                  border: `1.5px solid ${INK}`,
                  padding: '36px 34px',
                  display: 'flex', flexDirection: 'column', gap: 22,
                  background: PAPER,
                }}>
                  <ComparisonRow
                    lhs="Univers observable"
                    rhs="8,8 × 10²⁶ m"
                    width={1.0}
                    color={INK}
                  />
                  <ComparisonRow
                    lhs="Voie lactée"
                    rhs="10²¹ m"
                    width={0.78}
                    color={INK}
                  />
                  <ComparisonRow
                    lhs="Proxima Centauri"
                    rhs="4 × 10¹⁶ m"
                    width={0.60}
                    color={INK}
                  />
                  <ComparisonRow
                    lhs="Diamètre de la Terre"
                    rhs="1,27 × 10⁷ m"
                    width={0.27}
                    color={INK}
                  />
                  <ComparisonRow
                    lhs="Vous → eduLAB"
                    rhs="quelques dizaines de km"
                    width={0.015}
                    color={CYAN}
                    highlight
                  />
                </div>

                <div style={{
                  marginTop: 26, fontFamily: HELV,
                  fontSize: 22, fontWeight: 500, lineHeight: 1.35,
                  color: INK, letterSpacing: '-0.005em',
                  textAlign: 'center',
                  textWrap: 'balance',
                }}>
                  Après <strong style={{ fontWeight: 700 }}>vingt-cinq ordres de grandeur</strong>,<br/>
                  il serait dommage de s'arrêter <em style={{ color: CYAN, fontStyle: 'normal', fontWeight: 700 }}>ici</em>.
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// A single row in the "mise en perspective" table
function ComparisonRow({ lhs, rhs, width, color, highlight }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div style={{
          fontFamily: HELV, fontSize: highlight ? 17 : 15, fontWeight: highlight ? 700 : 600,
          color: highlight ? color : INK,
          letterSpacing: '0.02em',
        }}>
          {lhs}
        </div>
        <div style={{
          fontFamily: BODY, fontSize: 13, color: DIM, letterSpacing: '0.04em',
        }}>
          {rhs}
        </div>
      </div>
      <div style={{ position: 'relative', height: highlight ? 8 : 6, background: '#e8e4df' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${Math.max(width * 100, 0.4)}%`,
          minWidth: highlight ? 4 : 2,
          background: color,
        }}/>
      </div>
    </div>
  );
}

// ─── Timestamp label ────────────────────────────────────────────────────────
function TimestampLabel() {
  const time = useTime();
  React.useEffect(() => {
    const root = document.querySelector('[data-video-root]');
    if (root) {
      const s = Math.floor(time);
      root.setAttribute('data-screen-label', `t=${s}s`);
    }
  }, [Math.floor(time)]);
  return null;
}

Object.assign(window, {
  SceneTitle, SceneEarth, SceneMoon, SceneSun, SceneJupiter,
  SceneLightSpeed, SceneProxima, SceneGalaxy, SceneUniverse,
  SceneZoomBack, SceneEduLab, SceneOutro,
  EduLabLogo, ComparisonRow,
  TimestampLabel,
  INK, PAPER, DIM, RULE, HELV, BODY, CYAN, GOLD, PINK,
});
