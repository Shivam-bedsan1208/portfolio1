import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, Check, CheckCircle2, ClipboardList, Code2, FileText, GraduationCap, Menu, MessageCircle, Plus, Send, Sparkles, Terminal, Trash2, X, Zap } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
type Operator = '+' | '−' | '×' | '÷' | null;
type Task = { id: number; title: string; completed: boolean };

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [['about', 'About'], ['skills', 'Skills'], ['projects', 'Projects'], ['contact', 'Contact']];
  return (
    <header className="fixed left-0 right-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
        <a href="#home" className="group flex items-center gap-3" data-testid="link-logo">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-display text-lg font-bold text-secondary-foreground transition-transform group-hover:rotate-12">S.</span>
          <span className="hidden font-mono-custom text-xs uppercase tracking-[.22em] sm:inline">Shivam / web learner</span>
        </a>
        <nav className="hidden items-center gap-8 rounded-full border border-foreground/10 bg-background/80 px-5 py-3 backdrop-blur-lg md:flex" aria-label="Primary navigation">
          {links.map(([id, label]) => <a key={id} href={`#${id}`} className="font-mono-custom text-[11px] uppercase tracking-[.16em] text-muted-foreground transition-colors hover:text-primary" data-testid={`link-nav-${id}`}>{label}</a>)}
          <a href="#contact" className="flex items-center gap-1 font-mono-custom text-[11px] uppercase tracking-[.16em] text-accent" data-testid="link-nav-start">Let's talk <ArrowUpRight size={13} /></a>
        </nav>
        <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 bg-background/80 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-menu">
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && <nav className="mx-5 flex flex-col gap-1 rounded-2xl border border-foreground/10 bg-card p-3 shadow-xl md:hidden" aria-label="Mobile navigation">
        {links.map(([id, label]) => <a onClick={() => setOpen(false)} key={id} href={`#${id}`} className="rounded-xl px-4 py-3 font-mono-custom text-xs uppercase tracking-[.16em] hover:bg-muted" data-testid={`link-mobile-${id}`}>{label}</a>)}
      </nav>}
    </header>
  );
}

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className="mb-7 flex items-center gap-3 font-mono-custom text-[11px] uppercase tracking-[.2em] text-primary"><span>{number}</span><span className="h-px w-9 bg-primary/45" /><span>{children}</span></div>;
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`${className} transition-[opacity,transform] duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>{children}</div>;
}

function Marquee() {
  return <div className="overflow-hidden border-y border-foreground/10 bg-secondary py-3 text-secondary-foreground">
    <div className="flex min-w-max animate-[marquee_24s_linear_infinite] items-center gap-8 font-mono-custom text-[10px] uppercase tracking-[.2em]">
      {Array.from({ length: 2 }).flatMap((_, i) => ['HTML / CSS', 'JavaScript', 'MS Office', 'Curiosity → practice', 'Ambala City'].map((item, j) => <span key={`${i}-${j}`} className="flex items-center gap-8">{item}<span className="text-accent">+</span></span>))}
    </div>
  </div>;
}

function Hero() {
  return <section id="home" className="section-anchor relative overflow-hidden px-5 pb-20 pt-36 lg:px-10 lg:pb-28 lg:pt-48">
    <div className="absolute right-[-10%] top-20 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
    <div className="mx-auto grid max-w-7xl items-end gap-14 lg:grid-cols-[1.15fr_.85fr]">
      <div className="relative z-10">
        <div className="reveal mb-8 flex items-center gap-3">
          <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" /><span className="relative inline-flex h-3 w-3 rounded-full bg-accent" /></span>
          <span className="font-mono-custom text-xs uppercase tracking-[.18em] text-muted-foreground">Currently pursuing CCWM · Hartron Skill Centre</span>
        </div>
        <h1 className="reveal reveal-delay-1 max-w-4xl font-display text-[clamp(3.7rem,10vw,9rem)] font-semibold leading-[.86] tracking-[-.075em]">
          Shivam<span className="text-primary">.</span><br /><span className="text-muted-foreground">makes ideas</span><br /><span className="text-accent">usable.</span>
        </h1>
        <div className="reveal reveal-delay-2 mt-10 flex max-w-xl flex-col gap-7 sm:flex-row sm:items-end">
          <p className="text-balance text-base leading-7 text-muted-foreground">A practical web learner from Ambala City, building a strong foundation in the browser — one thoughtful interface at a time.</p>
          <a href="#projects" className="button-lift flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 font-mono-custom text-[11px] uppercase tracking-[.14em] text-primary-foreground" data-testid="link-hero-projects">See the work <ArrowDownRight size={15} /></a>
        </div>
      </div>
      <div className="reveal reveal-delay-3 relative mx-auto w-full max-w-sm lg:mb-4">
        <div className="line-grid absolute -right-4 -top-5 h-44 w-44 opacity-60" />
        <div className="float-slow relative overflow-hidden rounded-[2rem] border border-secondary/20 bg-secondary p-6 text-secondary-foreground soft-shadow">
          <div className="mb-16 flex items-start justify-between">
            <Terminal size={23} strokeWidth={1.5} className="text-accent" />
            <span className="font-mono-custom text-[10px] uppercase tracking-[.16em] text-secondary-foreground/55">field notes / 01</span>
          </div>
          <div className="font-mono-custom text-sm leading-7">
            <div><span className="text-accent">const</span> learner = <span className="text-primary">new</span> Builder();</div>
            <div className="text-secondary-foreground/60">learner.location = <span className="text-accent">'Ambala City'</span>;</div>
            <div className="mt-3 text-secondary-foreground/60">// keep showing up<span className="cursor-blink text-accent">_</span></div>
          </div>
          <div className="mt-14 flex items-end justify-between">
            <div><div className="font-display text-4xl font-semibold">04</div><div className="mt-1 font-mono-custom text-[10px] uppercase tracking-[.15em] text-secondary-foreground/55">core skills</div></div>
            <div className="grid h-14 w-14 place-items-center rounded-full border border-accent/50 text-accent"><ArrowUpRight size={22} /></div>
          </div>
        </div>
      </div>
    </div>
    <div className="mx-auto mt-24 flex max-w-7xl items-center justify-between font-mono-custom text-[10px] uppercase tracking-[.2em] text-muted-foreground/70"><span>Scroll to explore</span><span className="hidden sm:inline">30.3782° N / 76.7767° E</span><span>01—05</span></div>
  </section>;
}

function About() {
  return <section id="about" className="section-anchor border-t border-foreground/10 px-5 py-24 lg:px-10 lg:py-36">
    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.65fr_1.35fr]">
      <div><SectionLabel number="01" children="A little context" /><div className="hidden font-mono-custom text-7xl text-foreground/10 lg:block">01</div></div>
      <Reveal className="max-w-4xl">
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-.05em] sm:text-6xl">I’m learning by <span className="text-primary">making</span>, not just watching.</h2>
        <div className="mt-10 grid gap-8 text-base leading-8 text-muted-foreground md:grid-cols-[1.1fr_.9fr]">
          <p>My name is Shivam. I’m a CCWM student at Hartron Skill Centre in Ambala City, focused on the practical side of the web: clear structure, useful interactions, and interfaces that feel good to use.</p>
          <p>I’m a graduate of <strong className="font-semibold text-foreground">D.A.V. College, Ambala City</strong>. Right now, I’m turning classroom fundamentals into small, working projects — and using each one to get a little more precise.</p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-foreground/10 bg-card p-5"><GraduationCap size={20} className="mb-9 text-accent" /><div className="font-display text-xl font-semibold">D.A.V. College</div><div className="mt-1 font-mono-custom text-[10px] uppercase tracking-[.15em] text-muted-foreground">Graduate · Ambala City</div></div>
          <div className="rounded-2xl border border-primary/35 bg-primary/10 p-5"><Sparkles size={20} className="mb-9 text-primary" /><div className="font-display text-xl font-semibold">CCWM · In progress</div><div className="mt-1 font-mono-custom text-[10px] uppercase tracking-[.15em] text-muted-foreground">Hartron Skill Centre</div></div>
        </div>
      </Reveal>
    </div>
  </section>;
}

function Skills() {
  const skills = [{ n: '01', name: 'HTML', copy: 'Meaningful structure, accessible pages.', icon: Code2 }, { n: '02', name: 'CSS', copy: 'Layouts with rhythm, contrast and care.', icon: Sparkles }, { n: '03', name: 'JavaScript', copy: 'Interfaces that respond to people.', icon: Zap }, { n: '04', name: 'MS Office', copy: 'Documents, spreadsheets and daily tools.', icon: FileText }];
  return <section id="skills" className="section-anchor bg-secondary px-5 py-24 text-secondary-foreground lg:px-10 lg:py-32">
    <Reveal className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><div className="mb-7 flex items-center gap-3 font-mono-custom text-[11px] uppercase tracking-[.2em] text-primary"><span>02</span><span className="h-px w-9 bg-primary/45" /><span>What I practice</span></div><h2 className="max-w-xl font-display text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-6xl">Small toolkit.<br /><span className="text-accent">Real intent.</span></h2></div><p className="max-w-xs text-sm leading-6 text-secondary-foreground/60">The essentials are powerful when you understand why they matter.</p></div>
      <div className="mt-16 grid border-l border-t border-secondary-foreground/15 sm:grid-cols-2">{skills.map(({ n, name, copy, icon: Icon }) => <div key={name} className="group min-h-56 border-b border-r border-secondary-foreground/15 p-6 transition-colors hover:bg-secondary-foreground/[.05] sm:p-8" data-testid={`card-skill-${name.toLowerCase()}`}><div className="flex items-start justify-between"><span className="font-mono-custom text-xs text-secondary-foreground/40">{n}</span><Icon size={19} strokeWidth={1.5} className="text-primary transition-transform group-hover:rotate-12" /></div><div className="mt-16 font-display text-2xl font-semibold">{name}</div><p className="mt-2 max-w-[220px] text-sm leading-6 text-secondary-foreground/55">{copy}</p></div>)}</div>
    </Reveal>
  </section>;
}

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [fresh, setFresh] = useState(true);
  const calculate = (a: number, b: number, op: Operator) => op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : op === '÷' ? (b === 0 ? NaN : a / b) : b;
  const press = (key: string) => {
    if (key === 'C') { setDisplay('0'); setStored(null); setOperator(null); setFresh(true); return; }
    if (key === '.') { if (!display.includes('.')) setDisplay(display + '.'); setFresh(false); return; }
    if (/^\d$/.test(key)) { setDisplay(fresh || display === '0' ? key : display + key); setFresh(false); return; }
    if (['+', '−', '×', '÷'].includes(key)) { setStored(Number(display)); setOperator(key as Operator); setFresh(true); return; }
    if (key === '=' && operator && stored !== null) { const result = calculate(stored, Number(display), operator); setDisplay(Number.isNaN(result) ? 'Error' : String(Number(result.toFixed(8)))); setStored(null); setOperator(null); setFresh(true); }
  };
  const keys = [['C', '÷'], ['7', '8', '9', '×'], ['4', '5', '6', '−'], ['1', '2', '3', '+'], ['0', '.', '=']];
  return <div className="rounded-[1.6rem] border border-foreground/10 bg-secondary p-4 text-secondary-foreground shadow-[10px_12px_0_hsl(var(--accent)/.4)] sm:p-5" data-testid="project-calculator">
    <div className="mb-3 flex items-center justify-between px-2"><div className="flex gap-1.5"><i className="h-2 w-2 rounded-full bg-accent" /><i className="h-2 w-2 rounded-full bg-primary" /><i className="h-2 w-2 rounded-full bg-secondary-foreground/30" /></div><span className="font-mono-custom text-[9px] uppercase tracking-[.15em] text-secondary-foreground/45">calc / 001</span></div>
    <div className="mb-3 flex h-20 items-end justify-end overflow-hidden rounded-xl bg-secondary-foreground/[.08] px-4 py-3 font-mono-custom text-3xl tracking-[-.06em]" data-testid="text-calculator-display">{display}</div>
    <div className="grid grid-cols-4 gap-2">{keys.flatMap((row, rowIndex) => row.map((key) => <button key={`${rowIndex}-${key}`} type="button" onClick={() => press(key)} className={`${key === '=' ? 'col-span-2 bg-accent text-accent-foreground' : key === 'C' ? 'bg-secondary-foreground/20 text-accent' : ['÷', '×', '−', '+'].includes(key) ? 'bg-primary text-primary-foreground' : 'bg-secondary-foreground/10 text-secondary-foreground hover:bg-secondary-foreground/20'} ${key === '0' ? 'col-span-2' : ''} h-12 rounded-xl font-mono-custom text-sm transition-transform active:scale-95`} data-testid={`button-calculator-${key === '=' ? 'equals' : key === 'C' ? 'clear' : key}`}>{key}</button>))}</div>
  </div>;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(() => { try { return JSON.parse(localStorage.getItem('shivam-tasks') || '[]') as Task[]; } catch { return []; } });
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  useEffect(() => { localStorage.setItem('shivam-tasks', JSON.stringify(tasks)); }, [tasks]);
  const visible = useMemo(() => tasks.filter((task) => filter === 'all' || (filter === 'active' ? !task.completed : task.completed)), [tasks, filter]);
  const addTask = () => { const title = newTask.trim(); if (!title) return; setTasks([{ id: Date.now(), title, completed: false }, ...tasks]); setNewTask(''); };
  return <div className="rounded-[1.6rem] border border-foreground/10 bg-card p-4 shadow-[10px_12px_0_hsl(var(--primary)/.24)] sm:p-5" data-testid="project-task-list">
    <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/20 text-accent"><ClipboardList size={18} /></span><div><div className="font-display font-semibold">A little list</div><div className="font-mono-custom text-[9px] uppercase tracking-[.15em] text-muted-foreground">local / private</div></div></div><span className="font-mono-custom text-xs text-muted-foreground" data-testid="text-task-count">{tasks.filter((t) => !t.completed).length} open</span></div>
    <div className="flex gap-2"><input value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addTask(); }} placeholder="Add a small thing..." className="min-w-0 flex-1 rounded-xl border border-foreground/10 bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-foreground/65 focus:border-primary" aria-label="New task" data-testid="input-new-task" /><button type="button" onClick={addTask} className="grid w-12 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5" aria-label="Add task" data-testid="button-add-task"><Plus size={18} /></button></div>
    <div className="my-5 flex gap-1 rounded-xl bg-muted p-1">{(['all', 'active', 'completed'] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`flex-1 rounded-lg py-2 font-mono-custom text-[9px] uppercase tracking-[.12em] transition-colors ${filter === item ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} data-testid={`button-filter-${item}`}>{item}</button>)}</div>
    <div className="min-h-[168px] space-y-2">{visible.length ? visible.map((task) => <div key={task.id} className="group flex items-center gap-3 rounded-xl border border-foreground/8 px-3 py-3" data-testid={`row-task-${task.id}`}><button type="button" onClick={() => setTasks(tasks.map((t) => t.id === task.id ? { ...t, completed: !t.completed } : t))} className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${task.completed ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/25 hover:border-primary'}`} aria-label={task.completed ? `Mark ${task.title} active` : `Complete ${task.title}`} data-testid={`button-toggle-task-${task.id}`}>{task.completed && <Check size={13} />}</button><span className={`min-w-0 flex-1 truncate text-sm ${task.completed ? 'text-muted-foreground line-through' : ''}`}>{task.title}</span><button type="button" onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))} className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus:opacity-100" aria-label={`Delete ${task.title}`} data-testid={`button-delete-task-${task.id}`}><Trash2 size={15} /></button></div>) : <div className="flex min-h-[168px] flex-col items-center justify-center text-center text-muted-foreground"><CheckCircle2 size={23} className="mb-2 text-primary/70" /><p className="text-sm">{tasks.length ? 'Nothing in this view.' : 'Your list is clear.'}</p><p className="mt-1 font-mono-custom text-[9px] uppercase tracking-[.1em] text-muted-foreground/70">Add something to begin</p></div>}</div>
  </div>;
}

function Projects() {
  return <section id="projects" className="section-anchor px-5 py-24 lg:px-10 lg:py-36">
    <Reveal className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]"><div><SectionLabel number="03" children="Built in the browser" /><p className="max-w-xs text-sm leading-7 text-muted-foreground">Two small experiments. Both are live, interactive, and made to be clicked.</p></div><div><h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1] tracking-[-.05em] sm:text-6xl">Proof over <span className="text-accent">promises.</span></h2><div className="mt-12 grid gap-7 xl:grid-cols-2"><div><Calculator /><div className="mt-5 flex items-start justify-between"><div><h3 className="font-display text-xl font-semibold">Pocket calculator</h3><p className="mt-1 text-sm text-muted-foreground">Numbers, operators, no nonsense.</p></div><span className="font-mono-custom text-[10px] text-primary">01 / 02</span></div></div><div><TaskList /><div className="mt-5 flex items-start justify-between"><div><h3 className="font-display text-xl font-semibold">A little list</h3><p className="mt-1 text-sm text-muted-foreground">Tasks that stay after the tab closes.</p></div><span className="font-mono-custom text-[10px] text-primary">02 / 02</span></div></div></div></div></div></Reveal>
  </section>;
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [sent, setSent] = useState(false);
  const update = (key: keyof typeof form, value: string) => { setForm({ ...form, [key]: value }); if (errors[key]) setErrors({ ...errors, [key]: '' }); };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<typeof form> = {};
    if (!form.name.trim()) next.name = 'Please add your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please use a valid email.';
    if (!form.message.trim()) next.message = 'A short message helps.';
    if (Object.keys(next).length) { setErrors(next); setSent(false); return; }
    const text = `Hi Shivam,\n\nMy name is ${form.name.trim()} (${form.email.trim()}).\n\n${form.message.trim()}\n\nSent from your portfolio.`;
    window.open(`https://wa.me/917404966210?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return <section id="contact" className="section-anchor bg-accent px-5 py-24 lg:px-10 lg:py-32">
    <Reveal className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.8fr_1.2fr]">
      <div><div className="mb-7 flex items-center gap-3 font-mono-custom text-[11px] uppercase tracking-[.2em] text-accent-foreground/65"><span>04</span><span className="h-px w-9 bg-accent-foreground/35" /><span>Open channel</span></div><h2 className="font-display text-5xl font-semibold leading-[.92] tracking-[-.06em] sm:text-7xl">Have a<br /><span className="text-primary-foreground">good question?</span></h2><p className="mt-8 max-w-sm text-base leading-7 text-accent-foreground/70">Whether it’s an opportunity, a project idea, or just a hello from the web — send it over.</p><div className="mt-10 flex items-center gap-3 font-mono-custom text-xs uppercase tracking-[.14em] text-accent-foreground/70"><MessageCircle size={17} /> WhatsApp · +91 74049 66210</div></div>
      <form onSubmit={submit} className="rounded-[1.7rem] border border-accent-foreground/15 bg-accent-foreground/[.07] p-5 sm:p-8" noValidate>
        {sent && <div className="mb-6 flex gap-3 rounded-xl border border-primary/30 bg-primary/15 p-4 text-sm text-accent-foreground" role="status" data-testid="status-contact-success"><CheckCircle2 className="shrink-0 text-primary" size={19} /><div><strong className="font-semibold">Message prepared.</strong><br /><span className="text-accent-foreground/70">WhatsApp should be open in a new tab. Shivam will have your note there.</span></div></div>}
        <div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="mb-2 block font-mono-custom text-[10px] uppercase tracking-[.15em] text-accent-foreground/65">Your name</span><input value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full border-b border-accent-foreground/25 bg-transparent px-0 py-3 text-base outline-none placeholder:text-accent-foreground/35 focus:border-accent-foreground" placeholder="What should Shivam call you?" data-testid="input-contact-name" />{errors.name && <span className="mt-2 block text-xs text-destructive">{errors.name}</span>}</label><label className="block"><span className="mb-2 block font-mono-custom text-[10px] uppercase tracking-[.15em] text-accent-foreground/65">Email address</span><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full border-b border-accent-foreground/25 bg-transparent px-0 py-3 text-base outline-none placeholder:text-accent-foreground/35 focus:border-accent-foreground" placeholder="you@somewhere.com" data-testid="input-contact-email" />{errors.email && <span className="mt-2 block text-xs text-destructive">{errors.email}</span>}</label></div>
        <label className="mt-7 block"><span className="mb-2 block font-mono-custom text-[10px] uppercase tracking-[.15em] text-accent-foreground/65">Your message</span><textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={4} className="w-full resize-none border-b border-accent-foreground/25 bg-transparent px-0 py-3 text-base outline-none placeholder:text-accent-foreground/35 focus:border-accent-foreground" placeholder="Tell me what you're thinking..." data-testid="input-contact-message" />{errors.message && <span className="mt-2 block text-xs text-destructive">{errors.message}</span>}</label>
        <button type="submit" className="button-lift mt-8 flex items-center gap-3 rounded-full bg-secondary px-6 py-4 font-mono-custom text-[11px] uppercase tracking-[.15em] text-secondary-foreground" data-testid="button-contact-submit">Prepare WhatsApp note <Send size={16} /></button>
        <p className="mt-4 font-mono-custom text-[9px] uppercase tracking-[.1em] text-accent-foreground/55">Opens WhatsApp in a new tab · no data is stored here</p>
      </form>
    </Reveal>
  </section>;
}

function Footer() {
  return <footer className="bg-secondary px-5 py-8 text-secondary-foreground lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="font-display text-lg font-semibold">Shivam<span className="text-accent">.</span></div><p className="font-mono-custom text-[10px] uppercase tracking-[.15em] text-secondary-foreground/50">Made with practice · Ambala City</p><a href="#contact" className="flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-[.15em] text-secondary-foreground/60 transition-colors hover:text-accent" aria-label="Open contact form" data-testid="link-footer-contact"><MessageCircle size={16} /> Start a conversation</a></div></footer>;
}

function Home() {
  return <div className="site-shell grain min-h-[100dvh]"><Nav /><main><Hero /><Marquee /><About /><Skills /><Projects /><Contact /></main><Footer /></div>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary><Router /></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;