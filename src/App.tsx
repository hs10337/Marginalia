import { Outlet } from 'react-router-dom';
import PhoneFrame from './components/PhoneFrame';
import TabBar from './components/TabBar';

export default function App() {
  return (
    <PhoneFrame>
      <div className="flex-1 min-h-0 w-full flex flex-col paper">
        <main className="phone-scroll flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
        <TabBar />
      </div>
    </PhoneFrame>
  );
}
