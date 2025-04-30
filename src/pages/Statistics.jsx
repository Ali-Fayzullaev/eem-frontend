import  { useState } from "react";
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

// Chart.js ни конфигурация қилиш
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Statistics() {
  const [filter, setFilter] = useState("all"); // Филтр холати

  // Умумий статистик маълумотлар
  const totalEvents = 50;
  const totalParticipants = 1200;
  const mostPopularEvent = "Программалау негіздері";
  const mostActiveUser = "Әлішер";

  // Айлар бойынша қатысушылар саны
  const monthlyParticipantsData = {
    labels: [
      "Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым",
      "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан"
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
  
  // Категориялар бойынша статистика маълумотлари
  const categoryData = {
    labels: [
      "Технология",
      "Денсаулық",
      "Білім",
      "Спорт",
      "Өнер",
      "Музыка",
      "Тамақ",
      "Саяхат",
      "Бизнес",
      "Қоршаған орта",
      "Мәдениет",
      "Қоғам",
      "Өмір салты",
      "Ғылым",
    ],
    datasets: [
      {
        label: "Іс-шаралар саны",
        data: [150, 202, 100, 380, 70, 20, 150, 40, 302, 202, 120, 25, 33, 22],
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
          "#C9CBCF", "#FFCD56", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
          "#9966FF", "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Жойлашув бойынша статистика
  const locationData = {
    labels: [
      "Алматы",
      "Нур-Султан",
      "Шымкент",
      "Караганда",
      "Актобе",
      "Тараз",
      "Павлодар",
      "Усть-Каменогорск",
      "Семей",
      "Атырау",
      "Кокшетау",
      "Талдыкорган",
      "Экибастуз",
      "Кызылорда",
      "Жезказган",
      "Рудный",
      "Кентау",
      "Темиртау",
      "Туркестан",
    ],
    datasets: [
      {
        label: "Қатысушылар саны",
        data: [400, 550, 300, 250, 200, 180, 160, 240, 120, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10],
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
          "#C9CBCF", "#FFCD56", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
          "#9966FF", "#FF9F40", "#C9CBCF", "#FFCD56", "#FF6384", "#36A2EB",
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
        data: [30, 20],
        backgroundColor: ["#FF6384", "#36A2EB"],
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
  
    {/* Line chart
    <div className="row">
      <div className="col-12">
        <div className="card full-card">
          <h4 className="card-title">Ортача қатысушылар (чизиқли график)</h4>
          <div className="chart-wrapper">
            <Line data={lineChartData} />
          </div>
        </div>
      </div>
    </div> */}
  </div>
  );
}

export default Statistics;

