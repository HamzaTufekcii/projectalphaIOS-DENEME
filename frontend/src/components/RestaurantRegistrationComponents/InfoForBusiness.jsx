import React from 'react';
import './InfoForBusiness.css';

const InfoForBusiness = () => {
    return (
        <div className="info-side">
            <div className="info-wrapper">
                <h2 className="info-title">Neden FeastFine?</h2>

                <div className="features-container">
                    <div className="feature-item">
                        <div className="feature-icon">👥</div>
                        <div className="feature-content">
                            <h3 className="feature-title">Daha Fazla Müşteriye Ulaş</h3>
                            <p className="feature-text">İşletmenizi bölgenizdeki binlerce müşteriye tanıtarak müşteri kitlenizi genişletin.</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">✓</div>
                        <div className="feature-content">
                            <h3 className="feature-title">Rezervasyon, Promosyon ve Daha Fazlası</h3>
                            <p className="feature-text">Rezervasyon yapma, promosyon tanımlama ve soruları cevaplandırma gibi özelliklerle işlemlerinizi hızlandırın.</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">📱</div>
                        <div className="feature-content">
                            <h3 className="feature-title">Yenilik ve Müşteri Memnuniyeti</h3>
                            <p className="feature-text">İnovatif bir yaklaşımla müşteri memnuniyetinizi en üst seviyeye çıkarın ve işletmenizin farkını ortaya koyun.</p>
                        </div>
                    </div>
                </div>

                <div className="stats-container">
                    <h3 className="stats-title">Bize Katılın</h3>
                    <p className="stats-text">Platformumuzu kullanan işletmeler, aylık gelirlerinde ortalama %30 artış bildiriyor.</p>
                    <div className="progress-bars">
                        <div className="progress-bar"></div>
                        <div className="progress-bar"></div>
                        <div className="progress-bar"></div>
                        <div className="progress-bar progress-bar-lighter"></div>
                    </div>
                    <p className="stats-footnote">Ortak işletmelerimizin %75’i müşteri memnuniyetinde artış yaşadığını belirtiyor.</p>
                </div>
            </div>
        </div>
    );
};

export default InfoForBusiness;
