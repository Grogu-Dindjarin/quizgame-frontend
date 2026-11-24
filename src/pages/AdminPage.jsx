import { useState } from 'react';

import CategoryManagement from '../components/CategoryManagement';
import QuestionManagement from '../components/QuestionManagement';
import SubcategoryManagement from '../components/SubcategoryManagement';
import './AdminPage.css';

const TABS = ['Categorieën', 'Subcategorieën', 'Vragen'];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="admin-page">
      <div className="adm-hd">
        <h1 className="adm-title">Beheer</h1>
        <div className="adm-pill-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`adm-pill-tab${activeTab === tab ? ' adm-pill-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-scroll">
        {activeTab === 'Categorieën' && <CategoryManagement />}
        {activeTab === 'Subcategorieën' && <SubcategoryManagement />}
        {activeTab === 'Vragen' && <QuestionManagement />}
      </div>
    </div>
  );
};

export default AdminPage;
