import { useRef, useState } from "react"
import jsPDF from "jspdf"

export default function Home() {
  const [texto, setTexto] = useState("")
  const [gravando, setGravando] = useState(false)

  const recognitionRef = useRef(null)

  function controlarMicrofone() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz")
      return
    }

    if (gravando && recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      setGravando(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "pt-BR"
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => setGravando(true)

    recognition.onresult = (event) => {
      let textoFinal = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          textoFinal += event.results[i][0].transcript + " "
        }
      }

      if (textoFinal) {
        setTexto((prev) => prev + textoFinal)
      }
    }

    recognition.onend = () => setGravando(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  function copiarTexto() {
    navigator.clipboard.writeText(texto)
  }

  function limparTexto() {
    setTexto("")
  }

  function baixarPDF() {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("OuçaPorMim - Transcrição", 10, 20)

    const linhas = doc.splitTextToSize(texto, 180)
    doc.setFontSize(12)
    doc.text(linhas, 10, 40)

    doc.save("transcricao.pdf")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col items-center p-6">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-6">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-pink-600">🎤 OuçaPorMim</h1>
          <p className="text-gray-500">Transcrição em tempo real</p>
        </div>

        {/* TEXT AREA */}
        <div className="bg-gray-50 border rounded-2xl p-4 min-h-[250px] mb-6 overflow-auto">
          {texto ? (
            <p className="text-gray-700 whitespace-pre-wrap leading-7">
              {texto}
            </p>
          ) : (
            <p className="text-gray-400 text-center mt-20">
              Nenhuma transcrição ainda...
            </p>
          )}
        </div>

        {/* MICROFONE */}
        <div className="flex flex-col items-center mb-6">
          <button
            onClick={controlarMicrofone}
            className={`w-20 h-20 rounded-full text-white text-3xl shadow-lg transition
              ${gravando ? "bg-red-500 animate-pulse" : "bg-pink-500"}
            `}
          >
            🎤
          </button>

          <p className="mt-2 text-gray-600">
            {gravando ? "Gravando..." : "Clique para iniciar"}
          </p>
        </div>

        {/* BOTÕES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button onClick={copiarTexto} className="bg-blue-500 text-white py-3 rounded-xl">
            Copiar
          </button>

          <button onClick={limparTexto} className="bg-red-500 text-white py-3 rounded-xl">
            Limpar
          </button>

          <button onClick={baixarPDF} className="bg-green-500 text-white py-3 rounded-xl">
            PDF
          </button>
        </div>

      </div>
    </div>
  )
}
