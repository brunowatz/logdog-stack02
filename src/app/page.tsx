'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Package, 
  BarChart3, 
  Users, 
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-container" style={{
      backgroundColor: '#FAFAF9',
      color: '#0C0A09',
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        backgroundColor: 'rgba(250, 250, 249, 0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        borderBottom: '1px solid #E7E5E4'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#1C1917',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>🐕</div>
          <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>Log Dog</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#features" style={{ fontWeight: '600', fontSize: '14px', color: '#44403C' }}>Vantagens</a>
          <a href="#products" style={{ fontWeight: '600', fontSize: '14px', color: '#44403C' }}>Catálogo</a>
          <Link href="/login" className="btn-primary" style={{
            backgroundColor: '#1C1917',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            textDecoration: 'none'
          }}>
            Entrar no Painel
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '180px',
        paddingBottom: '120px',
        paddingLeft: '5%',
        paddingRight: '5%',
        textAlign: 'center',
        background: 'radial-gradient(circle at top right, rgba(202, 138, 4, 0.05), transparent 40%)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(202, 138, 4, 0.1)',
          color: '#CA8A04',
          padding: '8px 16px',
          borderRadius: '100px',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '24px'
        }}>
          <Sparkles size={14} /> Distribuidora Premium de Cosméticos Pet
        </div>
        
        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 72px)',
          fontWeight: '900',
          lineHeight: '1.1',
          marginBottom: '24px',
          letterSpacing: '-2px',
          maxWidth: '900px',
          margin: '0 auto 24px'
        }}>
          Excelência em <span style={{ color: '#CA8A04' }}>Estética Animal</span> para o seu Negócio
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#57534E',
          maxWidth: '650px',
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Abasteça seu pet shop ou clínica com a linha profissional mais desejada do mercado. Tecnologia de ponta em higiene e bem-estar.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/login" style={{
            backgroundColor: '#1C1917',
            color: 'white',
            padding: '20px 40px',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'transform 0.2s ease',
            textDecoration: 'none'
          }}>
            Acessar Catálogo <ArrowRight size={20} />
          </Link>
          <button style={{
            backgroundColor: 'white',
            border: '1px solid #D6D3D1',
            color: '#1C1917',
            padding: '20px 40px',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '18px',
            cursor: 'pointer'
          }}>
            Falar com Consultor
          </button>
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section style={{
        padding: '0 5% 120px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {[
          { icon: ShieldCheck, label: 'Produtos Certificados', value: '100%' },
          { icon: Users, label: 'Parceiros Ativos', value: '500+' },
          { icon: Truck, label: 'Cidades Atendidas', value: '120+' },
          { icon: Sparkles, label: 'Linhas Exclusivas', value: '12' }
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#F5F5F4', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#CA8A04'
            }}>
              <stat.icon size={24} />
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '14px', color: '#78716C', fontWeight: '600' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Bento Grid */}
      <section id="features" style={{ padding: '100px 5% 120px', backgroundColor: '#1C1917', color: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>Gestão Inteligente de Estoque</h2>
          <p style={{ color: '#A8A29E', fontSize: '18px' }}>Muito mais que uma distribuidora, somos seu parceiro estratégico.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: 'minmax(200px, auto)',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Card 1 */}
          <div style={{
            gridColumn: 'span 8',
            backgroundColor: '#262626',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <BarChart3 size={40} color="#CA8A04" style={{ marginBottom: '24px' }} />
              <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>IA de Reposição</h3>
              <p style={{ color: '#A8A29E', fontSize: '16px', maxWidth: '400px' }}>
                Nosso sistema avisa quando seu estoque está baixo com base no seu ritmo de vendas, garantindo que você nunca perca um cliente.
              </p>
            </div>
            <div style={{
              position: 'absolute',
              right: '-40px',
              bottom: '-20px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(202, 138, 4, 0.15) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
          </div>

          {/* Card 2 */}
          <div style={{
            gridColumn: 'span 4',
            backgroundColor: '#262626',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <MessageSquare size={40} color="#CA8A04" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Campanhas Automáticas</h3>
            <p style={{ color: '#A8A29E', fontSize: '15px' }}>
              Crie promoções e envie mensagens personalizadas para seus clientes em segundos.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            gridColumn: 'span 4',
            backgroundColor: '#262626',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Package size={40} color="#CA8A04" style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Catálogo Premium</h3>
            <p style={{ color: '#A8A29E', fontSize: '15px' }}>
              Acesso exclusivo às melhores marcas internacionais e nacionais.
            </p>
          </div>

          {/* Card 4 */}
          <div style={{
            gridColumn: 'span 8',
            backgroundColor: '#262626',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '40px'
          }}>
            <div style={{ flex: 1 }}>
              <Users size={40} color="#CA8A04" style={{ marginBottom: '24px' }} />
              <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Dashboard de Clientes</h3>
              <p style={{ color: '#A8A29E', fontSize: '16px' }}>
                Visualize seus melhores clientes, frequência de compra e oportunidades de upsell em um único lugar.
              </p>
            </div>
            <div style={{
              width: '200px',
              height: '140px',
              backgroundColor: '#1C1917',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              border: '1px solid #404040'
            }}>
              <div style={{ height: '8px', width: '60%', backgroundColor: '#404040', borderRadius: '4px' }} />
              <div style={{ height: '8px', width: '80%', backgroundColor: '#404040', borderRadius: '4px' }} />
              <div style={{ height: '24px', width: '100%', backgroundColor: '#CA8A04', borderRadius: '4px', marginTop: 'auto' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories / Products Preview */}
      <section id="products" style={{ padding: '120px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px' }}>Nossas Especialidades</h2>
          <p style={{ color: '#57534E', fontSize: '18px' }}>Linhas completas para todas as necessidades do seu centro de estética.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { title: 'Banho & Higiene', desc: 'Shampoos, condicionadores e máscaras profissionais.', img: '🧼' },
            { title: 'Tratamento', desc: 'Recuperação capilar, hidratação profunda e cauterização.', img: '✨' },
            { title: 'Perfumaria', desc: 'Fragrâncias exclusivas com alta fixação e suavidade.', img: '🌸' },
            { title: 'Equipamentos', desc: 'Lâminas, máquinas e acessórios de tosa de precisão.', img: '✂️' }
          ].map((cat, i) => (
            <div key={i} className="cat-card" style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid #E7E5E4',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>{cat.img}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{cat.title}</h3>
              <p style={{ color: '#78716C', fontSize: '15px', lineHeight: '1.5' }}>{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{
        margin: '60px 5% 100px',
        padding: '80px 40px',
        backgroundColor: '#CA8A04',
        borderRadius: '40px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '24px', letterSpacing: '-1px' }}>
          Pronto para elevar o nível do seu Pet Shop?
        </h2>
        <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 40px' }}>
          Junte-se a centenas de empresas que já transformaram seus negócios com a Log Dog.
        </p>
        <Link href="/login" style={{
          backgroundColor: 'white',
          color: '#CA8A04',
          padding: '20px 48px',
          borderRadius: '16px',
          fontWeight: '800',
          fontSize: '18px',
          textDecoration: 'none',
          display: 'inline-block',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          Criar Minha Conta Agora
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '80px 5% 40px',
        borderTop: '1px solid #E7E5E4',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '60px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '20px' }}>🐕</span>
            <span style={{ fontSize: '20px', fontWeight: '800' }}>Log Dog</span>
          </div>
          <p style={{ color: '#78716C', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
            A maior distribuidora de cosméticos pet do Brasil. Excelência, tecnologia e compromisso com o bem-estar animal.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Instagram size={20} color="#78716C" />
            <Facebook size={20} color="#78716C" />
            <Linkedin size={20} color="#78716C" />
          </div>
        </div>
        
        <div>
          <h4 style={{ fontWeight: '700', marginBottom: '24px' }}>Produto</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#78716C' }}>
            <span>Como Funciona</span>
            <span>Preços</span>
            <span>Catálogo</span>
            <span>Novidades</span>
          </div>
        </div>

        <div>
          <h4 style={{ fontWeight: '700', marginBottom: '24px' }}>Empresa</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#78716C' }}>
            <span>Sobre Nós</span>
            <span>Blog</span>
            <span>Carreiras</span>
            <span>Contato</span>
          </div>
        </div>

        <div>
          <h4 style={{ fontWeight: '700', marginBottom: '24px' }}>Suporte</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#78716C' }}>
            <span>Central de Ajuda</span>
            <span>Privacidade</span>
            <span>Termos de Uso</span>
            <span>Status</span>
          </div>
        </div>
      </footer>
      
      <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '12px', color: '#A8A29E' }}>
        © 2026 Log Dog Distribuidora. Todos os direitos reservados.
      </div>

      <style jsx>{`
        .cat-card:hover {
          transform: translateY(-8px);
          border-color: #CA8A04;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
