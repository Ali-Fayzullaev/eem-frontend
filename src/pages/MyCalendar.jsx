import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../Admin.css";
import useFetch from "../hook/useFetch";

// Казахская локализация
moment.locale("kk", {
  months: "Қаңтар_Ақпан_Наурыз_Сәуір_Мамыр_Маусым_Шілде_Тамыз_Қыркүйек_Қазан_Қараша_Желтоқсан".split("_"),
  weekdays: "Жексенбі_Дүйсенбі_Сейсенбі_Сәрсенбі_Бейсенбі_Жұма_Сенбі".split("_"),
  weekdaysShort: "Жк_Дс_Сс_Ср_Бс_Жм_Сн".split("_"),
});

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate("TODAY")}>
          Бүгін
        </button>
        <button type="button" onClick={() => onNavigate("PREV")}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <button type="button" onClick={() => onNavigate("NEXT")}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </span>

      <span className="rbc-toolbar-label">{label}</span>

      <span className="rbc-btn-group mobile-hidden">
        <button type="button" className={view === "day" ? "active" : ""} onClick={() => onView("day")}>
          Күн
        </button>
        <button type="button" className={view === "week" ? "active" : ""} onClick={() => onView("week")}>
          Апта
        </button>
        <button type="button" className={view === "month" ? "active" : ""} onClick={() => onView("month")}>
          Ай
        </button>
      </span>
    </div>
  );
};

// Функция для получения изображения события
const getEventImage = (event) => {
  if (!event.images || event.images.length === 0) {
    return "https://via.placeholder.com/400x200?text=Сурет+жоқ";
  }

  // Сначала ищем обложку
  const coverImage = event.images.find((img) => img.coverImage);
  if (coverImage) return coverImage.imageUrl;

  // Если нет обложки, берем первое изображение
  return event.images[0].imageUrl;
};

function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("month");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const token = localStorage.getItem("refreshToken");

  // Обработчик изменения размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: registrations } = useFetch("http://localhost:8080/api/v1/events/user/registrations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { data: allEvents } = useFetch("http://localhost:8080/api/v1/events");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const registeredEvents =
          allEvents?.filter((event) =>
            registrations?.some((reg) => reg.eventId === event.id && reg.status !== "CANCELLED")
          ) || [];

        const formattedEvents = registeredEvents.map((event) => ({
          id: event.id,
          title: event.title || event.eventTitle,
          start: new Date(event.startDateTime || event.eventStartDateTime),
          end: new Date(event.endDateTime || event.eventEndDateTime),
          type: event.eventType || "OTHER",
          status: event.status,
          description: event.description,
          location: event.online ? "Онлайн" : event.address,
          images: event.images || [],
          online: event.online,
          address: event.address,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error formatting events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [allEvents, registrations]);

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3a7bd5";
    if (event.type === "ONLINE") backgroundColor = "#00d2ff";
    if (event.type === "OFFLINE") backgroundColor = "#e53935";

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        padding: "2px 5px",
      },
    };
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="spinner"></div>
        <p>Іс-шаралар жүктелуде...</p>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <h2 className="text-white">
          <i className="bi bi-calendar-heart"></i>
          Менің іс-шара күнтізбем
        </h2>
        <div className="calendar-legend text-white">
          <span>
            <div className="legend-color online"></div> Онлайн
          </span>
          <span>
            <div className="legend-color offline"></div> Оффлайн
          </span>
          <span>
            <div className="legend-color other"></div> Басқа
          </span>
        </div>
      </header>

      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: isMobile ? 400 : 600 }}
          eventPropGetter={eventStyleGetter}
          views={isMobile ? ["month", "agenda"] : ["month", "week", "day", "agenda"]}
          view={currentView}
          onView={handleViewChange}
          defaultView="month"
          components={{
            toolbar: (props) => <CustomToolbar {...props} view={currentView} />,
            event: ({ event }) => (
              <div className="custom-event">
                <strong>{event.title}</strong>
                <div>
                  <i className="bi bi-geo-alt"></i> {event.location || "Орналасқан жері белгісіз"}
                </div>
                <div>
                  <small>
                    {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
                  </small>
                </div>
              </div>
            ),
          }}
          messages={{
            today: "Бүгін",
            previous: "Алдыңғы",
            next: "Келесі",
            month: "Ай",
            week: "Апта",
            day: "Күн",
            agenda: "Тізім",
            date: "Күні",
            time: "Уақыты",
            event: "Іс-шара",
            noEventsInRange: "Іс-шаралар табылмады.",
          }}
        />
      </div>

      <section className="upcoming-events">
        <h3>
          <i className="bi bi-alarm"></i>
          Жуықтаған іс-шаралар
        </h3>
        <div className="events-grid">
          {events
            .filter((event) => new Date(event.start) > new Date())
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, isMobile ? 1 : 3)
            .map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-card-header">
                  <span className={`event-type-badge ${event.type.toLowerCase()}`}>{event.type}</span>
                  <h4>{event.title}</h4>
                </div>
                <div className="event-card-body">
                  <div className="event-meta">
                    <div className="event-image-container">
                      <img
                        src={getEventImage(event)}
                        className="card-img-top w-100 h-100"
                        alt={event.title}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x200?text=Сурет+жоқ";
                        }}
                      />
                    </div>
                    <div className="event-details">
                      <span>
                        <i className="bi bi-calendar"></i>
                        {moment(event.start).locale("kk").format("D MMMM")}
                      </span>
                      <span>
                        <i className="bi bi-clock"></i>
                        {moment(event.start).locale("kk").format("HH:mm")}
                      </span>
                      <span>
                        <i className={event.online ? "bi bi-camera-video" : "bi bi-geo-alt"}></i>
                        {event.online ? "Онлайн іс-шара" : event.address || "Мекен-жайы белгісіз"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="event-card-actions">
                  <button className="btn-add-to-calendar">
                    <i className="bi bi-calendar-plus"></i> Еске салсын
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default MyCalendar;
