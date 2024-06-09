import { Line, Doughnut } from "react-chartjs-2";
import {Chart as ChartJS, 
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
} from 'chart.js';
import { orange, orangeLight, purple, purpleLight } from '../constants/color';
import { getLast7Days } from "../../lib/features";


ChartJS.register(  
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const labels = getLast7Days();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({value=[]}) => {
  const data = {
    labels ,
    datasets: [
      {
      data: value,
      label: "Revenue",
      fill: true,
      backgroundColor: purpleLight,
      borderColor: purple,
      },

    ],
  };

  return (
    <div>
      <Line data={data} options={lineChartOptions} />;
    </div>
  )
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 120,
};

const DoughnutChart = ({value = [], labels = [] }) => {
  console.log(value)
  const data = {
    labels,
    datasets: [
      {
      data: value,
      backgroundColor: [purpleLight, orangeLight],
      hoverBackgroundColor: [purple, orange],
      borderColor: [purple, orange],
      offset: 20,
      },

    ],
  };

  return (
      <Doughnut style={{zIndex: 10}} data={data} options={doughnutChartOptions}/>
  )
};

export {LineChart, DoughnutChart};
