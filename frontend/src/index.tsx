import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { setAuthCredentials } from './api/client';
import toast, { Toaster } from 'react-hot-toast';

// Initial sync of credentials from rehydrated state to avoid race conditions on page refresh
const initialState = store.getState();
if (initialState.auth.credentials) {
  setAuthCredentials(initialState.auth.credentials.username, initialState.auth.credentials.password);
}

store.subscribe(() => {
  const state = store.getState();
  if (state.auth.credentials) {
    setAuthCredentials(state.auth.credentials.username, state.auth.credentials.password);
  } else {
    // Clear credentials if logged out
    setAuthCredentials('', '');
  }
});

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Query Error:', error.message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(error.message || 'Something went wrong');
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
