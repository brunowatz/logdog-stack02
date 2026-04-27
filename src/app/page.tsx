'use client';

import Link from 'next/link';
import { 
  Truck, 
  Sparkles, 
  Package, 
  MapPin, 
  Clock, 
  Star,
  CheckCircle2,
  Store,
  Scissors,
  Droplets,
  Wind,
  Phone,
  HeartPulse
} from 'lucide-react';

const WHATSAPP_URL = "https://wa.me/5544999999999?text=Olá! Gostaria de receber o catálogo de cosméticos da Log Dog e fazer um pedido.";

export default function LandingPage() {
  return (
    <div className="landing-wrapper" style={{
      backgroundColor: '#FAFAFF',
      color: '#0F172A',
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '80px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        borderBottom: '1px solid #F1F5F9',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '44px', height: '44px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', color: 'white',
            boxShadow: '0 4px 10px rgba(109, 40, 217, 0.2)'
          }}>🐕</div>
          <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', color: '#1E293B' }}>Log Dog</span>
        </div>
        
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#diferenciais" className="hide-mobile" style={{ fontWeight: '600', fontSize: '15px', color: '#475569', textDecoration: 'none' }}>Vantagens</a>
          <a href="#produtos" className="hide-mobile" style={{ fontWeight: '600', fontSize: '15px', color: '#475569', textDecoration: 'none' }}>Catálogo</a>
          <a href="#como-funciona" className="hide-mobile" style={{ fontWeight: '600', fontSize: '15px', color: '#475569', textDecoration: 'none' }}>Como Funciona</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{
            backgroundColor: '#25D366',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '15px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}>
            <Phone size={18} /> <span className="hide-mobile-small">Pedir no WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        paddingLeft: '5%',
        paddingRight: '5%',
        textAlign: 'center',
        background: 'radial-gradient(circle at center top, rgba(139, 92, 246, 0.08), transparent 60%)',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F3E8FF',
          color: '#7C3AED',
          padding: '8px 16px',
          borderRadius: '100px',
          fontSize: '14px',
          fontWeight: '700',
          marginBottom: '24px',
          border: '1px solid #E9D5FF'
        }}>
          <Clock size={16} /> Entrega no mesmo dia em Maringá 🚀
        </div>
        
        <h1 className="hero-title" style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: '900',
          lineHeight: '1.1',
          marginBottom: '24px',
          letterSpacing: '-1.5px',
          maxWidth: '900px',
          margin: '0 auto 24px',
          color: '#0F172A'
        }}>
          A Cosmética Animal <span style={{ color: '#7C3AED' }}>Premium</span> para o seu Pet Shop
        </h1>
        
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: '#475569',
          maxWidth: '700px',
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Abasteça sua clínica, pet shop ou centro de estética com a Log Dog. Produtos de alta performance, entrega super rápida e suporte especializado para profissionais.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-hero" style={{
            backgroundColor: '#25D366',
            color: 'white',
            padding: '18px 36px',
            borderRadius: '16px',
            fontWeight: '800',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)'
          }}>
            Fazer Pedido no WhatsApp
          </a>
          <a href="#produtos" style={{
            backgroundColor: 'white',
            border: '2px solid #E2E8F0',
            color: '#1E293B',
            padding: '18px 36px',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '18px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
            Ver Catálogo
          </a>
        </div>
      </section>

      {/* Diferenciais (Value Proposition) */}
      <section id="diferenciais" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {[
            { icon: Truck, color: '#7C3AED', bg: '#F3E8FF', title: 'Entrega Expressa', desc: 'Sediados em Maringá, garantimos entrega no mesmo dia para pedidos locais e envio ultra-rápido para a região.' },
            { icon: Sparkles, color: '#10B981', bg: '#D1FAE5', title: 'Alta Qualidade', desc: 'Trabalhamos apenas com linhas profissionais focadas em rendimento, brilho e saúde da pelagem.' },
            { icon: HeartPulse, color: '#F43F5E', bg: '#FFE4E6', title: 'Atendimento Especializado', desc: 'Nossa equipe entende de banho e tosa. Ajudamos você a escolher o produto exato para a sua necessidade.' }
          ].map((item, i) => (
            <div key={i} style={{
              backgroundColor: 'white',
              padding: '40px 32px',
              borderRadius: '24px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
              border: '1px solid #F1F5F9'
            }}>
              <div style={{
                width: '56px', height: '56px',
                backgroundColor: item.bg,
                color: item.color,
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <item.icon size={28} />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#0F172A' }}>{item.title}</h3>
              <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '16px' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" style={{ padding: '100px 5%', backgroundColor: '#F8FAFC' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: '#7C3AED', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px' }}>Nosso Catálogo</span>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', marginTop: '12px', color: '#0F172A' }}>Tudo para o Banho Perfeito</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { title: 'Shampoos', desc: 'Alto rendimento, limpeza profunda e fórmulas hipoalergênicas.', icon: Droplets },
            { title: 'Condicionadores', desc: 'Hidratação intensa e facilidade no desembolo.', icon: Sparkles },
            { title: 'Perfumes', desc: 'Fragrâncias de longa duração que encantam os tutores.', icon: Wind },
            { title: 'Linha Profissional', desc: 'Galões de 5L, queratina, máscaras e finalizadores.', icon: Package }
          ].map((prod, i) => (
            <div key={i} className="hover-card" style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div style={{
                width: '64px', height: '64px',
                backgroundColor: '#F3E8FF',
                color: '#7C3AED',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <prod.icon size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>{prod.title}</h3>
              <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.5' }}>{prod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Para Quem É */}
      <section style={{ padding: '100px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '20px', color: '#0F172A' }}>Parceiro do Empreendedor Pet</h2>
          <p style={{ color: '#475569', fontSize: '18px', maxWidth: '600px' }}>Atendemos todos os tamanhos de negócio com a mesma dedicação.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          {[
            { icon: Store, title: 'Pet Shops', color: '#8B5CF6' },
            { icon: CheckCircle2, title: 'Clínicas Veterinárias', color: '#10B981' },
            { icon: Scissors, title: 'Banho e Tosa', color: '#F59E0B' },
            { icon: MapPin, title: 'Profissionais Autônomos', color: '#3B82F6' }
          ].map((target, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '32px 20px',
              backgroundColor: 'white',
              borderRadius: '20px',
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <target.icon size={40} color={target.color} style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>{target.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" style={{ padding: '100px 5%', backgroundColor: '#0F172A', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '16px' }}>Como pedir seus produtos?</h2>
            <p style={{ color: '#94A3B8', fontSize: '18px' }}>Processo simples, rápido e direto pelo WhatsApp.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            position: 'relative'
          }}>
            {[
              { step: '1', title: 'Solicite o Catálogo', desc: 'Clique no botão do WhatsApp e nos mande um oi. Enviaremos a tabela de preços atualizada.' },
              { step: '2', title: 'Escolha os Produtos', desc: 'Tire dúvidas com nossos especialistas e selecione os itens perfeitos para o seu negócio.' },
              { step: '3', title: 'Receba na Loja', desc: 'Em Maringá, entregamos no mesmo dia. Para a região, despachamos com agilidade.' }
            ].map((item, i) => (
              <div key={i} style={{
                position: 'relative',
                padding: '40px 32px',
                backgroundColor: '#1E293B',
                borderRadius: '24px',
                border: '1px solid #334155'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '32px',
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#7C3AED',
                  color: 'white',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', fontWeight: '900',
                  boxShadow: '0 8px 16px rgba(124, 58, 237, 0.4)'
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', marginTop: '12px' }}>{item.title}</h3>
                <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section style={{ padding: '100px 5%', backgroundColor: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', textAlign: 'center', marginBottom: '60px', color: '#0F172A' }}>
            O que dizem na região
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {[
              { name: 'Carlos Almeida', role: 'Pet Shop Cão & Cia (Maringá)', text: 'A Log Dog salvou meu fim de semana! O estoque de shampoo zerou e eles entregaram em 2 horas. Parceria forte!' },
              { name: 'Ana Oliveira', role: 'Estética Animal Vip', text: 'Os perfumes da linha premium que comprei com eles fidelizaram muitos clientes. O atendimento pelo WhatsApp é muito prático.' }
            ].map((dep, i) => (
              <div key={i} style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', color: '#F59E0B' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} fill="currentColor" size={20} />)}
                </div>
                <p style={{ fontSize: '16px', color: '#334155', lineHeight: '1.7', marginBottom: '24px', fontStyle: 'italic' }}>
                  "{dep.text}"
                </p>
                <div>
                  <div style={{ fontWeight: '800', color: '#0F172A' }}>{dep.name}</div>
                  <div style={{ fontSize: '14px', color: '#64748B' }}>{dep.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{
        margin: '60px 5% 100px',
        padding: '80px 5%',
        background: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
        borderRadius: '32px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 20px 40px rgba(109, 40, 217, 0.3)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#FDE047',
          color: '#854D0E',
          padding: '6px 16px',
          borderRadius: '100px',
          fontSize: '14px',
          fontWeight: '800',
          marginBottom: '32px'
        }}>
          ESTOQUE DISPONÍVEL
        </div>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', marginBottom: '24px', letterSpacing: '-1px' }}>
          Não deixe seu centro de estética parar!
        </h2>
        <p style={{ fontSize: '18px', marginBottom: '48px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 48px' }}>
          Peça agora e garanta os melhores produtos do mercado chegando rapidamente na sua loja.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-hero" style={{
          backgroundColor: '#25D366',
          color: 'white',
          padding: '20px 48px',
          borderRadius: '16px',
          fontWeight: '800',
          fontSize: '20px',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)'
        }}>
          <Phone size={24} /> Peça agora pelo WhatsApp
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 5% 40px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto 60px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{
                width: '32px', height: '32px',
                background: '#7C3AED',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', color: 'white'
              }}>🐕</div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>Log Dog</span>
            </div>
            <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Distribuidora especializada em cosmética animal. Qualidade e rapidez para quem leva banho e tosa a sério.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontWeight: '800', marginBottom: '24px', color: '#0F172A' }}>Contato</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px', color: '#64748B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} color="#7C3AED" /> (44) 99999-9999
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={18} color="#7C3AED" /> Maringá e Região - PR
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontWeight: '800', marginBottom: '24px', color: '#0F172A' }}>Acesso Exclusivo</h4>
            <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '16px' }}>
              Área restrita para vendedores e gestão.
            </p>
            <Link href="/login" style={{
              color: '#7C3AED', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              Acessar Painel Log Dog &rarr;
            </Link>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', paddingTop: '32px', borderTop: '1px solid #F1F5F9', fontSize: '14px', color: '#94A3B8' }}>
          © {new Date().getFullYear()} Log Dog Distribuidora. Todos os direitos reservados.
        </div>
      </footer>

      {/* Global & Hover Styles */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.04) !important;
          border-color: #C4B5FD !important;
        }
        .btn-whatsapp:hover, .btn-hero:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 30px rgba(37, 211, 102, 0.5) !important;
        }
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
          .hero-title {
            font-size: 40px !important;
          }
        }
        @media (max-width: 480px) {
          .hide-mobile-small {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
