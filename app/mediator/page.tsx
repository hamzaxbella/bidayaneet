import Image from 'next/image';
import PlatformSwitcher from '@/components/PlatformSwitcher';
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileText,
  Home,
  House,
  MapPin,
  MessageCircle,
  Play,
  Search,
  Settings,
  ShieldCheck,
  Star,
  User,
  UserRound,
} from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/mediator', icon: Home, active: true },
  { label: 'Mes opportunités', href: '/mediator/opportunities', icon: Settings },
  { label: 'Histoires inspirantes', href: '/mediator/stories', icon: Star },
  { label: 'Mon parcours', href: '/mediator/journey', icon: ClipboardList },
  { label: 'Micro-actions', href: '/mediator/micro-actions', icon: ShieldCheck },
  { label: 'Messages', href: '/mediator/messages', icon: MessageCircle, count: 3 },
  { label: 'Mon profil', href: '/mediator/profile', icon: UserRound },
  { label: 'Aide', href: '/mediator/help', icon: CircleHelp },
];

const opportunities = [
  {
    tag: 'Formation',
    match: '92%',
    title: 'Développement Web Full Stack',
    org: 'GOMYCODE',
    place: 'Agadir',
    desc: 'Formation intensive de 6 mois avec certification et stage inclus.',
    cta: 'Voir les détails',
    image: '/user-portal/opp-web-dev.jpg',
    tone: '#00B8A9',
  },
  {
    tag: 'Stage',
    match: '88%',
    title: 'Stage Marketing Digital',
    org: 'StartUp Maroc',
    place: 'Casablanca',
    desc: 'Stage de 3 mois pour renforcer vos compétences en marketing digital.',
    cta: 'Postuler maintenant',
    image: '/user-portal/opp-marketing.jpg',
    tone: '#2E86C1',
  },
  {
    tag: 'Emploi',
    match: '85%',
    title: 'Conseiller Client',
    org: 'Marjane',
    place: 'Agadir',
    desc: 'Poste en CDI avec opportunités d’évolution et accompagnement.',
    cta: "Voir l'offre",
    image: '/user-portal/opp-retail.jpg',
    tone: '#FF6B2C',
  },
  {
    tag: 'Programme',
    match: '82%',
    title: 'Programme Injaz - Entreprendre',
    org: 'INJAZH Maroc',
    place: 'En ligne',
    desc: 'Accompagnement pour lancer votre projet entrepreneurial.',
    cta: 'En savoir plus',
    image: '/user-portal/opp-entrepreneur.jpg',
    tone: '#8E44AD',
  },
];

const stories = [
  { name: 'Salma E.', role: 'Développeuse Web', time: '01:12', image: '/user-portal/story-salma.jpg' },
  { name: 'Omar T.', role: 'Fondateur - StartUp', time: '00:58', image: '/user-portal/story-omar.jpg' },
  { name: 'Fatima Z.', role: 'Assistante RH', time: '01:05', image: '/user-portal/story-fatima.jpg' },
  { name: 'Youssef M.', role: 'Technicien Maintenance', time: '00:45', image: '/user-portal/story-youssef.jpg' },
  { name: 'Amina K.', role: 'Community Manager', time: '01:00', image: '/user-portal/story-amina.jpg' },
  { name: 'Khalid B.', role: 'Entrepreneur', time: '00:50', image: '/user-portal/story-khalid.jpg' },
];

const nextActions = [
  { icon: User, title: 'Complète ton profil', note: 'Ajoute tes compétences et expériences.', status: '75%', action: 'Continuer', color: '#00B8A9' },
  { icon: FileText, title: "Assiste à la session d'orientation", note: 'Mercredi 21 mai à 15h00', status: 'Bientôt', action: 'Voir détails', color: '#F5A623' },
  { icon: CalendarDays, title: 'Confirme ton entretien', note: 'Entretien avec Marjane', status: 'À faire', action: 'Confirmer', color: '#FF6B2C' },
  { icon: Play, title: 'Regarde la formation recommandée', note: 'Marketing digital - 15 min', status: 'Nouveau', action: 'Regarder', color: '#2E86C1' },
  { icon: ClipboardList, title: 'Téléverse ton CV', note: 'Ajoute ton CV pour plus d’opportunités', status: 'À faire', action: 'Téléverser', color: '#00B8A9' },
];

const microActions = [
  { icon: CalendarDays, title: 'Atelier CV', date: 'Mer. 21 mai', meta: '10h00 - 12h00', cta: "S'inscrire", color: '#00B8A9' },
  { icon: User, title: 'Journée recrutement', date: 'Ven. 23 mai', meta: 'Casablanca', cta: 'Participer', color: '#2E86C1' },
  { icon: FileText, title: 'Révision CV', date: 'En ligne', meta: '15 min', cta: 'Commencer', color: '#FF6B2C' },
  { icon: House, title: 'Visite à domicile', date: 'Sam. 24 mai', meta: 'À confirmer', cta: 'Demander', color: '#00B8A9' },
];

