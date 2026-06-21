import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, Phone, ArrowRight, ShieldCheck, Brain } from 'lucide-react';

const IMAGES = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop'
];

const CAPSULAS = [
  { icon: <Brain size={24} />, title: 'Higiene del Sueño', desc: 'Dormir 7-8 horas mejora tu memoria y reduce drásticamente la ansiedad académica.' },
  { icon: <Heart size={24} />, title: 'Pausas Activas', desc: 'Por cada hora de estudio, descansa 10 minutos lejos de la pantalla para evitar el burnout.' },
  { icon: <ShieldCheck size={24} />, title: 'Hablar Sana', desc: 'Expresar lo que sientes no es debilidad. Busca a un amigo, mentor o profesional.' }
];

export default function Landing() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* NAVBAR */}
      <nav className="fixed w-full bg-black/90 backdrop-blur-sm z-50 px-6 py-4 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-[#cc0000] px-3 py-1 rounded text-white font-bold text-xl tracking-wider">INAE</div>
          <span className="text-white/80 hidden md:block text-sm font-medium tracking-wide">INACAP</span>
        </div>
        <Link 
          to="/login" 
          className="bg-[#cc0000] hover:bg-[#990000] text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          Iniciar Sesión <ArrowRight size={18} />
        </Link>
      </nav>

      {/* HERO SECTION CON CARRUSEL */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {IMAGES.map((img, index) => (
          <img 
            key={index}
            src={img}
            alt={`Fondo ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#1a1a1a]"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <div className="inline-block bg-[#cc0000] text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-6">
            PLATAFORMA DE BIENESTAR ESTUDIANTIL
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            No tienes que hacerlo <span className="text-[#ff4d4d]">solo.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Te acompañamos en tu vida académica con herramientas de salud mental, mentores y un espacio seguro 100% confidencial.
          </p>
          <Link 
            to="/login"
            className="inline-flex justify-center items-center gap-2 bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105"
          >
            Ingresar a la plataforma
          </Link>
        </div>
      </section>

      {/* SECCIÓN: AUXILIO PSICOLÓGICO INACAP */}
      <section className="py-20 px-6 bg-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-10">
            <div className="w-1.5 h-10 bg-[#cc0000] mr-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Auxilio psicológico</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-gray-800 font-semibold mb-4 text-lg">Línea de prevención del suicidio:</h3>
                <div className="flex items-center gap-4 mb-2 border-l-2 border-[#cc0000] pl-4">
                  <Phone className="text-[#cc0000] fill-[#cc0000]" size={24} />
                  <span className="text-4xl font-bold text-gray-900">*4141</span>
                </div>
                <p className="text-gray-600 text-sm mb-6 pl-4 font-medium">"No estás solo, no estás sola"</p>
              </div>
              <ul className="space-y-3 text-sm text-gray-700 list-disc pl-6 marker:text-gray-400">
                <li>Gratuito</li>
                <li>Atención 24/7</li>
                <li>Más información aquí: *4141</li>
              </ul>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-gray-800 font-semibold mb-4 text-lg">Fono Salud Responde:</h3>
                <div className="flex items-center gap-4 mb-8 border-l-2 border-[#cc0000] pl-4">
                  <Phone className="text-[#cc0000] fill-[#cc0000]" size={24} />
                  <span className="text-3xl font-bold text-gray-900">600 360 7777</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-gray-700 list-disc pl-6 marker:text-gray-400">
                <li>Gratuita</li>
                <li>Informan, orientan, apoyan y educan sobre temas generales de salud</li>
                <li>Atención las 24/7</li>
                <li>Más información aquí: Salud responde</li>
              </ul>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-gray-800 font-semibold mb-4 text-lg">En línea contigo:</h3>
                <div className="flex items-center gap-4 mb-2 border-l-2 border-[#cc0000] pl-4">
                  <Phone className="text-[#cc0000] fill-[#cc0000]" size={24} />
                  <span className="text-3xl font-bold text-gray-900">22 820 3429</span>
                </div>
                <p className="text-gray-600 text-sm mb-6 pl-4 font-medium">* GEA Chile</p>
              </div>
              <ul className="space-y-3 text-sm text-gray-700 list-disc pl-6 marker:text-gray-400">
                <li>Atención telefónica gratuita</li>
                <li>Contención emocional de emergencia, ideación o intento suicida</li>
                <li>Atención las 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: CÁPSULAS DE BIENESTAR */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cápsulas de Bienestar</h2>
            <p className="text-gray-500 text-lg">Consejos rápidos para cuidar tu mente y cuerpo todos los días.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CAPSULAS.map((capsula, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#cc0000]/10 text-[#cc0000] rounded-xl flex items-center justify-center mb-6">
                  {capsula.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{capsula.title}</h3>
                <p className="text-gray-600 leading-relaxed">{capsula.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: QUÉ ENCONTRARÁS ADENTRO */}
      <section className="py-20 px-6 bg-[#1a1a1a] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">¿Qué encontrarás en INAE?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <Heart size={48} className="text-[#ff4d4d] mb-4" />
              <h3 className="text-xl font-bold mb-2">Monitor Emocional</h3>
              <p className="text-gray-400">Registra cómo te sientes día a día para entender tus patrones y recibir recomendaciones.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Calendar size={48} className="text-[#ff4d4d] mb-4" />
              <h3 className="text-xl font-bold mb-2">Agenda Activa</h3>
              <p className="text-gray-400">Coordina citas de forma rápida y confidencial con profesionales del área de apoyo estudiantil.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users size={48} className="text-[#ff4d4d] mb-4" />
              <h3 className="text-xl font-bold mb-2">Red de Mentores</h3>
              <p className="text-gray-400">Conecta con estudiantes capacitados para orientarte y escucharte.</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}