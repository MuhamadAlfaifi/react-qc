import { waitFor } from '@testing-library/react';
import { render } from './shared';
import { QcProvider, useQcDefaults, QcExtensionsProvider } from '../../common/src/index';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { wrapUseInfiniteQuery, wrapUseInfiniteQueryWithExtensions, wrapUseQuery, wrapUseQueryWithExtensions } from '../src/wrap';
import { featuresTests } from '../../common/tests/features-tests';

featuresTests({ 
  wrapUseInfiniteQuery, wrapUseInfiniteQueryWithExtensions, wrapUseQuery, wrapUseQueryWithExtensions,
  QcProvider, useQcDefaults, QcExtensionsProvider,
  useParams, useSearchParams,
  React, render, waitFor
});