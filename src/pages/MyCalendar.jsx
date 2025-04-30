import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import "../Admin.css";

// Calendar localization
moment.locale("en", {
  months:
    "January_February_March_April_May_June_July_August_September_October_November_December".split(
      "_"
    ),
  weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
    "_"
  ),
  weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
});

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onView }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate("TODAY")}>
          Today
        </button>
      </span>

      <span className="rbc-toolbar-label">{label}</span>
    </div>
  );
};

function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://67ddbf11471aaaa742826b6e.mockapi.io/events",
          {
            params: { subscrib: true },
          }
        );

        const formattedEvents = response.data.map((event) => ({
          id: event.id,
          title: event.eventName,
          start: new Date(`${event.startDate}T${event.startTime}`),
          end: new Date(`${event.endDate}T${event.endTime}`),
          location: event.location,
          imgUrl: event.imgUrl,
          type: event.eventType,
          allDay: false,
          description: event.description,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="spinner"></div>
        <p>Loading your events...</p>
      </div>
    );
  }

  return (
    <div className="calendar-container">
  <header className="calendar-header">
    <h2 className="text-white">
      <i className="bi bi-calendar-heart "></i>
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
      style={{ height: "100%" }}
      eventPropGetter={eventStyleGetter}
      views={{
        month: true,
        week: true,
        day: true,
        agenda: true,
      }}
      defaultView="month"
      components={{
        toolbar: CustomToolbar,
        event: ({ event }) => (
          <div className="custom-event">
            <strong>{event.title}</strong>
            {event.location && (
              <div>
                <i className="bi bi-geo-alt"></i> {event.location}
              </div>
            )}
            <div>
              <small>
                {moment(event.start).format("HH:mm")} -{" "}
                {moment(event.end).format("HH:mm")}
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
        agenda: "Күн тәртібі",
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
        .slice(0, 3)
        .map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-card-header">
              <span
                className={`event-type-badge ${event.type.toLowerCase()}`}
              >
                {event.type}
              </span>
              <h4>{event.title}</h4>
            </div>
            <div className="event-card-body">
              <div className="event-meta">
                <div className="event-image-container">
                  {event.imgUrl && <img
                    src={event.imgUrl || "https://via.placeholder.com/400x200?text=Сурет+жоқ"}
                    className="card-img-top"
                    alt={event.eventName}
                  />}
                </div>

                <div className="event-details">
                  <span>
                    <i className="bi bi-calendar"></i>
                    {moment(event.start).format("MMM Do")}
                  </span>
                  <span>
                    <i className="bi bi-clock"></i>
                    {moment(event.start).format("h:mm A")}
                  </span>
                  {event.location && (
                    <span>
                      <i className="bi bi-geo-alt"></i>
                      {event.location}
                    </span>
                  )}
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
