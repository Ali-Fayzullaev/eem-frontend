import { NavLink } from "react-router-dom";
import { useState } from "react";

function Home() {
  // State variables
  const [searchLocation, setSearchLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");

  return (
    <div className="App">
      {/* Header */}
      <header className="bg-primary text-white py-3 shadow sticky-top">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <NavLink to="/" className="navbar-brand text-white fw-bold fs-3">
              <i className="bi bi-calendar-event me-2"></i>
              Event<span className="text-warning">Hub</span>
            </NavLink>
            <div className="d-flex gap-3">
              <NavLink
                to="/login"
                className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center"
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>Кіру
              </NavLink>
              <NavLink
                to="/signup"
                className="btn btn-light rounded-pill px-4 d-flex align-items-center"
              >
                <i className="bi bi-person-plus me-2"></i>Тіркелу
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="hero-section vh-100 d-flex align-items-center justify-content-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInDown">
            Іс-шараларды <span className="text-warning">ұйымдастырыңыз</span>
          </h1>
          <p className="lead fs-4 mb-5">
            Бізбен бірге ерекше іс-шаралар жасаңыз, табыңыз және қатысыңыз!
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <NavLink
              to="/login"
              className="btn btn-primary btn-lg rounded-pill px-5 d-flex align-items-center justify-content-center mx-auto mx-sm-0"
            >
              <i className="bi bi-plus-circle me-2"></i>Іс-шара құру
            </NavLink>
            <NavLink
              to="/login"
              className="btn btn-outline-light btn-lg rounded-pill px-5 d-flex align-items-center justify-content-center mx-auto mx-sm-0"
            >
              <i className="bi bi-search me-2"></i>Іздеу
            </NavLink>
          </div>
        </div>
        <a
          href="#events"
          className="position-absolute bottom-0 mb-4 text-white fs-1 animate-bounce"
        >
          <i className="bi bi-chevron-down"></i>
        </a>
      </section>

      {/* Search Section */}
      <section id="events" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">
            <span className="border-bottom border-3 border-primary pb-2">
              Іс-шараларды іздеу
            </span>
          </h2>
          <div className="row justify-content-center">
            <div className="col-md-5 mb-3">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-tag-fill text-primary"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 py-3"
                  placeholder="Санат бойынша іздеу..."
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-5 mb-3">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-geo-alt-fill text-primary"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 py-3"
                  placeholder="Орналасқан жері бойынша іздеу..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="col-10 col-md-2 mb-3 d-grid">
              <button className="btn btn-primary py-3 rounded">
                <i className="bi bi-search me-2"></i>Іздеу
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">
            <span className="border-bottom border-3 border-primary pb-2">
              Танымал іс-шаралар
            </span>
          </h2>
          <div className="row g-4">
            {/* Event 1 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 hover-shadow transition">
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    className="card-img-top"
                    alt="Концерт"
                  />
                  <div className="position-absolute top-0 end-0 bg-warning text-dark m-2 px-3 py-1 rounded-pill small fw-bold">
                    <i className="bi bi-star-fill me-1"></i>Танымал
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <h5 className="card-title fw-bold">Музыкалық фестиваль</h5>
                    <span className="badge bg-primary">Концерт</span>
                  </div>
                  <p className="card-text text-muted">
                    <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                    Алматы, 15 қараша
                  </p>
                  <p className="card-text mt-3">
                    Қазақстандық және шетелдік әншілердің қатысуымен өтетін
                    жылдық музыкалық фестиваль.
                  </p>
                </div>
                <div className="card-footer bg-white border-0">
                <a
                    href="login"
                    className="link-offset-2 text-white link-underline link-underline-opacity-0"
                  >
                    <button className="btn btn-primary w-100 py-2">
                      <i className="bi bi-ticket-perforated me-2"></i>
                      Қосылу
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Event 2 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 hover-shadow transition">
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    className="card-img-top"
                    alt="Бизнес форумы"
                  />
                  <div className="position-absolute top-0 end-0 bg-info text-white m-2 px-3 py-1 rounded-pill small fw-bold">
                    <i className="bi bi-lightning-fill me-1"></i>Жаңа
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <h5 className="card-title fw-bold">Бизнес форумы</h5>
                    <span className="badge bg-success">Бизнес</span>
                  </div>
                  <p className="card-text text-muted">
                    <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                    Нұр-Сұлтан, 20 қараша
                  </p>
                  <p className="card-text mt-3">
                    Кәсіпкерлерге арналған бизнес форумы, ведущий эксперттердің
                    семинарларымен.
                  </p>
                </div>
                <div className="card-footer bg-white border-0">
                  <a
                    href="login"
                    className="link-offset-2 text-white link-underline link-underline-opacity-0"
                  >
                    <button className="btn btn-primary w-100 py-2">
                      <i className="bi bi-ticket-perforated me-2"></i>
                      Қосылу
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Event 3 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 hover-shadow transition">
                <img
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.indy100.com%2Fmedia-library%2Fthousand-of-runners-are-taking-part-in-the-london-marathon-james-manning-pa.jpg%3Fid%3D31852633%26width%3D980%26quality%3D85&f=1&nofb=1&ipt=b1e4dd237b8488712e2d4f1f9533c30bc383530117334a36b0d6436f15eb3b97"
                  className="card-img-top"
                  alt="Спорттық жарыс"
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <h5 className="card-title fw-bold">Спорттық жарыс</h5>
                    <span className="badge bg-danger">Спорт</span>
                  </div>
                  <p className="card-text text-muted">
                    <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                    Шымкент, 5 желтоқсан
                  </p>
                  <p className="card-text mt-3">
                    Қалалық марафон, барлық жастағы адамдарға арналған.
                    Жеңімпаздарға жүлделер!
                  </p>
                </div>
                <div className="card-footer bg-white border-0">
                <a
                    href="login"
                    className="link-offset-2 text-white link-underline link-underline-opacity-0"
                  >
                    <button className="btn btn-primary w-100 py-2">
                      <i className="bi bi-ticket-perforated me-2"></i>
                      Қосылу
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <button className="btn btn-primary px-4 py-2">
              <a
                href="login"
                className="link-offset-2 text-white link-underline link-underline-opacity-0"
              >
                {" "}
                Барлық іс-шараларды көру{" "}
                <i className="bi bi-arrow-right ms-2"></i>
              </a>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <i className="bi bi-calendar-event me-2 text-primary"></i>
                EventHub
              </h5>
              <p className="small ">
                Іс-шараларды ұйымдастыруға және табуға арналған №1 платформа.
              </p>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3">Байланыс</h5>
              <ul className="list-unstyled small ">
                <li className="mb-2">
                  <i className="bi bi-envelope me-2 text-primary"></i>
                  info@eventhub.kz
                </li>
                <li className="mb-2">
                  <i className="bi bi-telephone me-2 text-primary"></i> +7 (775)
                  110-18-00
                </li>
                <li>
                  <i className="bi bi-geo-alt me-2 text-primary"></i> Астсна,
                  Қазақстан
                </li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="fw-bold mb-3">Әлеуметтік желілер</h5>
              <div className="d-flex gap-3">
                <a href="#" className="text-white fs-4">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-white fs-4">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-white fs-4">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="text-white fs-4">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
              <div className="mt-4">
                <h6 className="fw-bold mb-2">Қосымшаны жүктеп алу</h6>
                <div className="d-flex gap-2">
                  <a href="#" className="btn btn-sm btn-outline-light">
                    <i className="bi bi-apple me-1"></i> App Store
                  </a>
                  <a href="#" className="btn btn-sm btn-outline-light">
                    <i className="bi bi-google-play me-1"></i> Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-4 text-muted" />
          <p className="text-center small  mb-0">
            &copy; 2025 EventHub. Барлық құқықтар қорғалған.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
