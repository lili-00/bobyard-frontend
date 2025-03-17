import HomePage from './pages/HomePage'

function App() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 border-b pb-4">
        <h1 className='text-3xl text-center text-bold'>Bobyard Frontend</h1>
      </header>
      <main>
        <HomePage />
      </main>
      <footer className="mt-12 text-center text-gray-500 text-sm border-t pt-4">
        <p>Bobyard Frontend</p>
      </footer>
    </div>
  )
}

export default App
