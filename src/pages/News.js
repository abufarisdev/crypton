import React, { useState, useEffect } from 'react';
import bitcoinImg from "../assets/bitcoin.jpg";
import solanaImg from "../assets/solana.jpeg";
import secchairImg from "../assets/secchair.jpeg";
import cardanoImg from "../assets/cardamo.jpeg";
import { wrap } from 'framer-motion';

// Mock data
const newsData = [
 
  {
    id: 1,
    title: "Bitcoin Reaches New All-Time High Amid Institutional Adoption",
    summary: "Bitcoin has surged to unprecedented levels as institutional investors continue to show strong interest in cryptocurrency investments.",
    category: "Market",
    relatedCoin: "Bitcoin",
    publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    source: "CryptoDaily",
    url: "https://www.cryptodaily.com/",
    imageUrl: bitcoinImg,
  },
  {
    id: 2,
    title: "Ethereum 2.0 Staking Rewards Hit Record Levels",
    summary: "Ethereum's transition to proof-of-stake continues to attract validators with rewards reaching their highest levels since the launch of Ethereum 2.0.",
    category: "Technology",
    relatedCoin: "Ethereum",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: "BlockchainNews",
    url: "https://www.blockchainnews.com/",
    imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    title: "Solana Ecosystem Sees Strong DeFi Growth",
    summary: "TVL on Solana reaches a new milestone as liquidity floods into DeFi applications built on the high-performance blockchain.",
    category: "DeFi",
    relatedCoin: "Solana",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Decrypt",
    url: "https://decrypt.co/",
    imageUrl: solanaImg,
  },
  {
    id: 4,
    title: "SEC Chair Comments on Crypto Regulation",
    summary: "US regulators signal stricter oversight on stablecoins and DeFi protocols in the latest regulatory developments for the cryptocurrency industry.",
    category: "Regulation",
    relatedCoin: "All",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Bloomberg",
    url: "https://www.bloomberg.com/",
    imageUrl: secchairImg,
  },
  {
    id: 5,
    title: "Cardano Developers Announce Hydra Scaling Update",
    summary: "Hydra promises major improvements in transaction throughput for Cardano, potentially solving scalability issues that have plagued the network.",
    category: "Technology",
    relatedCoin: "Cardano",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: "CoinTelegraph",
    url: "https://cointelegraph.com/",
    imageUrl: cardanoImg,
  },
  {
    id: 6,
    title: "NFT Market Rebounds with Fresh Demand",
    summary: "Trading volume spikes across Ethereum and Polygon NFT marketplaces as new collections attract both retail and institutional investors.",
    category: "NFTs",
    relatedCoin: "Ethereum",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: "NFT Now",
    url: "https://nftnow.com/",
    imageUrl: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 7,
    title: "Binance Faces Fresh Scrutiny from EU Regulators",
    summary: "European regulators tighten their stance on centralized exchanges, with Binance facing increased regulatory pressure across multiple jurisdictions.",
    category: "Regulation",
    relatedCoin: "BNB",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Reuters",
    url: "https://www.reuters.com/",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 8,
    title: "Avalanche Foundation Announces $50M DeFi Fund",
    summary: "A new initiative to accelerate DeFi projects building on Avalanche, with a focus on innovative lending protocols and decentralized exchanges.",
    category: "DeFi",
    relatedCoin: "Avalanche",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: "CryptoSlate",
    url: "https://cryptoslate.com/",
    imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
 
];

// Utility function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
};

