import { useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Gamepad2, Palette, Sparkles, Trophy, Users } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-to-play" element={<HowToPlayPage />} />
        <Route path="/play" element={<Navigate to="/room/demo-room" replace />} />
        <Route path="/room/:roomCode" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  const features = useMemo(
    () => [
      { icon: Palette, title: 'Live drawing', text: 'Sketch, color, and erase in real time with friends.' },
      { icon: Users, title: 'Easy rooms', text: 'Create a room or join with a short code in seconds.' },
      { icon: Gamepad2, title: 'Fast rounds', text: 'Guess, score, and rotate through rounds without lag.' },
    ],
    [],
  );

  const stats = useMemo(
    () => [
      { value: '1.2M+', label: 'rounds played' },
      { value: '20k+', label: 'active players' },
      { value: '4.9/5', label: 'player rating' },
    ],
    [],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf4] text-brand-ink">
      <div className="hero-glow hero-glow-a" />
      <div className="hero-glow hero-glow-b" />
      <div className="hero-glow hero-glow-c" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple via-brand-sky to-brand-mint text-2xl text-white shadow-[0_14px_28px_rgba(118,87,232,0.35)]">
            ✏️
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight">Scribblio</div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-brand-purple/70">Draw it. Guess it.</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/room/demo-room')}
          className="rounded-full bg-brand-purple px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(118,87,232,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6950df]"
        >
          Join a Room
        </button>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-4 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:px-10">
        <section className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-purple/10 bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-brand-ink shadow-soft backdrop-blur-sm">
            <Sparkles size={12} className="text-brand-purple" />
            Party game mode
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-brand-ink sm:text-6xl lg:text-[4.15rem]">
            Your drawing skills don't matter. Your imagination does.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-brand-ink/75">
            Draw silly pictures, guess secret words, challenge your friends, and see who becomes the ultimate Scribblio champion.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/play')}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-purple px-6 py-3.5 text-base font-bold text-white shadow-[0_16px_32px_rgba(118,87,232,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6950df]"
            >
              Play Now
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/how-to-play')}
              className="rounded-full border border-brand-purple/15 bg-white/80 px-6 py-3.5 text-base font-bold text-brand-purple shadow-soft backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              How to Play
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 md:gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl border border-brand-purple/10 bg-white/80 px-4 py-3 shadow-soft backdrop-blur-sm">
                <div className="text-xl font-black text-brand-ink">{value}</div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-brand-ink/60">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="feature-card rounded-[28px] border border-brand-purple/10 bg-white/80 p-4 shadow-soft backdrop-blur-sm"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-mint/30 to-brand-sky/20 text-brand-purple">
                  <Icon size={18} />
                </div>
                <h3 className="mb-2 text-base font-extrabold text-brand-ink">{title}</h3>
                <p className="text-sm leading-6 text-brand-ink/70">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="relative">
          <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-brand-coral/20 blur-3xl" />
          <div className="absolute -right-8 bottom-10 h-32 w-32 rounded-full bg-brand-purple/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-[36px] border border-brand-purple/10 bg-white/80 p-5 shadow-[0_28px_80px_rgba(36,22,63,0.16)] backdrop-blur-sm">
            <div className="absolute inset-x-10 top-0 h-20 rounded-b-full bg-gradient-to-r from-brand-yellow/40 via-brand-coral/10 to-brand-mint/30 blur-2xl" />

            <div className="relative rounded-[30px] bg-gradient-to-br from-brand-purple via-[#7d67eb] to-[#7ed8c1] p-5 text-white">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/90">
                  Live Draw
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold">60s</span>
              </div>

              <div className="rounded-[24px] bg-white/10 p-3 shadow-inner ring-1 ring-white/10 backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f4d35e] to-[#f7aa55] ring-2 ring-white/60" />
                  <div>
                    <div className="text-sm font-bold">Alex is drawing</div>
                    <div className="text-xs text-white/80">Secret word: ? ? ? ? ?</div>
                  </div>
                </div>

                <div className="mb-3 h-44 rounded-[22px] bg-[#fffefb] p-3 shadow-inner">
                  <div className="flex h-full items-center justify-center rounded-[18px] border-2 border-dashed border-brand-purple/40 bg-[linear-gradient(135deg,_rgba(118,87,232,0.05),_rgba(84,214,178,0.05))] text-5xl text-brand-purple/80">
                    ✏️
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {['#111827', '#ff6b6b', '#ffd166', '#54d6b2', '#61b8ff', '#7657e8'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
                        style={{ background: color }}
                        aria-label={`Color ${color}`}
                      />
                    ))}
                  </div>

                  <div className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
                    Draw
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-5 rounded-[24px] border border-brand-purple/10 bg-gradient-to-br from-[#fffaf4] to-[#f9f3ff] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple/70">Guess</span>
                <span className="rounded-full bg-brand-coral/10 px-2 py-1 text-[10px] font-bold text-brand-coral">2 players</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white p-3 text-sm font-medium text-brand-ink/75 shadow-sm">
                  <span>Liam</span>
                  <span className="text-brand-purple">“Is it a cat?”</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#f3effd] p-3 text-sm font-medium text-brand-ink/70">
                  <span>Rina</span>
                  <span>“Maybe a fox?”</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 right-8 flex items-center gap-2 rounded-full border border-brand-purple/10 bg-white px-4 py-2 shadow-soft">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-yellow text-brand-ink">
              <Trophy size={16} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-brand-ink/55">Leader</div>
              <div className="text-sm font-bold text-brand-ink">Alex • 820</div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function HowToPlayPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fffaf4] p-8 text-brand-ink">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-brand-purple/10 bg-white p-8 shadow-soft">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 rounded-full border border-brand-purple/15 px-4 py-2 text-sm font-bold text-brand-purple"
        >
          ← Back
        </button>

        <h1 className="mb-6 text-4xl font-black tracking-tight">How to Play</h1>

        <div className="space-y-5 text-base leading-7 text-brand-ink/75">
          <p><strong>1.</strong> Create or join a room with a short code.</p>
          <p><strong>2.</strong> One player becomes the drawer and gets a hidden word.</p>
          <p><strong>3.</strong> Draw the word as clearly as possible while your friends guess.</p>
          <p><strong>4.</strong> Score points for fast, correct guesses and win the round.</p>
          <p><strong>5.</strong> Repeat until someone becomes the Scribblio champion.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/play')}
          className="mt-8 rounded-full bg-brand-purple px-6 py-3 text-base font-bold text-white shadow-[0_16px_32px_rgba(118,87,232,0.32)]"
        >
          Start Playing
        </button>
      </div>
    </div>
  );
}