const notifications = [
  { icon: BriefcaseBusiness, title: 'Nouvelle opportunité pour toi !', note: 'Stage Marketing Digital chez StartUp Maroc.', time: '2h', color: '#00B8A9' },
  { icon: Bell, title: "Rappel : session d'orientation", note: 'N’oublie pas notre session mercredi à 15h00.', time: '1j', color: '#FF6B2C' },
  { icon: Star, title: 'Félicitations !', note: 'Ton profil est 78% complété. Continue comme ça !', time: '2j', color: '#F5A623' },
];

function Sidebar() {
  return (
    <aside className="portal-sidebar">
      <div>
        <div className="portal-logo">
          <PlatformSwitcher width={148} height={78} />
        </div>
        <nav className="portal-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.label} href={item.href} className={`portal-nav-item ${item.active ? 'active' : ''}`}>
                <Icon size={18} />
                <span>{item.label}</span>
                {item.count ? <strong>{item.count}</strong> : null}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="portal-sidebar-bottom">
        <div className="user-chip">
          <Image src="/user-portal/story-khalid.jpg" alt="Yassine El Amrani" width={42} height={42} />
          <div>
            <b>Yassine El Amrani</b>
            <span>NEET</span>
          </div>
          <ChevronRight size={15} />
        </div>
        <div className="help-card">
          <Image src="/user-portal/mountain-progress.jpg" alt="" width={94} height={50} />
          <b>Besoin d’aide ?</b>
          <p>Parle à un membre de notre équipe.</p>
          <a href="/mediator/help">Centre d’aide <ChevronRight size={14} /></a>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="portal-topbar">
      <div>
        <h1>Bonjour Yassine <span>👋</span></h1>
        <p>Voici les meilleures opportunités et prochaines étapes pour toi.</p>
      </div>
      <div className="portal-search">
        <Search size={18} />
        <input placeholder="Rechercher des opportunités, programmes..." />
      </div>
      <button className="icon-bell" title="Notifications">
        <Bell size={20} />
        <span>3</span>
      </button>
    </header>
  );
}

