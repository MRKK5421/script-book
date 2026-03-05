# src/App.tsx
@"
function App() {
  return (
    <div className=\"min-h-screen bg-gray-100 flex items-center justify-center\">
      <h1 className=\"text-4xl font-bold text-blue-600\">ScriptBook</h1>
    </div>
  )
}
export default App
"@ | Out-File -FilePath "src/App.tsx" -Encoding utf8

# src/main.tsx
@"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
"@ | Out-File -FilePath "src/main.tsx" -Encoding utf8

# src/index.css
@"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@ | Out-File -FilePath "src/index.css" -Encoding utf8