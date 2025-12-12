
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import '@/App.css'
import { store } from './store/store'
import AppWithFlow from './AppWithFlow'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWithFlow />
    </Provider>
  </React.StrictMode>,
)