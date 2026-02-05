import './AdminPage.css';

const AdminPage = () => {
  const categories = [
    'Aardrijkskunde',
    'Geschiedenis',
    'Biologie',
    'Wiskunde',
    'Natuurkunde',
  ];

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin</h1>
      <section className="admin-section">
        <h2 className="admin-section__heading">Categorieën</h2>
        <ul className="admin-list">
          {categories.map((name) => (
            <li key={name} className="admin-list__item">
              <span className="admin-list__name">{name}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;
