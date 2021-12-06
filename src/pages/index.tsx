import React from 'react';
import BasicLayout from '../layouts/BasicLayout';
import PrivateRoute from '../components/PrivateRoute';

export default function Home() {
  const breadcrumb = [
    {
      name: 'Home',
    },
    {
      name: 'Link1',
    },
    {
      name: 'Link2',
    },
  ];

  return (
    <PrivateRoute>
      <BasicLayout breadcrumb={breadcrumb}></BasicLayout>
    </PrivateRoute>
  );
}
