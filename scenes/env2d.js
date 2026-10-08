/**
 * Accessible 2D environment controller.
 * Implements the same interface as Env3D but renders a static stylized
 * illustration of the office. Interactive objects appear as DOM buttons
 * (rendered by InteractionSystem) so the entire course is completable
 * without 3D navigation, mouse or otherwise.
 */

const ILLUSTRATION = `
<svg class="office-illus" viewBox="0 0 880 330" role="img"
     aria-label="Northstar Dynamics office with Alice's workstation, coworkers at nearby desks, and a city view with buildings, a café, street, and pedestrian crossing through the windows.">
  <defs>
    <linearGradient id="wall-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#22364f"/><stop offset="1" stop-color="#182a44"/>
    </linearGradient>
    <linearGradient id="win-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#a9d1ef"/><stop offset=".68" stop-color="#d6e5e5"/><stop offset="1" stop-color="#d8c6aa"/>
    </linearGradient>
    <linearGradient id="floor-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#687586"/><stop offset="1" stop-color="#39485a"/>
    </linearGradient>
    <linearGradient id="desk-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b08a63"/><stop offset="1" stop-color="#76573f"/>
    </linearGradient>
    <linearGradient id="glass-glint" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".4" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="window-a"><rect x="40" y="34" width="150" height="120" rx="8"/></clipPath>
    <clipPath id="window-b"><rect x="230" y="34" width="150" height="120" rx="8"/></clipPath>
    <clipPath id="window-c"><rect x="420" y="34" width="150" height="120" rx="8"/></clipPath>
    <clipPath id="window-d"><rect x="610" y="34" width="150" height="120" rx="8"/></clipPath>
  </defs>
  <rect width="880" height="330" fill="#111b29"/>
  <rect x="0" y="0" width="880" height="240" rx="16" fill="url(#wall-g)"/>
  <g opacity=".84">
    <g clip-path="url(#window-a)">
      <rect x="40" y="34" width="150" height="120" fill="url(#win-g)"/>
      <path d="M40 124V91h30v33zm34 0V69h37v55zm42 0V99h27v25zm32 0V78h42v46z" fill="#687c8d"/>
      <g fill="#d5d7cc" opacity=".65"><path d="M46 98h5v7h-5zm13 0h5v7h-5zm25-20h6v7h-6zm14 0h6v7h-6zm25 29h5v7h-5zm39-20h6v7h-6zm14 0h6v7h-6z"/></g>
      <rect x="40" y="124" width="150" height="4" fill="#d3c1a4"/><rect x="40" y="128" width="150" height="26" fill="#343d46"/>
      <path d="M52 128v26m18-26v26m18-26v26m18-26v26m18-26v26m18-26v26m18-26v26" stroke="#eeeade" stroke-width="7"/>
      <path d="M48 42h62l-57 112h-13z" fill="url(#glass-glint)"/>
    </g>
    <g clip-path="url(#window-b)">
      <rect x="230" y="34" width="150" height="120" fill="url(#win-g)"/>
      <path d="M230 118V82h36v36zm41 0V58h42v60zm47 0V91h29v27zm34 0V73h40v45z" fill="#7c8f9a"/>
      <g fill="#e4dfcf" opacity=".68"><path d="M237 89h6v8h-6zm15 0h6v8h-6zm26-23h7v8h-7zm16 0h7v8h-7zm35 33h6v8h-6zm40-37h7v8h-7zm15 0h7v8h-7z"/></g>
      <rect x="240" y="103" width="83" height="22" fill="#d8c2a4" stroke="#705b4b"/>
      <path d="M237 103h89l-5 9h-79z" fill="#9f5944"/><path d="M244 104v8m15-8v8m15-8v8m15-8v8m15-8v8" stroke="#f0d7b8" stroke-width="5"/>
      <rect x="247" y="113" width="24" height="12" fill="#8fb1b5"/><rect x="275" y="113" width="22" height="12" fill="#88a9ad"/>
      <text x="282" y="101" fill="#fff0d8" font-family="system-ui" font-size="5" font-weight="800" text-anchor="middle">CAFÉ</text>
      <rect x="230" y="125" width="150" height="4" fill="#d3c1a4"/><rect x="230" y="129" width="150" height="25" fill="#343d46"/>
      <path d="M242 129v25m18-25v25m18-25v25m18-25v25m18-25v25m18-25v25m18-25v25" stroke="#eeeade" stroke-width="7"/>
      <path d="M239 42h56l-56 112h-9z" fill="url(#glass-glint)"/>
    </g>
    <g clip-path="url(#window-c)">
      <rect x="420" y="34" width="150" height="120" fill="url(#win-g)"/>
      <path d="M420 121V88h33v33zm39 0V68h44v53zm50 0V93h28v28zm34 0V77h42v44z" fill="#718594"/>
      <g fill="#e4dfcf" opacity=".68"><path d="M426 96h6v7h-6zm14 0h6v7h-6zm28-21h7v8h-7zm17 0h7v8h-7zm35 25h6v7h-6zm39-17h7v8h-7zm15 0h7v8h-7z"/></g>
      <rect x="420" y="121" width="150" height="5" fill="#d3c1a4"/><rect x="420" y="126" width="150" height="28" fill="#343d46"/>
      <path d="M434 126v28m18-28v28m18-28v28m18-28v28m18-28v28m18-28v28m18-28v28" stroke="#eeeade" stroke-width="7"/>
      <path d="M430 42h54l-55 112h-9z" fill="url(#glass-glint)"/>
    </g>
    <g clip-path="url(#window-d)">
      <rect x="610" y="34" width="150" height="120" fill="url(#win-g)"/>
      <path d="M610 119V82h38v37zm44 0V61h42v58zm48 0V92h27v27zm33 0V70h43v49z" fill="#7a8b96"/>
      <g fill="#e4dfcf" opacity=".68"><path d="M617 90h6v8h-6zm15 0h6v8h-6zm29-21h7v8h-7zm16 0h7v8h-7zm32 29h6v8h-6zm40-22h7v8h-7zm15 0h7v8h-7z"/></g>
      <rect x="610" y="119" width="150" height="5" fill="#d3c1a4"/><rect x="610" y="124" width="150" height="30" fill="#343d46"/>
      <path d="M625 124v30m18-30v30m18-30v30m18-30v30m18-30v30m18-30v30m18-30v30" stroke="#eeeade" stroke-width="7"/>
      <rect x="674" y="116" width="37" height="9" rx="4" fill="#385569"/><circle cx="681" cy="126" r="3" fill="#17212b"/><circle cx="704" cy="126" r="3" fill="#17212b"/>
      <path d="M621 42h58l-58 112h-11z" fill="url(#glass-glint)"/>
    </g>
  </g>
  <g stroke="#66778a" stroke-width="2" opacity=".65"><path d="M0 158h880"/><path d="M0 166h880" stroke="#0f1d33" stroke-width="5"/></g>
  <rect x="0" y="166" width="880" height="164" fill="url(#floor-g)"/>
  <g stroke="#a8b3c2" stroke-opacity=".12" stroke-width="1"><path d="M0 204h880M0 247h880M0 291h880"/><path d="M110 166v164m150-164v164m155-164v164m155-164v164m150-164v164"/></g>

  <!-- background desks -->
  <g opacity=".45">
    <rect x="560" y="196" width="180" height="10" rx="3" fill="#6b7a92"/>
    <rect x="596" y="160" width="76" height="42" rx="4" fill="#111827"/>
    <rect x="598" y="163" width="72" height="34" rx="2" fill="#1e2d45"/>
    <rect x="130" y="196" width="180" height="10" rx="3" fill="#6b7a92"/>
    <rect x="166" y="160" width="76" height="42" rx="4" fill="#111827"/>
    <rect x="168" y="163" width="72" height="34" rx="2" fill="#1e2d45"/>
  </g>

  <!-- Coworkers seated at the background desks. -->
  <g aria-hidden="true" opacity=".88">
    <g>
      <path d="M270 205v-13q0-13 13-13h11q13 0 13 13v13z" fill="#386f83"/>
      <circle cx="284" cy="176" r="9" fill="#c98f68"/><path d="M275 176q1-11 10-11 8 0 9 9-5-4-10-4-4 4-9 6" fill="#30251f"/>
      <path d="M273 191l-12 8 17 2m21-10 12 8-17 2" fill="none" stroke="#c98f68" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g>
      <path d="M733 205v-13q0-13 13-13h11q13 0 13 13v13z" fill="#72527d"/>
      <circle cx="747" cy="176" r="9" fill="#8f5f47"/><path d="M738 176q1-11 10-11 8 0 9 9-5-4-10-4-4 4-9 6" fill="#18191d"/>
      <path d="M736 191l-12 8 17 2m21-10 12 8-17 2" fill="none" stroke="#8f5f47" stroke-width="5" stroke-linecap="round"/>
    </g>
  </g>

  <!-- Alice workstation -->
  <ellipse cx="438" cy="284" rx="170" ry="15" fill="#111827" opacity=".3"/>
  <g id="ws-group">
    <rect x="310" y="230" width="250" height="12" rx="4" fill="url(#desk-g)"/>
    <path d="M319 233h232M325 238h190" stroke="#d2ae84" stroke-opacity=".35" stroke-width="1"/>
    <rect x="318" y="242" width="10" height="60" fill="#3c4658"/>
    <rect x="542" y="242" width="10" height="60" fill="#3c4658"/>
    <rect x="363" y="246" width="83" height="35" rx="3" fill="#74583e" stroke="#4d3b2e"/>
    <rect x="395" y="258" width="18" height="3" rx="1.5" fill="#c2a77f"/>
    <rect x="352" y="160" width="120" height="74" rx="6" fill="#111827"/>
    <rect id="ws-screen" x="356" y="164" width="112" height="62" rx="3" fill="#123a44" stroke="#334155"/>
    <path d="M361 168h37l-34 49h-8z" fill="#fff" opacity=".06"/>
    <text id="ws-label" x="412" y="200" fill="#60a5fa" font-family="system-ui" font-size="12" font-weight="800" text-anchor="middle">WINDOWS 11</text>
    <circle cx="412" cy="161.5" r="1.6" fill="#0b111d"/>
    <rect x="480" y="224" width="46" height="8" rx="3" fill="#2b3444"/>
    <rect x="352" y="236" width="60" height="14" rx="3" fill="#d7dce5"/>
    <rect x="426" y="238" width="12" height="10" rx="4" fill="#d7dce5"/>
    <path d="M356 239h51" stroke="#9aa5b5" stroke-width="1"/>
    <rect x="326" y="215" width="24" height="20" rx="2" fill="#f5e9b7" transform="rotate(-4 326 215)"/>
    <path d="M330 221h14m-14 4h11m-11 4h13" stroke="#b59d65" stroke-width=".8"/>
    <rect x="483" y="209" width="17" height="20" rx="4" fill="#e8edf2"/>
    <ellipse cx="491.5" cy="210" rx="7" ry="2.5" fill="#6f513c"/>
    <path d="M500 214c10-2 10 12 1 11" fill="none" stroke="#d4dbe4" stroke-width="2.5"/>
    <rect id="ws-phone" x="508" y="214" width="16" height="26" rx="4" fill="#2b3444"/>
    <g id="ws-phone-alert" display="none" aria-hidden="true">
      <path d="M527 215q7 6 0 12M530 212q11 9 0 18" fill="none" stroke="#f87171" stroke-width="1.5" stroke-linecap="round"/>
      <text x="536" y="222" fill="#fecaca" font-family="system-ui" font-size="7" font-weight="800">UNKNOWN</text>
      <text x="536" y="231" fill="#fecaca" font-family="system-ui" font-size="7" font-weight="800">CALLER</text>
    </g>
    <g aria-hidden="true">
      <path d="M335 225c-11-18-7-33 2-43 10 9 12 23 2 43m-3 0c-2-20 5-36 15-43 6 14 2 30-11 45m-4-1c-10-13-11-25-7-34 10 6 15 16 11 34" fill="#4e8a62" stroke="#2c6047" stroke-width="1.5"/>
      <path d="M326 222h25l-3 17h-19z" fill="#9b674a" stroke="#654332"/>
      <path d="M327 225h23" stroke="#c28a63" stroke-width="2"/>
    </g>
    <rect id="ws-cable" x="548" y="242" width="8" height="60" fill="#1f2937"/>
    <circle id="ws-port" cx="552" cy="306" r="5" fill="#4ade80"/>
  </g>

  <!-- clean laptop desk -->
  <ellipse cx="704" cy="287" rx="115" ry="13" fill="#111827" opacity=".28"/>
  <g id="pc-group">
    <rect x="620" y="236" width="170" height="10" rx="4" fill="url(#desk-g)"/>
    <path d="M628 239h151" stroke="#d2ae84" stroke-opacity=".36"/>
    <rect x="628" y="246" width="8" height="56" fill="#3c4658"/>
    <rect x="774" y="246" width="8" height="56" fill="#3c4658"/>
    <rect id="pc-base" x="664" y="228" width="72" height="8" rx="3" fill="#9da8b5" stroke="#566273"/>
    <path d="M672 231h55m-49 3h42" stroke="#dbe2e8" stroke-width=".8"/>
    <rect id="pc-lid" x="668" y="192" width="64" height="40" rx="4" fill="#111827" stroke="#64748b"/>
    <rect id="pc-screen" x="671" y="195" width="58" height="34" rx="2" fill="#0a1424" stroke="#374151"/>
    <path d="M675 198h22l-24 26h-2z" fill="#fff" opacity=".06"/>
    <text id="pc-label" x="700" y="215" fill="#c4b5fd" font-family="system-ui" font-size="7" font-weight="800" text-anchor="middle"></text>
  </g>

  <!-- Transparent hit areas make the illustrated office directly interactive.
       InteractionSystem gates each target to the objects needed by the step. -->
  <g class="office-hotspots" aria-label="Interactive office objects">
    <rect class="office-hotspot" data-object-id="monitor" x="340" y="150" width="195" height="102" rx="8" role="button" tabindex="0" aria-label="Workstation" />
    <rect class="office-hotspot" data-object-id="phone" x="500" y="208" width="32" height="40" rx="6" role="button" tabindex="0" aria-label="Mobile phone" />
    <rect class="office-hotspot" data-object-id="cable" x="536" y="238" width="28" height="72" rx="6" role="button" tabindex="0" aria-label="Network cable" />
    <rect class="office-hotspot" data-object-id="power_button" x="470" y="218" width="66" height="32" rx="6" role="button" tabindex="0" aria-label="Power button" />
    <rect class="office-hotspot" data-object-id="cleanpc" x="650" y="185" width="102" height="64" rx="8" role="button" tabindex="0" aria-label="Clean laptop" />
  </g>

  <!-- Drag these office items to reposition them. -->
  <g class="office-draggable" data-draggable="true" data-kind="chair" data-x="426" data-y="280" transform="translate(426 280)" role="button" tabindex="0" aria-label="Office chair. Drag to move or use arrow keys.">
    <ellipse cy="20" rx="48" ry="8" fill="#111827" opacity=".3"/>
    <g fill="#233042"><rect x="-26" y="12" width="52" height="10" rx="4"/><rect x="-28" y="-12" width="8" height="26"/><rect x="20" y="-12" width="8" height="26"/></g>
    <path d="M-31 -11q2-18 14-18h25q12 0 14 18z" fill="#3b4c63"/>
  </g>
  <g class="office-draggable" data-draggable="true" data-kind="chair" data-x="716" data-y="280" transform="translate(716 280)" role="button" tabindex="0" aria-label="Office chair. Drag to move or use arrow keys.">
    <ellipse cy="20" rx="48" ry="8" fill="#111827" opacity=".3"/>
    <g fill="#233042"><rect x="-26" y="12" width="52" height="10" rx="4"/><rect x="-28" y="-12" width="8" height="26"/><rect x="20" y="-12" width="8" height="26"/></g>
    <path d="M-31 -11q2-18 14-18h25q12 0 14 18z" fill="#3b4c63"/>
  </g>
  <g class="office-draggable" data-draggable="true" data-kind="recycling bin" data-x="260" data-y="291" transform="translate(260 291)" role="button" tabindex="0" aria-label="Recycling bin. Drag to move or use arrow keys.">
    <ellipse cy="17" rx="19" ry="5" fill="#111827" opacity=".3"/>
    <path d="M-13 -20h26l-3 35h-20z" fill="#35465b" stroke="#64748b" stroke-width="2"/>
    <ellipse cy="-20" rx="14" ry="4" fill="#4da4a0"/><path d="M-5 -8h10v3h-10z" fill="#99f6e4"/>
  </g>
  <g class="office-draggable" data-draggable="true" data-kind="recycling bin" data-x="805" data-y="291" transform="translate(805 291)" role="button" tabindex="0" aria-label="Recycling bin. Drag to move or use arrow keys.">
    <ellipse cy="17" rx="19" ry="5" fill="#111827" opacity=".3"/>
    <path d="M-13 -20h26l-3 35h-20z" fill="#35465b" stroke="#64748b" stroke-width="2"/>
    <ellipse cy="-20" rx="14" ry="4" fill="#64748b"/><path d="M-5 -8h10v3h-10z" fill="#cbd5e1"/>
  </g>
</svg>`;

