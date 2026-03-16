import { useState } from 'react';

import CategoryManagement from '../components/CategoryManagement';
import QuestionManagement from '../components/QuestionManagement';
import './AdminPage.css';

const TABS = ['Categorieën', 'Vragen'];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin</h1>

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`admin-tab${activeTab === tab ? ' admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Categorieën' && <CategoryManagement />}
      {activeTab === 'Vragen' && <QuestionManagement />}
    </div>
  );
};

export default AdminPage;
