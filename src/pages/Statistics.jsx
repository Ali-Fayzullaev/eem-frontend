import { useState } from "react";
import "../Statistics.css";
import { useEffect } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2"; // График учун
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import useFetch from "../hook/useFetchh";

// Chart.js ни конфигурация қилиш
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

function Statistics() {
  const [filter, setFilter] = useState("all"); // Филтр холати

  // Умумий статистик маълумотлар

  // Айлар бойынша қатысушылар саны
  const monthlyParticipantsData = {
    labels: [
      "Қаңтар",
      "Ақпан",
      "Наурыз",
      "Сәуір",
      "Мамыр",
      "Маусым",
      "Шілде",
      "Тамыз",
      "Қыркүйек",
      "Қазан",
      "Қараша",
      "Желтоқсан",
    ],
    datasets: [
      {
        label: "Қатысушылар саны",
        data: [200, 250, 300, 400, 350, 370, 390, 420, 410, 430, 405, 450],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const token = localStorage.getItem("accessToken");

const { data: allEvents } = useFetch("http://localhost:8080/api/v1/events", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const [topCreator, setTopCreator] = useState(null);

useEffect(() => {
  if (!allEvents || allEvents?.length === 0) return;

  const fetchDetails = async () => {
    const creatorCount = {};

    for (const event of allEvents) {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/events/${event.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const eventDetails = await res.json();
        const creator = eventDetails.creatorUsername;

        if (creator) {
          creatorCount[creator] = (creatorCount[creator] || 0) + 1;
        }

      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    // Энг кўп event яратган user ни топиш
    let maxCreator = null;
    let maxCount = 0;

    for (const [username, count] of Object.entries(creatorCount)) {
      if (count > maxCount) {
        maxCount = count;
        maxCreator = username;
      }
    }

    setTopCreator({ username: maxCreator, count: maxCount });
  };

  fetchDetails();
}, [allEvents]);

const {data: allUsers} = useFetch("http://localhost:8080/api/v1/admin/users", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

  const onlineLength = allEvents?.filter((event) => event.online).length;

  const totalEvents = allEvents?.length;
  const totalParticipants = allUsers?.length;
  const mostPopularEvent = "Программалау негіздері";
  const mostActiveUser = topCreator?.username;

  const oflineLenght = allEvents?.length - onlineLength;
// Таглар учун сонларни ҳисоблаймиз
const tagCount = {};

allEvents?.forEach(event => {
  event.tagIds.forEach(tagId => {
    tagCount[tagId] = (tagCount[tagId] || 0) + 1;
  });
});


// ⚡ 14 та таглар учун data массивини тайёрлаймиз
const chartData = [];
for (let i = 1; i <= 14; i++) {
  chartData.push(tagCount[i] || 0); // агар 0 бўлса ҳам қўш
}

// ✅ Энди тўғри ишлайди
const categoryData = {
  labels: [
    "Технология", "Денсаулық", "Білім", "Спорт", "Өнер",
    "Музыка", "Тамақ", "Саяхат", "Бизнес", "Қоршаған орта",
    "Мәдениет", "Қоғам", "Өмір салты", "Ғылым"
  ],
  datasets: [
    {
      label: "Іс-шаралар саны",
      data: chartData,
      backgroundColor: [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
        "#FF9F40", "#C9CBCF", "#FFCD56", "#FF6384", "#36A2EB",
        "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
      ],
      hoverOffset: 4,
    },
  ],
};

const cityMap = {
  1: "Алматы",
  2: "Астана",
  3: "Шымкент",
  4: "Караганда",
  5: "Актобе",
  6: "Тараз",
  7: "Павлодар",
  8: "Усть-Каменогорск",
  9: "Семей",
  10: "Атырау",
  11: "Кокшетау",
  12: "Талдыкорган",
  13: "Экибастуз",
  14: "Кызылорда",
  15: "Жезказган",
  16: "Рудный",
  17: "Кентау",
  18: "Темиртау",
  19: "Туркестан",
};



const cityCount = {};

// Ҳисоблаш
allEvents?.forEach(event => {
  const id = event.cityId;
  cityCount[id] = (cityCount[id] || 0) + 1;
});

const cityLabels = Object.values(cityMap);

const cityData = cityLabels.map(cityName => {
  const cityId = Object.keys(cityMap).find(key => cityMap[key] === cityName);
  return cityCount[cityId] || 0;
});


const locationData = {
  labels: cityLabels,
  datasets: [
    {
      label: "Қатысушылар саны",
      data: cityData,
      backgroundColor: [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
        "#FF9F40", "#C9CBCF", "#FFCD56", "#FF6384", "#36A2EB",
        "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF",
        "#FFCD56", "#FF6384", "#36A2EB", "#FFCE56"
      ],
      hoverOffset: 4,
    },
  ],
};


 

  // Іс-шараларнинг тури бойынша статистика
  const eventTypeData = {
    labels: ["Онлайн", "Оффлайн"],
    datasets: [
      {
        label: "Іс-шаралар саны",
        data: [onlineLength, oflineLenght],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverOffset: 4,
      },
    ],
  };

  // Дойра диаграммаси (тиллар бойынша статистика)
  const languageData = {
    labels: ["Орыс тили", "Ағылшын тили", "Қазақ тили"],
    datasets: [
      {
        label: "Тілдер бойынша статистика",
        data: [600, 200, 1200],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="statistics-container">
      {/* Top insight cards */}
      <div className="insights-statistics row mb-4">
        <div className="col-12 col-md-4 mb-3 mb-md-0">
          <div className="insight-card-statistics">
            <h6>Астанадағы қатысушылар саны</h6>
            <p className="insight-value-statistics">400+</p>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3 mb-md-0">
          <div className="insight-card-statistics">
            <h6>Соңғы 30 күндегі қатысушылар саны</h6>
            <p className="insight-value-statistics">150+</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="insight-card-statistics">
            <h6>Ең белсенді ай</h6>
            <p className="insight-value-statistics">Наурыз</p>
          </div>
        </div>
      </div>

      {/* Main statistics row */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-4 mb-md-0">
          <div className="card-statistics full-card-statistics">
            <h4 className="card-title-statistics">Жалпы статистика</h4>
            <ul className="stats-list">
              <li>
                <span>Жалпы іс-шаралар:</span> {totalEvents}
              </li>
              <li>
                <span>Жалпы қатысушылар:</span> {totalParticipants}
              </li>
              <li>
                <span>Ең танымал іс-шара:</span> {mostPopularEvent}
              </li>
              <li>
                <span>Ең белсенді пайдаланушы:</span> {mostActiveUser}
              </li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card-statistics full-card-statistics">
            <h4 className="card-title-statistics">Тілдер бойынша статистика</h4>
            <div className="chart-wrapper-statistics">
              <Doughnut data={languageData} />
            </div>
          </div>
        </div>
      </div>

      {/* Categories statistics - moved to its own row */}
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <div className="card-statistics full-card-statistics">
            <h4 className="card-title-statistics">Категориялар бойынша статистика</h4>
            <div className="chart-wrapper-statistics">
              <Bar data={categoryData} />
            </div>
          </div>
        </div>
        {/* Monthly participants chart */}
        <div className="col-12  col-md-6">
          <div className="card-statistics full-card-statistics">
            <h4 className="card-title-statistics">Айлар бойынша қатысушылар</h4>
            <div className="chart-wrapper-statistics">
              <Bar data={monthlyParticipantsData} />
            </div>
          </div>
        </div>
      </div>

      {/* Location and event type statistics */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-4 mb-md-0">
          <div className="card-statistics full-card-statistics">
            <h4 className="card-title-statistics">Жойлашув бойынша статистика</h4>
            <div className="chart-wrapper-statistics">
              <Pie data={locationData} />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card-statistics full-card-statistics">
            <h4 className="card-title-statistics">Іс-шараларнинг тури бойынша статистика</h4>
            <div className="chart-wrapper-statistics">
              <Pie data={eventTypeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
