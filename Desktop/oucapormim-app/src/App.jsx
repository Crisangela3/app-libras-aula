import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from "jspdf";
import { Mic, MicOff, Trash2, X, HelpCircle, Monitor, FileText, User, GraduationCap, FolderOpen, Calendar, HeartPulse, ChevronRight, Users } from 'lucide-react';

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
      
      {/* HEADER (Imagem 10/11) */}
      <header style={{ backgroundColor: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* MAIN CONTENT (Imagem 10/11) */}
      <main style={{ maxWidth: '1350px', width: '100%', margin: '0 auto', padding: '30px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '25px', flex: 1 }}>
        
        {/* ÁREA DE TRANSCRIÇÃO */}
        <section style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', borderBottom: `5px solid ${colors.ciano}`, display: 'flex', flexDirection: 'column', height: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <select value={useMode} onChange={(e) => setUseMode(e.target.value)} style={{ padding: '8px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '15px', fontWeight: 'bold' }}>
                    <option value="Aula/Palestra">🎙️ Aula / Palestra</option>
                </select>
                <button onClick={() => {setTranscription(""); lastFinalTranscriptRef.current = "";}} style={{ border: 'none', background: 'none' }}><Trash2 size={24} color={colors.red}/></button>
            </div>
            
            <div style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: '20px', padding: '25px', fontSize: '20px', border: '1px solid #eee', overflowY: 'auto' }}>
                {transcription}
                <span style={{ color: colors.ciano, opacity: 0.6 }}>{interimText}</span>
                {!transcription && !interimText && <p style={{color: '#ccc', textAlign: 'center', marginTop: '120px'}}>Sistema pronto. Acione o microfone para ouvir a aula.</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                <button onClick={() => navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })} style={{ background: 'none', border: `2px solid ${colors.ciano}`, color: colors.ciano, padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Monitor size={18} /> CONECTAR ÁUDIO DO MEET
                </button>
                <button onClick={toggleRecording} style={{ backgroundColor: isRecording ? colors.red : colors.ciano, width: '70px', height: '70px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {isRecording ? <MicOff size={30} color="white" /> : <Mic size={30} color="white" />}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <button style={{ backgroundColor: colors.gold, color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '15px' }}>SALVAR NO HISTÓRICO</button>
                <button onClick={generatePDF} style={{ backgroundColor: 'white', color: colors.gold, padding: '15px', borderRadius: '12px', border: `2px solid ${colors.gold}`, fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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

      {/* MODAL DE AJUDA (IDÊNTICO À IMAGEM 8) */}
      {showHelp && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '35px', maxWidth: '850px', width: '90%', position: 'relative' }}>
            <button onClick={() => setShowHelp(false)} style={{ position: 'absolute', top: '25px', right: '25px', border: 'none', background: '#f5f5f5', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ color: colors.ciano, textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: '900' }}>Guia de Uso - OuçaPorMim</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div style={{ fontSize: '14px', color: '#444', textAlign: 'left' }}>
                <h4 style={{ color: colors.gold, marginBottom: '20px', fontWeight: 'bold' }}>〉FUNCIONAMENTO DOS BOTÕES</h4>
                <p style={{marginBottom:'10px'}}><b>💻 Conectar Áudio do Meet:</b> Use este botão quando estiver em uma aula online. Ele abrirá uma janela para você compartilhar a aba do Meet e capturar a fala do professor com clareza.</p>
                <p style={{marginBottom:'10px'}}><b>🎙️ Microfone Central:</b> Clique no círculo azul para iniciar a escuta de conversas aleatórias ou presenciais. Clique novamente (ficará vermelho) para pausar.</p>
                <p style={{marginBottom:'10px'}}><b>🗑️ Lixeira:</b> Serve para limpar todo o texto da tela atual caso você queira começar uma nova anotação sem salvar.</p>
                <p><b>📄 Gerar PDF:</b> Transforma tudo o que foi escrito em um arquivo que você pode baixar e estudar depois.</p>
              </div>
              <div style={{ fontSize: '14px', color: '#444', textAlign: 'left' }}>
                <h4 style={{ color: colors.gold, marginBottom: '20px', fontWeight: 'bold' }}>〉REGRAS DO CADASTRO (IMPORTANTE)</h4>
                <div style={{ backgroundColor: '#FFFBE6', padding: '25px', borderRadius: '25px', border: 'none' }}>
                  <p>Para o <b>Uso Ilimitado</b>, preencha o cadastro com atenção total:</p>
                  <ul style={{ paddingLeft: '20px', marginTop: '15px' }}>
                    <li style={{marginBottom:'8px'}}><b>RA do Aluno:</b> É obrigatório conter o número completo <b>mais o dígito</b>.</li>
                    <li style={{marginBottom:'8px'}}><b>Documentos:</b> CPF e RG não podem ter números faltando.</li>
                    <li style={{marginBottom:'8px'}}><b>Endereços:</b> Verifique se o CEP e o endereço (seu e da escola) estão corretos.</li>
                    <li><b>Código:</b> Após validar seus dados, enviaremos um código para seu <b>e-mail</b>. Digite-o no seu perfil para liberar todas as funções.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: '#E0F7FA', padding: '20px', borderRadius: '25px', marginTop: '30px', fontSize: '13px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <FolderOpen color={colors.gold} size={40}/>
                <p><b>Como suas aulas são organizadas?</b> As aulas da semana aparecem no topo do painel lateral. Após 7 dias ou ao atingir 10 aulas, elas são movidas para as <b>Pastas de Antigas</b> ou <b>Pasta Médica</b> (dependendo do modo que você selecionou no topo da tela). Assim, nada fica bagunçado!</p>
            </div>
            <button onClick={() => setShowHelp(false)} style={{ backgroundColor: colors.ciano, color: 'white', width: '100%', padding: '18px', borderRadius: '20px', border: 'none', fontWeight: '900', fontSize: '16px', marginTop: '30px', cursor: 'pointer' }}>ENTENDI TUDO E QUERO COMEÇAR!</button>
          </div>
        </div>
      )}

      {/* CADASTRO (Imagem 5) */}
      {showRegisterStep === 2 && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '35px', width: '90%', maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setShowRegisterStep(0)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#f5f5f5', borderRadius: '50%', padding: '10px', cursor: 'pointer' }}><X size={24} color="#666" /></button>
            <h3 style={{ color: colors.ciano, textAlign: 'center', marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>Perfil do Usuário</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("Cadastro finalizado! O código foi enviado ao seu e-mail."); setShowRegisterStep(0); }}>
              <form action="https://formspree.io/f/mlgzpqga" method="POST"></form>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div>
                  <p style={{ color: colors.ciano, fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>👥 DADOS PESSOAIS</p>
                  <input placeholder="Nome Completo do Aluno" required style={inputStyle} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}><input placeholder="CPF ou RG" required style={inputStyle} /><input placeholder="Celular/WhatsApp" required style={inputStyle} /></div>
                  <input placeholder="E-mail principal" required style={inputStyle} />
                  <input placeholder="CEP" style={inputStyle} />
                  <input placeholder="Endereço (Rua e Número)" style={inputStyle} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}><input placeholder="Bairro" style={inputStyle} /><input placeholder="Cidade" style={inputStyle} /></div>
                  <p style={{ color: colors.ciano, fontSize: '13px', fontWeight: 'bold', marginTop: '15px', marginBottom: '10px' }}>🤱 RESPONSÁVEL (MÃE)</p>
                  <input placeholder="Nome Completo da Mãe" style={inputStyle} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}><input placeholder="CPF/RG da Mãe" style={inputStyle} /><input placeholder="WhatsApp da Mãe" style={inputStyle} /></div>
                </div>
                <div>
                  <p style={{ color: colors.ciano, fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>🎓 PERFIL ACADÊMICO</p>
                  <select style={inputStyle}><option>Ensino Fundamental I / II</option><option>Ensino Médio</option><option>Superior</option></select>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}><input placeholder="Série / ano?" style={inputStyle} /><input placeholder="RA" required style={inputStyle} /></div>
                  <div style={{ backgroundColor: '#F0F0FA', padding: '15px', borderRadius: '15px', marginTop: '10px' }}>
                    <p style={{ color: '#5C6BC0', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>DADOS DA INSTITUIÇÃO</p>
                    <input placeholder="Nome da Escola ou Faculdade" required style={inputStyle} />
                    <input placeholder="Endereço da Instituição" style={inputStyle} />
                  </div>
                  <div style={{ border: `3px dashed ${colors.ciano}`, padding: '15px', borderRadius: '15px', marginTop: '15px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: colors.ciano }}>CÓDIGO (ENVIADO POR E-MAIL)</p>
                    <input placeholder="Digite o código aqui" style={{ ...inputStyle, marginBottom: 0 }} />
                  </div>
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
            <button style={{ background: 'none', border: 'none', color: colors.ciano, fontSize: '13px', marginTop: '15px', textDecoration: 'underline', cursor: 'pointer' }}>Esqueceu sua senha? Clique aqui para recuperar via e-mail.</button>
            <div style={{marginTop: '20px'}}><button onClick={() => setShowRegisterStep(0)} style={{ border: 'none', background: 'none', color: '#999', cursor: 'pointer', fontSize: '13px' }}>Fechar</button></div>
            {/* RODAPÉ DO PROJETO */}
<footer style={{ 
  padding: '20px', 
  textAlign: 'center', 
  fontSize: '13px', 
  color: '#666', 
  backgroundColor: 'white', 
  borderTop: '1px solid #eee',
  marginTop: 'auto' // Garante que o rodapé fique no final
}}>
  <p style={{ margin: '5px 0' }}>
    © {new Date().getFullYear()} - Desenvolvido por <strong>Angela Cristina Silva Pinto</strong>
  </p>
  <p style={{ margin: '5px 0' }}>
    Contato: <a href="mailto:seuemail@gmail.com" style={{ color: colors.ciano, textDecoration: 'none' }}>projeto.oucapormim@gmail.com</a> 
  </p>
  <p style={{ fontSize: '11px', color: '#999' }}>
    Projeto focado em Acessibilidade e Educação Inclusiva.
  </p>
</footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;