function ProfileCard() {
  return (
    <section className="portal-card profile-card">
      <div className="profile-main">
        <div className="avatar-ring">
          <Image src="/user-portal/story-khalid.jpg" alt="Yassine El Amrani" width={118} height={118} />
        </div>
        <div className="profile-copy">
          <div className="profile-status">
            <b>Statut actuel</b>
            <span>● Activé</span>
          </div>
          <p>Ton parcours progresse, continue ainsi !</p>
          <div className="progress-line"><i style={{ width: '78%' }} /></div>
          <small>78% complété</small>
        </div>
      </div>
      <div className="profile-stats">
        {[
          ['12', 'Opportunités explorées'],
          ['4', 'Candidatures envoyées'],
          ['2', 'Entretiens planifiés'],
          ['1', 'Étape complétée'],
        ].map(([value, label]) => (
          <div key={label}>
            <Check size={17} />
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AssistantCard() {
  return (
    <section className="portal-card assistant-card">
      <b>Bidaya Assistant</b>
      <div>
        <Image src="/user-portal/assistant-bot.jpg" alt="Bidaya Assistant" width={96} height={86} />
        <p>Besoin d’aide ou d’un conseil personnalisé ? Je suis là pour toi.</p>
      </div>
      <button>Chat maintenant <MessageCircle size={16} /></button>
    </section>
  );
}

function QuoteCard() {
  return (
    <section className="portal-card quote-card">
      <blockquote>“Chaque petit pas aujourd’hui te rapproche de ton avenir.”</blockquote>
      <p>Reste motivé, on croit en toi !</p>
      <Image src="/user-portal/mountain-progress.jpg" alt="Progression vers un objectif" width={220} height={140} />
    </section>
  );
}

function SectionHeader({ title, subtitle, href = '#' }: { title: string; subtitle: string; href?: string }) {
  return (
    <div className="portal-section-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <a href={href}>Voir toutes</a>
    </div>
  );
}

function Opportunities() {
  return (
    <section className="portal-panel">
      <SectionHeader title="Opportunités pour toi" subtitle="Sélectionnées en fonction de ton profil et de tes intérêts" href="/mediator/opportunities" />
      <div className="opportunity-row">
        {opportunities.map((item) => (
          <article key={item.title} className="opportunity-card">
            <div className="opportunity-image">
              <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 25vw" />
              <span style={{ borderColor: item.tone, color: item.tone }}>{item.match}</span>
            </div>
            <div className="opportunity-body">
              <small style={{ color: item.tone, backgroundColor: `${item.tone}12` }}>{item.tag}</small>
              <h3>{item.title}</h3>
              <div className="meta"><span>{item.org}</span><span><MapPin size={12} />{item.place}</span></div>
              <p>{item.desc}</p>
              <button>{item.cta}</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Stories() {
  return (
    <section className="portal-panel">
      <SectionHeader title="Histoires inspirantes" subtitle="Des jeunes comme toi qui ont changé leur avenir" href="/mediator/stories" />
      <div className="story-shell">
        <button className="round-arrow"><ChevronLeft size={18} /></button>
        <div className="story-row">
          {stories.map((story) => (
            <article key={story.name} className="story-card">
              <Image src={story.image} alt={story.name} fill sizes="160px" />
              <span>{story.time}</span>
              <button title={`Lire ${story.name}`}><Play size={22} fill="white" /></button>
              <div>
                <b>{story.name}</b>
                <small>{story.role}</small>
              </div>
            </article>
          ))}
        </div>
        <button className="round-arrow"><ChevronRight size={18} /></button>
      </div>
    </section>
  );
}

function NextActions() {
  return (
    <section className="portal-card task-card">
      <SectionHeader title="Tes prochaines actions" subtitle="" href="/mediator/journey" />
      <div className="task-list">
        {nextActions.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="task-item">
              <span style={{ color: item.color, backgroundColor: `${item.color}12` }}><Icon size={17} /></span>
              <div>
                <b>{item.title}</b>
                <small>{item.note}</small>
              </div>
              <em>{item.status}</em>
              <button>{item.action}</button>
            </div>
          );
        })}
      </div>
      <a className="wide-link" href="/mediator/journey">Voir toutes mes actions</a>
    </section>
  );
}

function Journey() {
  const steps = ['Identifié', 'Activé', 'Classé', 'Intégré', 'Stabilisé'];
  return (
    <section className="portal-card journey-card">
      <h2>Ton parcours</h2>
      <p>Ton évolution vers l’intégration professionnelle</p>
      <div className="journey-line">
        {steps.map((step, index) => (
          <div key={step} className={index < 4 ? 'done' : ''}>
            <span>{index < 4 ? <Check size={17} /> : <Settings size={17} />}</span>
            <b>{step}</b>
          </div>
        ))}
      </div>
      <div className="journey-summary">
        <div>
          <b>Étape actuelle : Intégré</b>
          <p>Tu renforces tes compétences et tu te prépares pour ton intégration durable.</p>
        </div>
        <strong>78% <span>du parcours complété</span></strong>
      </div>
    </section>
  );
}

function MicroActions() {
  return (
    <section className="portal-card micro-card">
      <SectionHeader title="Micro-actions cette semaine" subtitle="Petites actions, grands impacts" href="/mediator/micro-actions" />
      <div className="micro-grid">
        {microActions.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title}>
              <span style={{ color: item.color, backgroundColor: `${item.color}12` }}><Icon size={20} /></span>
              <b>{item.title}</b>
              <small>{item.date}</small>
              <p>{item.meta}</p>
              <button>{item.cta}</button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Notifications() {
  return (
    <section className="portal-card notif-card">
      <SectionHeader title="Messages & notifications" subtitle="" href="/mediator/messages" />
      {notifications.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="notification-item">
            <span style={{ color: item.color, backgroundColor: `${item.color}12` }}><Icon size={20} /></span>
            <div>
              <b>{item.title}</b>
              <p>{item.note}</p>
            </div>
            <time>{item.time}</time>
          </div>
        );
      })}
    </section>
  );
}

function Mediator() {
  return (
    <section className="portal-card mediator-card">
      <SectionHeader title="Ton médiateur" subtitle="" href="/mediator/profile" />
      <div className="mediator-body">
        <Image src="/user-portal/story-khalid.jpg" alt="Imane R." width={74} height={74} />
        <div>
          <h3>Imane R.</h3>
          <b>Médiateur</b>
          <span><MapPin size={13} /> Agadir</span>
          <em>● En ligne</em>
        </div>
        <p>Je suis là pour t’accompagner à chaque étape de ton parcours. N’hésite pas à me contacter !</p>
      </div>
      <div className="mediator-actions">
        <button>Envoyer un message</button>
        <button>Prendre rendez-vous</button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="portal-footer">
      <div><Image src="/logo.png" alt="BidayaNeet" width={90} height={34} /> <span>© 2025</span></div>
      <span>Linking Youth to Programs and Work</span>
      <div><a href="/mediator/help">Privacy Policy</a><span>•</span><a href="/mediator/help">Terms of Service</a></div>
    </footer>
  );
}

export default function UserPortalPage() {
  return (
    <div className="portal-page">
      <Sidebar />
      <main className="portal-main">
        <Topbar />
        <div className="hero-grid">
          <ProfileCard />
          <AssistantCard />
          <QuoteCard />
        </div>
        <Opportunities />
        <Stories />
        <div className="lower-grid">
          <NextActions />
          <div className="right-stack">
            <Journey />
            <MicroActions />
          </div>
        </div>
        <div className="lower-grid">
          <Notifications />
          <Mediator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
