import { Line, Doughnut } from 'react-chartjs-2'
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
import { orange, purple } from '@mui/material/colors';
import { purpleLight } from '../constants/color';


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
    labels,
    datasets: [
      {
      data: [1,5,35,40,24,12,6],
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

  const data = {
    labels,

    datasets: [
      {
      data: value,
      fill: true,
      backgroundColor: [purpleLight, orange],
      borderColor: [purple, orange],
      offset: 20,
      },

    ],
  };

  return (
    <div>
      <Doughnut style={{zIndex: 10}} data={data} options={doughnutChartOptions}/>
    </div>
  )
};

export {LineChart, DoughnutChart};