function RoomPage() {
  const { roomCode } = useParams();
  const [gameStarted, setGameStarted] = useState(false);

  const players = [
    { name: 'Alex', score: 820, avatar: 'A', isHost: true },
    { name: 'Liam', score: 640, avatar: 'L', isHost: false },
    { name: 'Rina', score: 590, avatar: 'R', isHost: false },
    { name: 'Noah', score: 420, avatar: 'N', isHost: false },
  ];

  const guesses = [
    { user: 'Liam', message: 'Is it a cat?' },
    { user: 'Rina', message: 'Maybe a fox?' },
    { user: 'Noah', message: 'Dog?' },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf4] p-4 text-brand-ink md:p-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-brand-purple/10 bg-white p-4 shadow-[0_20px_60px_rgba(36,22,63,0.10)] md:p-6">
        <header className="mb-6 flex flex-col gap-4 border-b border-brand-purple/10 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-brand-purple/70">Room Code</div>
            <h1 className="mt-1 text-3xl font-black tracking-tight">{roomCode?.toUpperCase() ?? 'DEMO-ROOM'}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-brand-purple/15 bg-white px-4 py-2 text-sm font-bold text-brand-purple"
            >
              Copy Link
            </button>
            <button
              type="button"
              onClick={() => setGameStarted(true)}
              className="rounded-full bg-brand-purple px-5 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(118,87,232,0.25)]"
            >
              {gameStarted ? 'Restart Round' : 'Start Game'}
            </button>
          </div>
        </header>

        {gameStarted ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[28px] border border-brand-purple/10 bg-gradient-to-br from-[#f8f5ff] to-[#f1fbf7] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple/70">Current Drawer</div>
                  <div className="mt-1 text-xl font-black">Alex</div>
                </div>
                <div className="rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-ink">60s</div>
              </div>

              <div className="mb-4 rounded-[24px] bg-white p-3 shadow-inner">
                <div className="mb-3 flex items-center justify-between text-sm font-medium text-brand-ink/70">
                  <span>Secret word</span>
                  <span className="rounded-full bg-brand-purple/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-brand-purple">Hidden</span>
                </div>

                <div className="h-[320px] rounded-[22px] border-2 border-dashed border-brand-purple/30 bg-[linear-gradient(135deg,_rgba(118,87,232,0.06),_rgba(84,214,178,0.06))] p-3">
                  <div className="flex h-full items-center justify-center text-5xl">✏️</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {['#111827', '#ff6b6b', '#ffd166', '#54d6b2', '#61b8ff', '#7657e8', '#ffffff', '#000000'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="h-7 w-7 rounded-full border-2 border-white shadow-sm"
                    style={{ background: color }}
                    aria-label={`Color ${color}`}
                  />
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-brand-purple/10 bg-[#fffaf4] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple/70">Players</span>
                  <span className="rounded-full bg-brand-purple/10 px-2 py-1 text-[10px] font-bold text-brand-purple">{players.length} online</span>
                </div>

                <div className="space-y-3">
                  {players.map((player) => (
                    <div key={player.name} className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-sky text-sm font-black text-white">
                          {player.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-brand-ink">{player.name}</div>
                          {player.isHost && <div className="text-[10px] uppercase tracking-[0.16em] text-brand-purple/70">Host</div>}
                        </div>
                      </div>
                      <span className="text-sm font-black text-brand-ink">{player.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-brand-purple/10 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple/70">Chat</span>
                  <span className="rounded-full bg-brand-coral/10 px-2 py-1 text-[10px] font-bold text-brand-coral">Live</span>
                </div>

                <div className="space-y-3">
                  {guesses.map((guess) => (
                    <div key={`${guess.user}-${guess.message}`} className="rounded-2xl bg-[#f8f5ff] p-3 text-sm">
                      <span className="font-bold text-brand-ink">{guess.user}:</span> <span className="text-brand-ink/75">{guess.message}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your guess..."
                    className="flex-1 rounded-full border border-brand-purple/15 bg-[#f9f5ff] px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-brand-ink/40"
                  />
                  <button type="button" className="rounded-full bg-brand-purple px-4 py-2.5 text-sm font-bold text-white">
                    Send
                  </button>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-brand-purple/20 bg-[#f8f5ff] p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-sky text-2xl text-white shadow-soft">
              🎮
            </div>
            <h2 className="text-2xl font-black text-brand-ink">Waiting for the game to start</h2>
            <p className="mt-3 text-brand-ink/70">Invite your friends, choose a word, and click Start Game when everyone is ready.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
