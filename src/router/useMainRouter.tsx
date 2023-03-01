import React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from '@pages/home/Home';
import SeminarManage from '@pages/admin/SeminarManage';
import Study from '@pages/Study/Study';
import MainLayout from '@components/Layout/MainLayout';
import FullContainer from '@components/Layout/Container/FullContainer';
import FitContainer from '@components/Layout/Container/FitContainer';
import BoardList from '@pages/board/BoardList';

const useMainRouter = () =>
  useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          element: <FullContainer />,
          children: [
            {
              index: true,
              element: <Home />,
            },
          ],
        },
        {
          element: <FitContainer />,
          children: [
            {
              path: 'admin',
              children: [
                {
                  path: 'seminarManage',
                  element: <SeminarManage />,
                },
              ],
            },
            {
              path: 'board',
              children: [
                {
                  path: 'list',
                  element: <BoardList />,
                },
              ],
            },
            {
              path: 'study',
              element: <Study />,
            },
          ],
        },
      ],
    },
  ]);

export default useMainRouter;
