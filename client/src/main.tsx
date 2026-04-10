//region imports
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import ErrorBoundary from './components/common/ErrorBoundary';
import App from "./App.tsx";
import './index.css';
//endregion

//region render
/**
 * Application entry point
 * Wraps app with Redux Provider, PersistGate, and ErrorBoundary
 */
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </ErrorBoundary>
);
//endregion
