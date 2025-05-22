import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../hook/useFetchh";
import { authService } from "../api/authService";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { FaFilterCircleXmark } from "react-icons/fa6";
function HomeAdmin() {
  const [activeIndices, setActiveIndices] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const token = localStorage.getItem("refreshToken");
  const {
    data: events,
    loading,
    error,
    refetch,
  } = useFetch(`http://localhost:8080/api/v1/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Филтр объектини яратиш
  const [filter, setFilter] = useState({
    cityId: null,
    tagIds: [],
    online: "all",
  });

  // Филтрлаш логикаси
  const filteredEvents = events?.filter((event) => {
    // Шаҳар бўйича филтрлаш
    if (filter.cityId && filter.cityId !== 0 && event.cityId !== filter.cityId) return false;

    // Категориялар бўйича филтрлаш
    if (
      filter.tagIds.length > 0 &&
      !filter.tagIds.includes(0) && // "Барлығы" танланмаганда
      !filter.tagIds.some((tagId) => event.tagIds.includes(tagId))
    )
      return false;

    // Онлайн/Офлайн бўйича филтрлаш
    if (filter.online === "online" && !event.online) return false;
    if (filter.online === "offline" && event.online) return false;

    return true;
  });

  // Жақин келажакдаги оқиғаларни текшириш
  const isEventSoon = (startDate) => {
    const eventDate = new Date(startDate);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays >= 0;
  };

  // Ҳозирги фойдаланувчини олиш
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const data = authService.getCurrentUser();
    if (data) {
      setCurrentUser(data);
    }
  }, []);

  // Карусель функционалиги
  const handlePrev = (eventId) => {
    setActiveIndices((prev) => {
      const currentEvent = events?.find((e) => e.id === eventId);
      const imagesCount = currentEvent?.images?.length || 1;
      if (!currentEvent || !imagesCount) return prev;
      const newIndex = prev[eventId] === 0 ? imagesCount - 1 : prev[eventId] - 1;
      return {
        ...prev,
        [eventId]: newIndex,
      };
    });
  };

  const handleNext = (eventId) => {
    setActiveIndices((prev) => {
      if (!events) return prev;
      const event = events.find((e) => e.id === eventId);
      if (!event) return prev;
      const imagesLength = event.images?.length || 0;
      if (imagesLength === 0) return prev;
      const currentIndex = prev[eventId] || 0;
      const newIndex = currentIndex === imagesLength - 1 ? 0 : currentIndex + 1;
      return {
        ...prev,
        [eventId]: newIndex,
      };
    });
  };

  const goToImage = (eventId, index) => {
    setActiveIndices((prev) => ({
      ...prev,
      [eventId]: index,
    }));
  };

  // Карусель индексларини инициализация қилиш
  useEffect(() => {
    if (events) {
      const initialIndices = {};
      events.forEach((event) => {
        initialIndices[event.id] = 0;
      });
      setActiveIndices(initialIndices);
    }
  }, [events]);

  // Сақланган оқиғалар билан ишлаш
  const handleFov = async (id, isFavorited) => {
    try {
      const method = isFavorited ? "DELETE" : "POST";
      const response = await fetch(`http://localhost:8080/api/v1/favorites/${id}`, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const action = isFavorited ? "өшірілді" : "қосылды";
        console.log(`Іс-шара сәтті ${action}!`);
        refetch();
      } else {
        console.log("Сервер қатесі");
      }
    } catch (err) {
      console.error("Қате пайда болды:", err);
      toast.error(err.message || "Өзгерту кезінде қате пайда болды");
    }
  };

  // Шаҳарлар рўйхати
  const cities = [
    { id: 0, name: "Қаланы таңдаңыз" },
    { id: 1, name: "Алматы" },
    { id: 2, name: "Астана" },
    { id: 3, name: "Шымкент" },
    { id: 4, name: "Караганда" },
    { id: 5, name: "Актобе" },
    { id: 6, name: "Тараз" },
    { id: 7, name: "Павлодар" },
    { id: 8, name: "Усть-Каменогорск" },
    { id: 9, name: "Семей" },
    { id: 10, name: "Атырау" },
    { id: 11, name: "Кокшетау" },
    { id: 12, name: "Талдыкорган" },
    { id: 13, name: "Экибастуз" },
    { id: 14, name: "Кызылорда" },
    { id: 15, name: "Жезказган" },
    { id: 16, name: "Рудный" },
    { id: 17, name: "Кентау" },
    { id: 18, name: "Темиртау" },
    { id: 19, name: "Туркестан" },
  ];

  // Категориялар рўйхати
  const tagIdsCategories = [
    { id: 0, name: "All" },
    { id: 1, name: "Технология", colorCode: "#FF5733" },
    { id: 2, name: "Денсаулық", colorCode: "#33FF57" },
    { id: 3, name: "Білім", colorCode: "#3357FF" },
    { id: 4, name: "Спорт", colorCode: "#FF33A1" },
    { id: 5, name: "Өнер", colorCode: "#FF8C33" },
    { id: 6, name: "Музыка", colorCode: "#33FFA1" },
    { id: 7, name: "Тамақ", colorCode: "#A133FF" },
    { id: 8, name: "Саяхат", colorCode: "#FF33A1" },
    { id: 9, name: "Бизнес", colorCode: "#FF5733" },
    { id: 10, name: "Қоршаған орта", colorCode: "#33FF57" },
    { id: 11, name: "Мәдениет", colorCode: "#3357FF" },
    { id: 12, name: "Қоғам", colorCode: "#FF33A1" },
    { id: 13, name: "Өмір салты", colorCode: "#FF8C33" },
    { id: 14, name: "Ғылым", colorCode: "#33FFA1" },
  ];

  // Шаҳарларни DOMга қўшиш
  useEffect(() => {
    const citySelectEL = document.getElementById("citySelect");
    citySelectEL.innerHTML = "";
    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.id;
      option.textContent = city.name;
      citySelectEL?.appendChild(option);
    });
  }, [cities]);

  // Категорияларни DOMга қўшиш
  useEffect(() => {
    const selectTag = document.getElementById("tagSelect");
    selectTag.innerHTML = "";
    tagIdsCategories.forEach((tag) => {
      const option = document.createElement("option");
      option.value = tag.id;
      option.textContent = tag.name;
      selectTag?.appendChild(option);
    });
  }, [tagIdsCategories]);

  const handleRefresh = (e) => {
    setFilter({
      cityId: null, // Шаҳарни бошланғич ҳолатга келтириш
      tagIds: [], // Категорияларни бошланғич ҳолатга келтириш
      online: "all", // Онлайн/Офлайн филтрни бошланғич ҳолатга келтириш
    });
    setIsChanged(false)
  };

  return (
    <div className="ms-2">
      <Toaster />
      <ToastContainer />
      <div className="row my-4">
        {/* Онлайн/Офлайн филтр */}
        <div className="col-md-3 mb-3">
          <select
            className="form-select shadow-sm"
            aria-label="Тип мероприятия"
            value={filter.online}
            onChange={(e) => {
              setFilter({ ...filter, online: e.target.value });
              setIsChanged(true);
            }}
          >
            <option value="all">Барлық түрлері</option>
            <option value="online">Онлайн</option>
            <option value="offline">Офлайн</option>
          </select>
        </div>

        {/* Шаҳарлар филтр */}
        <div className="col-md-3 mb-3">
          <select
            id="citySelect"
            className="form-select shadow-sm"
            aria-label="Шаҳарни танланг"
            value={filter.cityId || ""}
            onChange={(e) => {
              setFilter({
                ...filter,
                cityId: e.target.value ? parseInt(e.target.value) : null,
              });
              setIsChanged(true); // Бу ерда фильтр ўзгарганини белгилаяпсан
            }}
          >
            <option value="">Шаҳарни танланг</option>
          </select>
        </div>

        {/* Категориялар филтр */}
        <div className="col-md-3 mb-3">
          <select
            id="tagSelect"
            className="form-select shadow-sm"
            aria-label="Категорияны танланг"
            value={filter.tagIds}
            onChange={(e) => {
              const selectedTags = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
              setFilter({ ...filter, tagIds: selectedTags });
              setIsChanged(true);
            }}
          >
            {tagIdsCategories.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {isChanged && (
          <div className="col-md-3 mb-3 d-flex align-items-center">
            <button onClick={handleRefresh} className={`btn btn-info text-white`}>
              <FaFilterCircleXmark size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Оқиғалар рўйхати */}
      <div className="container my-4">
        <h5 className="fw-semibold mb-4 text-primary">Барлық оқиғалар</h5>
        {loading && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Жүктелуде...</span>
            </div>
            <span className="ms-3">Жүктелуде...</span>
          </div>
        )}
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {filteredEvents &&
          filteredEvents.map((event) => {
            const remainingSpots = event.capacity - event.registeredAttendeesCount;
            const eventImages = event.images || [];
            const activeIndex = activeIndices[event.id] || 0;
            return (
              <div className="col" key={event.id}>
                <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                  {/* Карусель */}
                  <div className="position-relative">
                    {eventImages.length > 0 ? (
                      <>
                        <div className="carousel-inner">
                          <img
                            src={eventImages[activeIndex]?.imageUrl || `https://picsum.photos/id/ ${event.id}/800/600`}
                            className="card-img-top rounded-top"
                            alt="Event"
                            style={{ height: "180px", objectFit: "cover" }}
                          />
                        </div>
                        {/* Карусель контроллари */}
                        {eventImages.length > 1 && (
                          <>
                            <button
                              className="carousel-control-prev"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePrev(event.id);
                              }}
                              style={{
                                width: "30px",
                                height: "30px",
                                top: "50%",
                                left: "5px",
                                transform: "translateY(-50%)",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                borderRadius: "50%",
                                border: "none",
                              }}
                            >
                              <span className="carousel-control-prev-icon"></span>
                            </button>
                            <button
                              className="carousel-control-next"
                              onClick={(e) => {
                                e.preventDefault();
                                handleNext(event.id);
                              }}
                              style={{
                                width: "30px",
                                height: "30px",
                                top: "50%",
                                right: "5px",
                                transform: "translateY(-50%)",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                borderRadius: "50%",
                                border: "none",
                              }}
                            >
                              <span className="carousel-control-next-icon"></span>
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <img
                        src={`https://picsum.photos/id/ ${event.id}/800/600`}
                        className="card-img-top rounded-top"
                        alt="Event"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    {/* Оқиға номи */}
                    <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 p-2">
                      <h6 className="text-white fw-bold text-truncate m-0">{event.title}</h6>
                    </div>
                  </div>
                  {/* Индикаторлар */}
                  {eventImages.length > 1 && (
                    <div className="position-absolute top-50 mt-4 start-0 w-100 d-flex justify-content-center mb-2">
                      <span class="badge text-bg-light">
                        <div className="d-flex ">
                          {eventImages.map((_, index) => (
                            <button
                              key={index}
                              type="button"
                              className={`mx-1 p-1 ${
                                index === activeIndex ? "bg-primary" : "bg-secondary"
                              } border-0 rounded-circle`}
                              style={{
                                width: "8px",
                                height: "8px",
                                padding: "0",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                goToImage(event.id, index);
                              }}
                              aria-label={`Slide ${index + 1}`}
                            ></button>
                          ))}
                        </div>
                      </span>
                    </div>
                  )}
                  {/* "ЖАҚЫН АРАДА" белгиси */}
                  {isEventSoon(event.startDateTime) && (
                    <div className="position-absolute top-0 end-0 w-100 bg-opacity-75 p-2 text-start">
                      <span className="badge text-bg-info text-white">ЖАҚЫН АРАДА</span>
                    </div>
                  )}
                  {/* Уйғонтирувчи белгиси */}
                  <div className="position-absolute top-0 end-0 p-3">
                    <input
                      onClick={() => handleFov(event.id, event.favorited)}
                      type="checkbox"
                      className="heart-checkbox"
                      id={`heart-${event.id}`}
                      checked={event.favorited || false}
                    />
                    <label htmlFor={`heart-${event.id}`} className="heart-label">
                      <i className="bi bi-heart-fill heart-icon"></i>
                    </label>
                  </div>
                  <NavLink
                    className="link-offset-2 link-underline link-underline-opacity-0"
                    to={`/${currentUser && currentUser.role === "admin" && "meneger" ? "admin" : "user"}/${event.id}`}
                  >
                    {/* Карточка танаси */}
                    <div className="card-body p-3">
                      <p className="card-text small text-muted">
                        <i className="bi bi-geo-alt-fill me-1"></i> {event.address || "Онлайн"}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted">
                          <i className="bi bi-calendar-date-fill me-1"></i>{" "}
                          {new Date(event.startDateTime).toLocaleDateString()}
                        </span>
                        <span className="badge bg-primary">{event.eventType}</span>
                      </div>
                      <div className="mt-2 d-flex align-items-center">
                        <i className="bi bi-people-fill text-primary me-1 "></i>
                        <span className={`fw-bold ${remainingSpots <= 7 ? "text-danger" : "text-success"}`}>
                          {remainingSpots > 0 ? <span>{remainingSpots} орын бар</span> : "орын жок"}
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default HomeAdmin;
