import './DashboardPage.css';

const DashboardPage = () => (
  <div className="dashboard">
    <header className="dashboard-header">
      <h1>Dashboard</h1>
    </header>
    <main className="dashboard-main">
      <section className="dashboard-categories">
        <h2>Categorieën</h2>
        <ul>
          <li>Aardrijkskunde</li>
          <li>Geschiedenis</li>
          <li>Wetenschap</li>
        </ul>
      </section>
    </main>
  </div>
);

export default DashboardPage;
