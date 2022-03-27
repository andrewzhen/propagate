import Garden from "./Garden"
import Footer from "./Footer"

const Sidebar = ({sidebarView, setSidebarView, name, shovelActive, setShovelActive}) => {
  return (
    <main>
      <div className="sidebar">
        {sidebarView === 'garden' && <Garden setSidebarView={setSidebarView} name={name} shovelActive={shovelActive} setShovelActive={setShovelActive} />}

        <Footer />
      </div>
    </main>
  )
};

export default Sidebar;