export class Env2D {
  constructor(interactionSystem) {
    this.mode = '2d';
    this.sys = interactionSystem;
  }

  init() {
    const host = document.getElementById('scene-2d');
    if (host) host.innerHTML = ILLUSTRATION;
    host?.querySelectorAll('.office-hotspot').forEach((hotspot) => {
      const activate = () => this.sys.activate(hotspot.dataset.objectId);
      hotspot.addEventListener('click', activate);
      hotspot.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      });
    });
    const svg = host?.querySelector('svg');
    const toSvgPoint = (event) => {
      if (!svg) return null;
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      return point.matrixTransform(svg.getScreenCTM().inverse());
    };
    let drag = null;
    svg?.addEventListener('pointerdown', (event) => {
      const item = event.target.closest?.('[data-draggable="true"]');
      if (!item) return;
      const point = toSvgPoint(event);
      if (!point) return;
      drag = { item, pointerId: event.pointerId, x: point.x, y: point.y,
        startX: Number(item.dataset.x), startY: Number(item.dataset.y) };
      svg.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });
    svg?.addEventListener('pointermove', (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const point = toSvgPoint(event);
      if (!point) return;
      const x = Math.max(28, Math.min(852, drag.startX + point.x - drag.x));
      const y = Math.max(185, Math.min(304, drag.startY + point.y - drag.y));
      drag.item.dataset.x = String(x);
      drag.item.dataset.y = String(y);
      drag.item.setAttribute('transform', `translate(${x} ${y})`);
      event.preventDefault();
    });
    const finishDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      svg.releasePointerCapture?.(event.pointerId);
      drag = null;
    };
    svg?.addEventListener('pointerup', finishDrag);
    svg?.addEventListener('pointercancel', finishDrag);
    svg?.addEventListener('keydown', (event) => {
      const item = event.target.closest?.('[data-draggable="true"]');
      const delta = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] }[event.key];
      if (!item || !delta) return;
      const x = Math.max(28, Math.min(852, Number(item.dataset.x) + delta[0]));
      const y = Math.max(185, Math.min(304, Number(item.dataset.y) + delta[1]));
      item.dataset.x = String(x);
      item.dataset.y = String(y);
      item.setAttribute('transform', `translate(${x} ${y})`);
      event.preventDefault();
    });
    this._els = {
      wsScreen: document.getElementById('ws-screen'),
      wsLabel: document.getElementById('ws-label'),
      wsPhone: document.getElementById('ws-phone'),
      wsPhoneAlert: document.getElementById('ws-phone-alert'),
      wsCable: document.getElementById('ws-cable'),
      wsPort: document.getElementById('ws-port'),
      pcScreen: document.getElementById('pc-screen'),
      pcLabel: document.getElementById('pc-label'),
    };
    return this;
  }

  dispose() {}

  setView() { /* static illustration — camera transitions are a no-op */ }

  setInteractive() { /* chips rendered by InteractionSystem */ }

  onActivate(id) { this.sys.activate(id); }

  setObjectState(id, st) {
    if (id === 'workstation') {
      if (st === 'compromised' || st === 'isolated') {
        this._els.wsScreen.setAttribute('fill', '#5c1116');
        this._els.wsLabel.textContent = '⚠ ENCRYPTED';
        this._els.wsLabel.setAttribute('fill', '#fca5a5');
      } else if (st === 'off') {
        this._els.wsScreen.setAttribute('fill', '#04060c');
        this._els.wsLabel.textContent = '';
      } else {
        this._els.wsScreen.setAttribute('fill', '#123a44');
        this._els.wsLabel.textContent = 'WINDOWS 11';
        this._els.wsLabel.setAttribute('fill', '#60a5fa');
      }
    }
    if (id === 'cable') {
      this._els.wsCable.style.display = st === 'unplugged' ? 'none' : 'block';
      this._els.wsPort.setAttribute('fill', st === 'unplugged' ? '#64748b' : '#4ade80');
    }
    if (id === 'cleanpc') {
      this._els.pcScreen.setAttribute('fill',
        st === 'login' ? '#0d1a30' : st === 'clean' ? '#123a44' : '#0a1424');
      this._els.pcLabel.textContent = st === 'clean' ? 'LINUX' : '';
    }
  }

  paintMonitor() { /* handled by setObjectState */ }

  ringPhone(on) {
    if (!this._els?.wsPhone) return;
    this._els.wsPhone.setAttribute('fill', on ? '#3b82f6' : '#2b3444');
    this._els.wsPhone.classList.toggle('ringing', on);
    this._els.wsPhoneAlert?.setAttribute('display', on ? 'inline' : 'none');
  }

  shake() { /* no motion in 2D mode by design */ }

  resize() {}
}
