import dynamic from 'next/dynamic'

import { Box, Flex, SimpleGrid, Text, theme } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { DrawerSidebar } from '../components/Sidebar/DrawerSidebar';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const options: ApexOptions = {
  colors: [theme.colors.red[500]],
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500]
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600]
    },
    axisTicks: {
      color: theme.colors.gray[500]
    },
    categories: [
      '2023/01/18T:00:00.000Z',
      '2023/01/19T:00:00.000Z',
      '2023/01/20T:00:00.000Z',
      '2023/01/21T:00:00.000Z',
      '2023/01/22T:00:00.000Z',
      '2023/01/23T:00:00.000Z',
      '2023/01/24T:00:00.000Z',
    ],
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3
    }
  },
}

const dailySubSeries = [
  { name: 'daily-subs', data: [10, 24, 21, 11, 13, 2, 36] }
]

const openRateSeries = [
  { name: 'open-rate', data: [5, 2, 5, 7, 3, 2, 5] }
]

export default function Dashboard() {
  return (
    <Flex flexDir='column' h='100vh'>
      <Header />

      <Flex w='100%' my='6' maxWidth={1480} mx='auto' px='6'>
        <Sidebar />

        <SimpleGrid flex='1' gap='4' minChildWidth={['250px', '320px']}>
          <Box p={['4', '6', '8']} pt='12' bg='gray.800' borderRadius={8}>
            <Text fontSize='lg' mb='4'>Inscritos da semana</Text>
            <Chart heigth='100%' width='100%' options={options} series={dailySubSeries} type='area' height={160} />
          </Box>

          <Box p={['4', '6', '8']} pt='12' bg='gray.800' borderRadius={8}>
            <Text fontSize='lg' mb='4'>Taxa de abertura</Text>
            <Chart heigth='100%' width='100%' options={options} series={openRateSeries} type='area' height={160} />
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}