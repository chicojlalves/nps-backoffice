'use client'

import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const baseOptions = {
  chart: { toolbar: { show: false }, background: 'transparent', animations: { enabled: true } },
  grid: { borderColor: 'rgba(255,255,255,0.05)' },
  theme: { mode: 'dark' },
  tooltip: { theme: 'dark' },
}

export function LineChart({ series, categories }) {
  const options = {
    ...baseOptions,
    chart: { ...baseOptions.chart, type: 'line' },
    stroke: { width: 3, curve: 'smooth' },
    xaxis: { type: 'datetime', labels: { style: { colors: '#64748b' } } },
    yaxis: { labels: { style: { colors: '#64748b' } }, max: 100, min: -100 },
    colors: ['#3b82f6'],
    markers: { size: 4 },
  }
  return <ReactApexChart type="line" options={options} series={series} height={280} />
}

export function BarChart({ series, categories }) {
  const options = {
    ...baseOptions,
    chart: { ...baseOptions.chart, type: 'bar' },
    xaxis: { categories, labels: { style: { colors: '#64748b' } } },
    yaxis: { labels: { style: { colors: '#64748b' } }, max: 100, min: -100 },
    colors: ['#3b82f6'],
    dataLabels: { enabled: true, style: { colors: ['#fff'] } },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
  }
  return <ReactApexChart type="bar" options={options} series={series} height={280} />
}

export function DonutChart({ promoters, passives, detractors }) {
  const options = {
    ...baseOptions,
    chart: { ...baseOptions.chart, type: 'donut' },
    labels: ['Promotores', 'Neutros', 'Detratores'],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    legend: { labels: { colors: '#94a3b8' }, position: 'bottom' },
    dataLabels: { enabled: true },
    plotOptions: { pie: { donut: { size: '65%' } } },
  }
  return (
    <ReactApexChart
      type="donut"
      options={options}
      series={[promoters, passives, detractors]}
      height={280}
    />
  )
}
