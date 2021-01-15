import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import {getStats} from "../utils/stats";
import SmartView from "./smart";

const createStatsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

const getChartOptions = (chartName, formatter) => ({
  plugins: {
    datalabels: {
      font: {
        size: 13
      },
      color: `#000000`,
      anchor: `end`,
      align: `start`,
      formatter
    }
  },
  title: {
    display: true,
    text: chartName,
    fontColor: `#000000`,
    fontSize: 23,
    position: `left`
  },
  scales: {
    yAxes: [{
      ticks: {
        fontColor: `#000000`,
        padding: 5,
        fontSize: 13,
      },
      gridLines: {
        display: false,
        drawBorder: false
      },
      barThickness: 44,
    }],
    xAxes: [{
      ticks: {
        display: false,
        beginAtZero: true,
      },
      gridLines: {
        display: false,
        drawBorder: false
      },
      minBarLength: 50
    }],
  },
  legend: {
    display: false
  },
  tooltips: {
    enabled: false,
  }
});

const renderMoneyStats = (moneyCtx, statsData) => {
  const BAR_HEIGHT = 55;
  moneyCtx.height = BAR_HEIGHT * 5;
  // typeCtx.height = BAR_HEIGHT * 5;
  // timeCtx.height = BAR_HEIGHT * 5;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(statsData).map((type) => type.toUpperCase()),
      datasets: [{
        data: Object.values(statsData).map((stats) => stats.totalSpent),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: getChartOptions(`MONEY`, (val) => `€ ${val}`)
  });
};

const renderTypeStats = (typeCtx, statsData) => {
  const BAR_HEIGHT = 55;
  typeCtx.height = BAR_HEIGHT * 5;

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(statsData).map((type) => type.toUpperCase()),
      datasets: [{
        data: Object.values(statsData).map((stats) => stats.count),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: getChartOptions(`TYPE`, (val) => `${val}x`)
  });
};

const renderTimeStats = (timeCtx, statsData) => {
  const BAR_HEIGHT = 55;
  timeCtx.height = BAR_HEIGHT * 5;


  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(statsData).map((type) => type.toUpperCase()),
      datasets: [{
        data: Object.values(statsData).map((stats) => stats.totalTime),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: getChartOptions(`TIME-SPEND`, (val) => `${dayjs(val).format(`D`)}D`)
  });
};

export default class Statistics extends SmartView {
  constructor(events) {
    super();

    this._data = events;
    this._statsData = getStats(this._data);

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  removeElement() {
    super.removeElement();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);
    this._moneyChart = renderMoneyStats(moneyCtx, this._statsData);
    // console.log(this._statsData)
    this._typeChart = renderTypeStats(typeCtx, this._statsData);
    this._timeChart = renderTimeStats(timeCtx, this._statsData);
  }
}
