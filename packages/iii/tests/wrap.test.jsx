import { waitFor } from '@testing-library/react';
import { render } from './shared';
import { QcProvider, useQcDefaults, QcExtensionsProvider } from '../src/common/index';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { wrapUseInfiniteQuery, wrapUseInfiniteQueryWithExtensions, wrapUseQuery, wrapUseQueryWithExtensions } from '../src/wrap';
import { wrapTests } from '../../common/tests/wrap-tests';

wrapTests({ 
  wrapUseInfiniteQuery, wrapUseInfiniteQueryWithExtensions, wrapUseQuery, wrapUseQueryWithExtensions,
  QcProvider, useQcDefaults, QcExtensionsProvider,
  useParams, useSearchParams,
  React, render, waitFor
});