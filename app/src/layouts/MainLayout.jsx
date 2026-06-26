import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Header from "../components/ui/Header/Header";
import Footer from "../components/ui/Footer/Footer";

/**
 * MainLayout Component
 * Default site layout with header, navigation, and footer
 */
export function MainLayout({
  title,
  description,
  children,
  breadcrumbRight,
  headerRight,
  bare = false,
}) {
  return (
    <>
    <Header/>
      <nav className="navigation">
        <div className="elc-container">
          <div className="menu-container">
            <ul>
              <li>
                <Link to="/" target="_blank" rel="noopener noreferrer">होम पेज</Link>
              </li>
              <li>
                <Link to="/candidates" target="_blank" rel="noopener noreferrer">उम्मेदवारहरु</Link>
              </li>
              <li>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  निर्वाचन <ChevronDown size={18} />
                </a>
                <ul>
                  <li>
                    <Link to="/province/koshi" target="_blank" rel="noopener noreferrer">कोशी प्रदेश</Link>
                  </li>
                  <li>
                    <Link to="/province/madhesh" target="_blank" rel="noopener noreferrer">मधेस प्रदेश</Link>
                  </li>
                  <li>
                    <Link to="/province/bagmati" target="_blank" rel="noopener noreferrer">बागमती प्रदेश</Link>
                  </li>
                  <li>
                    <Link to="/province/gandaki" target="_blank" rel="noopener noreferrer">गण्डकी प्रदेश</Link>
                  </li>
                  <li>
                    <Link to="/province/lumbini" target="_blank" rel="noopener noreferrer">लुम्बिनी प्रदेश</Link>
                  </li>
                  <li>
                    <Link to="/province/karnali" target="_blank" rel="noopener noreferrer">कर्णाली प्रदेश</Link>
                  </li>
                  <li>
                    <Link to="/province/sudurpaschim" target="_blank" rel="noopener noreferrer">सुदूरपश्चिम प्रदेश</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/parties" target="_blank" rel="noopener noreferrer">राजनीतिक दल</Link>
              </li>
              <li>
                <Link to="/hot-seats" target="_blank" rel="noopener noreferrer">हट सिटहरु</Link>
              </li>
              <li>
                <Link to="/vote-difference" target="_blank" rel="noopener noreferrer">मतान्तर</Link>
              </li>
              <li>
                <Link to="/popular-candidates" target="_blank" rel="noopener noreferrer">चर्चित उम्मेदवारहरु</Link>
              </li>
              <li>
                <Link to="/manifesto" target="_blank" rel="noopener noreferrer">घोषणा पत्र</Link>
              </li>
            </ul>
            <div className="nav-right">
              <span className="btn-search fa fa-search btn-trigger"></span>
              <a
                className="button"
                href="https://www.jointwithus.com.np/"
                target="_blank"
                rel="noreferrer noopener"
              >
                जोइन्ट विथ अस होमपेज
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="black-overlay"></div>
      <div className="full-banner-adv">
        <div
          className="elc-container el-placeholder"
          data-position="election-below-navbar"
        ></div>
      </div>

      {bare ? (
        children
      ) : (
        <div className="elec-content-wrap">
          <section className="section section-candidates section-bottom">
            <div className="elc-container">
              <div className="backward flex flex-wrap flex-between flex-middle">
                <div className="breadcrumb">
                  <Link to="/" target="_blank" rel="noopener noreferrer">प्रतिनिधि सभा निर्वाचन २०८२</Link>
                  <span className="sep">/</span>
                  <span>{title}</span>
                </div>
                {breadcrumbRight}
              </div>
              <div className="page-header flex flex-between flex-middle flex-wrap">
                <div>
                  <h3 className="page-title">{title}</h3>
                  {description ? <p>{description}</p> : null}
                </div>
                {headerRight}
              </div>
              {children}
            </div>
          </section>
        </div>
      )}
      <Footer />
    </>
  );
}

export default MainLayout;
