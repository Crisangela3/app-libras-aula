import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from "jspdf";
// IMPORTAÇÃO COMPLETA DOS ÍCONES (O QUE ESTAVA CAUSANDO A TELA BRANCA)
import { 
  Mic, MicOff, Trash2, X, HelpCircle, Monitor, 
  FileText, FolderOpen, Calendar, HeartPulse, 
  Linkedin, Github, Mail, MapPin 
} from 'lucide-react';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [interimText, setInterimText] = useState("");
  const [useMode, setUseMode] = useState("Aula/Palestra");
  const [showRegisterStep, setShowRegisterStep] = useState(0); 
  const [showHelp, setShowHelp] = useState(false);
  
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);
  const lastFinalTranscriptRef = useRef("");

  const colors = { ciano: "#00BCD4", gold: "#D4AF37", beige: "#F5F5DC", red: "#FF4B4B" };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event) => {
        let final = "";
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            if (transcript.trim() !== lastFinalTranscriptRef.current.trim()) {
              final += transcript + " ";
              lastFinalTranscriptRef.current = transcript;
            }
          } else {
            interim += transcript;
          }
        }
        if (final !== "") {
          setTranscription((prev) => prev + final);
          setInterimText("");
        } else {
          setInterimText(interim);
        }
      };

      recognitionRef.current.onend = () => {
        if (isRecordingRef.current) recognitionRef.current.start();
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      isRecordingRef.current = false;
      setIsRecording(false);
      recognitionRef.current?.stop();
    } else {
      isRecordingRef.current = true;
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(transcription, 180);
    doc.text(splitText, 10, 20);
    doc.save(`transcricao_oucapormim.pdf`);
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #B2EBF2', fontSize: '13px', marginBottom: '8px', outline: 'none' };

  return (
    <div style={{ backgroundColor: colors.beige, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: colors.ciano, padding: '6px', borderRadius: '10px' }}><Mic size={20} color="white" /></div>
          <span style={{ fontSize: '22px', fontWeight: '900', color: colors.ciano }}>OuçaPorMim</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => setShowHelp(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.ciano, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            <HelpCircle size={24} /> AJUDA
          </button>
          <button onClick={() => setShowRegisterStep(1)} style={{ backgroundColor: colors.ciano, color: 'white', padding: '10px 25px', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>CADASTRAR</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '1350px', width: '100%', margin: '0 auto', padding: '30px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '25px', flex: 1 }}>
        
        {/* ÁREA DE TRANSCRIÇÃO */}
        <section style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', borderBottom: `5px solid ${colors.ciano}`, display: 'flex', flexDirection: 'column', height: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <select value={useMode} onChange={(e) => setUseMode(e.target.value)} style={{ padding: '8px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '15px', fontWeight: 'bold' }}>
                    <option value="Aula/Palestra">🎙️ Aula / Palestra</option>
                </select>
                <button onClick={() => {setTranscription(""); lastFinalTranscriptRef.current = "";}} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={24} color={colors.red}/></button>
            </div>
            
            <div style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: '20px', padding: '25px', fontSize: '20px', border: '1px solid #eee', overflowY: 'auto' }}>
                {transcription}
                <span style={{ color: colors.ciano, opacity: 0.6 }}>{interimText}</span>
                {!transcription && !interimText && <p style={{color: '#ccc', textAlign: 'center', marginTop: '120px'}}>Sistema pronto. Acione o microfone para ouvir a aula.</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                <button onClick={() => navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })} style={{ background: 'none', border: `2px solid ${colors.ciano}`, color: colors.ciano, padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <Monitor size={18} /> CONECTAR ÁUDIO DO MEET
                </button>
                <button onClick={toggleRecording} style={{ backgroundColor: isRecording ? colors.red : colors.ciano, width: '70px', height: '70px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {isRecording ? <MicOff size={30} color="white" /> : <Mic size={30} color="white" />}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <button style={{ backgroundColor: colors.gold, color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>SALVAR NO HISTÓRICO</button>
                <button onClick={generatePDF} style={{ backgroundColor: 'white', color: colors.gold, padding: '15px', borderRadius: '12px', border: `2px solid ${colors.gold}`, fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                  <FileText size={20} /> GERAR PDF
                </button>
            </div>
        </section>

        {/* PAINEL LATERAL */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '650px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', borderBottom: `5px solid ${colors.gold}`, flex: 1 }}>
                <h3 style={{ color: colors.gold, fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Calendar size={18}/> RECENTES (ATÉ 7 DIAS)
                </h3>
                <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '12px', backgroundColor: '#fcfcfc' }}>
                  <span style={{ fontSize: '11px', color: colors.ciano, fontWeight: 'bold' }}>09/05/2026</span>
                  <p style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: 'bold' }}>Aula de hoje - Exemplo</p>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', borderBottom: `4px solid ${colors.ciano}`, textAlign: 'center' }}>
                    <FolderOpen size={24} color={colors.gold} style={{margin:'0 auto'}}/>
                    <span style={{fontSize:'11px', fontWeight:'bold', display:'block', marginTop:8}}>AULAS ANTIGAS</span>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', borderBottom: `4px solid ${colors.ciano}`, textAlign: 'center' }}>
                    <HeartPulse size={24} color={colors.red} style={{margin:'0 auto'}}/>
                    <span style={{fontSize:'11px', fontWeight:'bold', display:'block', marginTop:8}}>PASTA MÉDICA</span>
                </div>
            </div>
        </aside>
      </main>

      {/* RODAPÉ DO PROJETO - FINAL E AJUSTADO */}
      <footer style={{ backgroundColor: 'white', padding: '20px 40px', borderTop: '1px solid #eee', marginTop: '20px' }}>
          <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontWeight: '900', color: colors.ciano, fontSize: '16px' }}>OuçaPorMim</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>© 2026 - Desenvolvido por <b>Angela Cristina Silva Pinto</b></p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px', fontSize: '12px', color: '#888' }}>
                      <MapPin size={12} color={colors.gold} /> Santo André - SP
                  </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <a href="mailto:projeto.oucapormim@gmail.com" title="Enviar E-mail" style={{ color: colors.ciano }}><Mail size={22} /></a>
                  <a href="https://www.linkedin.com/in/angela-cristina-silva-b40451108/" target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: colors.ciano }}><Linkedin size={22} /></a>
                  <a href="https://github.com/Crisangela3" target="_blank" rel="noreferrer" title="GitHub" style={{ color: colors.ciano }}><Github size={22} /></a>
              </div>
          </div>
      </footer>

      {/* MODAL DE AJUDA */}
      {showHelp && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '35px', maxWidth: '850px', width: '90%', position: 'relative' }}>
            <button onClick={() => setShowHelp(false)} style={{ position: 'absolute', top: '25px', right: '25px', border: 'none', background: '#f5f5f5', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ color: colors.ciano, textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: '900' }}>Guia de Uso - OuçaPorMim</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div style={{ fontSize: '14px', color: '#444', textAlign: 'left' }}>
                <h4 style={{ color: colors.gold, marginBottom: '20px', fontWeight: 'bold' }}>〉FUNCIONAMENTO DOS BOTÕES</h4>
                <p style={{marginBottom:'10px'}}><b>💻 Conectar Áudio do Meet:</b> Capture áudio de aulas online.</p>
                <p style={{marginBottom:'10px'}}><b>🎙️ Microfone Central:</b> Clique no círculo azul para iniciar a escuta.</p>
                <p style={{marginBottom:'10px'}}><b>🗑️ Lixeira:</b> Limpa o texto da tela.</p>
                <p><b>📄 Gerar PDF:</b> Baixa a aula transcrita.</p>
              </div>
              <div style={{ fontSize: '14px', color: '#444', textAlign: 'left' }}>
                <h4 style={{ color: colors.gold, marginBottom: '20px', fontWeight: 'bold' }}>〉REGRAS DO CADASTRO</h4>
                <div style={{ backgroundColor: '#FFFBE6', padding: '25px', borderRadius: '25px' }}>
                  <p>Para <b>Uso Ilimitado</b>, preencha o RA completo com o dígito. Enviaremos um código por e-mail para validar.</p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowHelp(false)} style={{ backgroundColor: colors.ciano, color: 'white', width: '100%', padding: '18px', borderRadius: '20px', border: 'none', fontWeight: '900', fontSize: '16px', marginTop: '30px', cursor: 'pointer' }}>ENTENDI TUDO!</button>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO */}
      {showRegisterStep === 2 && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '35px', width: '90%', maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setShowRegisterStep(0)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#f5f5f5', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}><X size={24} color="#666" /></button>
            <h3 style={{ color: colors.ciano, textAlign: 'center', marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>Perfil do Usuário</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("Cadastro simulado com sucesso!"); setShowRegisterStep(0); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div>
                  <p style={{ color: colors.ciano, fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>👥 DADOS PESSOAIS</p>
                  <input placeholder="Nome Completo do Aluno" required style={inputStyle} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}><input placeholder="CPF ou RG" required style={inputStyle} /><input placeholder="Celular" required style={inputStyle} /></div>
                  <input placeholder="E-mail principal" required style={inputStyle} />
                </div>
                <div>
                  <p style={{ color: colors.ciano, fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>🎓 PERFIL ACADÊMICO</p>
                  <input placeholder="Nome da Escola" required style={inputStyle} />
                  <input placeholder="RA" required style={inputStyle} />
                </div>
              </div>
              <button type="submit" style={{ backgroundColor: colors.ciano, color: 'white', width: '100%', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '16px', marginTop: '25px', cursor: 'pointer' }}>FINALIZAR CADASTRO</button>
            </form>
          </div>
        </div>
      )}

      {/* LOGIN */}
      {showRegisterStep === 1 && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '30px', width: '380px', textAlign: 'center' }}>
            <h2 style={{ color: colors.ciano, marginBottom: '25px', fontSize: '22px' }}>Acesso</h2>
            <input placeholder="E-mail" style={inputStyle} />
            <input type="password" placeholder="Senha" style={inputStyle} />
            <button onClick={() => setShowRegisterStep(2)} style={{ backgroundColor: colors.ciano, color: 'white', width: '100%', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>ENTRAR</button>
            <div style={{marginTop: '20px'}}><button onClick={() => setShowRegisterStep(0)} style={{ border: 'none', background: 'none', color: '#999', cursor: 'pointer', fontSize: '13px' }}>Fechar</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;