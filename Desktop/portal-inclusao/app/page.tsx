"use client";
import { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Trash2, CheckCircle2, 
  Utensils, BookOpen, TreePine, DoorOpen, 
  Pencil, Heart, Star, Apple, Baby, 
  Droplets, User, Cloud, Car, Home, Gamepad2, 
  Smile, Frown, BatteryLow, Volume2, Volume1, VolumeX, Palette
} from 'lucide-react';

export default function PortalInclusaoV2() {
  const [aba, setAba] = useState('comunicador');
  const [texto, setTexto] = useState("CLIQUE NO MICROFONE PARA FALAR");
  const [gravando, setGravando] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState('ESSENCIAIS');
  const [volume, setVolume] = useState(1);
  const [tema, setTema] = useState('bg-[#f3f4f6]'); // Cor de fundo padrão (Creme suave)
  const [corDestaque, setCorDestaque] = useState('text-blue-500');

  const temas = [
    { nome: 'Creme', bg: 'bg-[#fdfcf0]', highlight: 'text-[#d4a373]' },
    { nome: 'Azul', bg: 'bg-[#d0e1f9]', highlight: 'text-[#4a90e2]' },
    { nome: 'Rosa', bg: 'bg-[#fce1e4]', highlight: 'text-[#e27396]' },
    { nome: 'Verde', bg: 'bg-[#e2f0cb]', highlight: 'text-[#588157]' }
  ];

  const biblioteca = {
    'ESSENCIAIS': [
      { nome: 'ÁGUA', icone: <Droplets size={50} />, cor: 'bg-[#a2d2ff]' },
      { nome: 'BANHEIRO', icone: <User size={50} />, cor: 'bg-[#bde0fe]' },
      { nome: 'AJUDA', icone: <Star size={50} />, cor: 'bg-[#ffafcc]' },
      { nome: 'DOR', icone: <BatteryLow size={50} />, cor: 'bg-[#ff8b94]' },
    ],
    'SENTIMENTOS': [
      { nome: 'FELIZ', icone: <Smile size={50} />, cor: 'bg-[#caffbf]' },
      { nome: 'TRISTE', icone: <Frown size={50} />, cor: 'bg-[#a0c4ff]' },
      { nome: 'CANSADO', icone: <Cloud size={50} />, cor: 'bg-[#bdb2ff]' },
      { nome: 'BRAVO', icone: <Heart size={50} />, cor: 'bg-[#ffadad]' },
    ],
    'ESCOLA': [
      { nome: 'LÁPIS', icone: <Pencil size={50} />, cor: 'bg-[#ffd6a5]' },
      { nome: 'LIVRO', icone: <BookOpen size={50} />, cor: 'bg-[#fdffb6]' },
      { nome: 'BRINCAR', icone: <Gamepad2 size={50} />, cor: 'bg-[#9bf6ff]' },
      { nome: 'AMIGO', icone: <Baby size={50} />, cor: 'bg-[#ffc6ff]' },
    ],
    'MUNDO': [
      { nome: 'CASA', icone: <Home size={50} />, cor: 'bg-[#f0ead6]' },
      { nome: 'CARRO', icone: <Car size={50} />, cor: 'bg-[#d1d1d1]' },
      { nome: 'SOL', icone: <Star size={50} />, cor: 'bg-[#fffffc]' },
      { nome: 'LANCHE', icone: <Apple size={50} />, cor: 'bg-[#ff8b94]' },
    ]
  };

  const [rotina, setRotina] = useState([
    { id: 1, icone: <BookOpen size={60} />, nome: 'AULA', completa: false, cor: 'bg-[#a2d2ff]' },
    { id: 2, icone: <Utensils size={60} />, nome: 'LANCHE', completa: false, cor: 'bg-[#caffbf]' },
    { id: 3, icone: <TreePine size={60} />, nome: 'PARQUE', completa: false, cor: 'bg-[#fdffb6]' },
    { id: 4, icone: <DoorOpen size={60} />, nome: 'CASA', completa: false, cor: 'bg-[#ffadad]' }
  ]);

  const falar = (t: string) => {
    if (volume === 0) return;
    const msg = new SpeechSynthesisUtterance(t);
    msg.lang = 'pt-BR';
    msg.volume = volume;
    msg.rate = 0.8; 
    window.speechSynthesis.speak(msg);
  };

  const iniciarReconhecimento = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setGravando(true);
    recognition.onend = () => setGravando(false);
    recognition.onresult = (event: any) => {
      const resultado = event.results[0][0].transcript.toUpperCase();
      setTexto(resultado);
      falar(resultado);
    };
    recognition.start();
  };

  return (
    <main className={`min-h-screen transition-colors duration-500 ${tema} p-6 font-sans text-slate-800`}>
      
      {/* Cabeçalho de Ajustes (Minimalista) */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center mb-6 gap-4 bg-white/50 p-4 rounded-3xl shadow-sm">
        <div className="flex gap-2">
          {temas.map(t => (
            <button key={t.nome} onClick={() => {setTema(t.bg); setCorDestaque(t.highlight)}} 
              className={`w-10 h-10 rounded-full border-2 border-white shadow-sm ${t.bg}`} />
          ))}
          <Palette className="ml-2 text-slate-400" />
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-2 px-4 shadow-inner">
          <button onClick={() => setVolume(0)}><VolumeX className={volume === 0 ? 'text-red-400' : 'text-slate-400'} /></button>
          <button onClick={() => setVolume(0.5)}><Volume1 className={volume === 0.5 ? 'text-blue-400' : 'text-slate-400'} /></button>
          <button onClick={() => setVolume(1)}><Volume2 className={volume === 1 ? 'text-blue-600' : 'text-slate-400'} /></button>
        </div>
      </div>

      {/* Menu Principal */}
      <nav className="max-w-6xl mx-auto flex gap-4 mb-8">
        <button onClick={() => setAba('comunicador')} className={`flex-1 py-5 rounded-3xl font-black text-xl transition-all shadow-md ${aba === 'comunicador' ? 'bg-white scale-105' : 'bg-white/30 opacity-60'}`}>VOZ + IMAGENS</button>
        <button onClick={() => setAba('rotina')} className={`flex-1 py-5 rounded-3xl font-black text-xl transition-all shadow-md ${aba === 'rotina' ? 'bg-white scale-105' : 'bg-white/30 opacity-60'}`}>MINHA ROTINA</button>
      </nav>

      {aba === 'comunicador' ? (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Tela de Texto Superior */}
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-10 shadow-xl border-b-8 border-slate-200">
            <p className={`text-4xl md:text-6xl font-black text-center uppercase tracking-tight ${corDestaque}`}>{texto}</p>
          </div>

          {/* Categorias */}
          <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
            {Object.keys(biblioteca).map(cat => (
              <button key={cat} onClick={() => setCategoriaAtiva(cat)} 
                className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-sm ${categoriaAtiva === cat ? 'bg-slate-800 text-white' : 'bg-white text-slate-500'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Cards da Biblioteca */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {biblioteca[categoriaAtiva].map(item => (
              <button key={item.nome} onClick={() => {falar(item.nome); setTexto(item.nome)}} 
                className={`${item.cor} p-8 rounded-[2.5rem] flex flex-col items-center border-4 border-white shadow-lg hover:brightness-105 active:scale-95 transition-all`}>
                <div className="text-slate-700">{item.icone}</div>
                <span className="mt-4 font-black text-2xl text-slate-800">{item.nome}</span>
              </button>
            ))}
          </div>

          {/* Controle de Voz (Professor) */}
          <div className="flex justify-center gap-6 pt-6">
            <button onClick={iniciarReconhecimento} className={`p-10 rounded-full border-4 border-white shadow-xl ${gravando ? 'bg-red-400 animate-pulse' : 'bg-white text-slate-600'}`}>
              {gravando ? <MicOff size={50} /> : <Mic size={50} />}
            </button>
            <button onClick={() => setTexto("...")} className="p-10 rounded-full bg-white border-4 border-white shadow-xl text-slate-400"><Trash2 size={50} /></button>
          </div>
        </div>
      ) : (
        /* Rotina Visual Minimalista */
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {rotina.map(card => (
            <button 
              key={card.id}
              onClick={() => {
                const novas = rotina.map(c => c.id === card.id ? {...c, completa: !c.completa} : c);
                setRotina(novas);
                falar(card.nome);
              }}
              className={`relative flex flex-col items-center justify-center p-12 rounded-[4rem] border-4 transition-all shadow-lg ${
                card.completa ? 'bg-slate-200 opacity-30 border-transparent shadow-none' : `bg-white border-white`
              }`}
            >
              <div className={`mb-6 p-4 rounded-full ${card.cor}`}>{card.icone}</div>
              <span className="text-3xl font-black text-slate-700">{card.nome}</span>
              {card.completa && <CheckCircle2 size={120} className="absolute text-green-500/80" />}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
