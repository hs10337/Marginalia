import { NavLink } from 'react-router-dom';
import { Inbox, MessageCircle, Users, Sun } from 'lucide-react';

const tabs = [
  { to: '/brief', label: 'Brief', icon: Sun },
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/people', label: 'People', icon: Users },
];

export default function TabBar() {
  return (
    <nav
      className="
        relative z-20 shrink-0
        bg-gradient-to-b from-cream-100/85 to-cream-200/95
        backdrop-blur-md
        border-t hairline
      "
    >
      <ul className="flex items-stretch justify-around px-2 pt-2 pb-5">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center gap-0.5 py-1 rounded-xl transition',
                  isActive ? 'text-ink-900' : 'text-ink-500/80 hover:text-ink-700',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
                  <span
                    className={[
                      'text-[10.5px] tracking-wide',
                      isActive ? 'font-semibold' : 'font-medium',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