const News = () => {
  const [news, setNews] = useState(newsData);
  const [filteredNews, setFilteredNews] = useState(newsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [coinFilter, setCoinFilter] = useState('All Coins');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All Categories', ...new Set(newsData.map(item => item.category))];
  const coins = ['All Coins', ...new Set(newsData.map(item => item.relatedCoin).filter(c => c !== 'All'))];

  useEffect(() => {
    let result = news;

    if (categoryFilter !== 'All Categories') result = result.filter(n => n.category === categoryFilter);
    if (coinFilter !== 'All Coins') result = result.filter(n => n.relatedCoin === coinFilter);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(term) ||
        n.summary.toLowerCase().includes(term) ||
        n.source.toLowerCase().includes(term)
      );
    }
    if (activeFilter !== 'All') result = result.filter(n => n.category === activeFilter);

    setFilteredNews(result);
  }, [searchTerm, categoryFilter, coinFilter, activeFilter, news]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCategoryFilter(filter === 'All' ? 'All Categories' : filter);
  };

  // Common styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #111, #1a1a1a)',
    color: '#eee',
    padding: '16px',
    fontFamily: 'Arial, sans-serif',
  };
  const headerStyle = { display: 'flex-box', flexDirection: 'column', marginBottom: '32px' };
  const titleStyle = { fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' };
  const highlightStyle = { background: 'linear-gradient(to right, #4ade80, #3a80e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  const paragraphStyle = { color: '#a5b4fc' };
  const filterContainerStyle = { backgroundColor: 'rgba(30, 30, 60, 0.6)', border: '1px solid rgba(75,85,99,0.3)', borderRadius: '16px', padding: '16px', marginBottom: '32px' };
  const filterButtonsStyle = { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' };
  const filterButtonStyle = (active) => ({
    padding: '8px 12px',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: active ? '#4f46e5' : '#1f1f2e',
    color: '#fff',
    border: 'none'
  });
  const selectStyle = { backgroundColor: '#1f1f2e', border: '1px solid #374151', borderRadius: '12px', color: '#fff', padding: '8px 12px', fontSize: '0.9rem' };
  const inputStyle = { ...selectStyle, flex: 1 };
  const newsGridStyle = { display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', marginTop: '20px'};
  const cardStyle = {
    backgroundColor: '#1f1f2e',
    border: '1px solid #374151',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  };
  const cardHoverStyle = { transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' };
  const imgStyle = { width: '100%', height: '160px', objectFit: 'cover' };
  const cardContentStyle = { padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 , textAlign:'left'};
  const tagStyle = (bg) => ({ fontSize: '0.75rem', fontWeight: '600', padding: '4px 8px', borderRadius: '9999px', color: '#fff', background: bg });
  const titleCardStyle = { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' };
  const summaryStyle = { fontSize: '0.875rem', color: '#cbd5e1', flexGrow: 1, marginBottom: '12px' };
  const footerStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', borderTop: '1px solid #374151', paddingTop: '8px' };
  const footerContainerStyle = { textAlign: 'center', padding: '24px 0', color: '#9ca3af', borderTop: '1px solid #374151' };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Crypto <span style={highlightStyle}>News</span> Dashboard</h1>
        <p style={paragraphStyle}>Stay updated with the latest cryptocurrency news</p>
      </header>

      <div style={filterContainerStyle}>
        <div style={filterButtonsStyle}>
          {['All', 'Market', 'Technology', 'DeFi', 'NFTs', 'Regulation'].map(f => (
            <button key={f} onClick={() => handleFilterClick(f)} style={filterButtonStyle(activeFilter === f)}>{f}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent:'center' }}>
          <select style={selectStyle} value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setActiveFilter(e.target.value === 'All Categories' ? 'All' : e.target.value); }}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select style={selectStyle} value={coinFilter} onChange={e => setCoinFilter(e.target.value)}>
            {coins.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" style={inputStyle} placeholder="Search news..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div style={newsGridStyle}>
        {filteredNews.map(item => (
          <div key={item.id} style={cardStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)} onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}>
            <img src={item.imageUrl} alt={item.title} style={imgStyle} />
            <div style={cardContentStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={tagStyle('linear-gradient(to right, #8b5cf6, #4f46e5)')}>{item.category}</span>
                {item.relatedCoin && item.relatedCoin !== 'All' && <span style={tagStyle('linear-gradient(to right, #06b6d4, #3b82f6)')}>{item.relatedCoin}</span>}
              </div>
              <h2 style={titleCardStyle}>{item.title}</h2>
              <p style={summaryStyle}>{item.summary.substring(0, 100)}...</p>
              <div style={footerStyle}>
                <span>{item.source}</span>
                <span>{formatDate(item.publishedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#888' }}>No news articles found</h3>
          <p style={{ color: '#aaa' }}>Try adjusting your filters or search term</p>
        </div>
      )}

      <footer style={footerContainerStyle}>
        <p>Crypto News Dashboard &copy; 2023. All rights reserved.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Data provided by various cryptocurrency news sources</p>
      </footer>
    </div>
  );
};

export default News;
