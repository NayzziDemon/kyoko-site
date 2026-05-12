"use client";

import { useState, useEffect, useCallback } from "react";

export default function ClientUI({ config, prices, extras, rules, portfolio, socials }) {
  const [activeTab, setActiveTab] = useState("home");
  const [isVisible, setIsVisible] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    const container = document.getElementById("particles");
    if (!container) return;
    container.innerHTML = "";
    const colors = ["#e9d5ff", "#f0abfc", "#c084fc", "#ddd6fe", "#fbcfe8"];
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      const size = Math.random() * 8 + 4;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDuration = Math.random() * 10 + 10 + "s";
      particle.style.animationDelay = Math.random() * 10 + "s";
      container.appendChild(particle);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      document.querySelectorAll(".deco-star").forEach((el, i) => {
        const speed = (i % 3 + 1) * 0.5;
        el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setLightbox(null);
  }, []);

  useEffect(() => {
    if (lightbox) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightbox, handleKeyDown]);

  const isOpen = String(config.status).toLowerCase() === "open";
  const slotsTotal = config.slots_total || "3";
  const slotsTaken = config.slots_taken || "2";
  const availableSlots = Number(slotsTotal) - Number(slotsTaken);

  const rulesByCategory = rules.reduce((acc, rule) => {
    const cat = rule.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(rule.content);
    return acc;
  }, {});

  const categoryMeta = {
    general: { icon: "fa-gavel", title: "General rules", color: "text-purple-800" },
    payment: { icon: "fa-credit-card", title: "Payment", color: "text-purple-800" },
    deadlines: { icon: "fa-clock", title: "Deadlines", color: "text-purple-800" },
    process: { icon: "fa-paint-brush", title: "The work process", color: "text-purple-800" },
    will_draw: { icon: "fa-check-circle", title: "I draw", color: "text-green-700" },
    wont_draw: { icon: "fa-times-circle", title: "I do not draw", color: "text-red-500" },
  };

  const socialColors = {
    telegram: "hover:bg-sky-500",
    vk: "hover:bg-blue-600",
    twitter: "hover:bg-black",
    x: "hover:bg-black",
    boosty: "hover:bg-orange-500",
    default: "hover:bg-purple-500",
  };

  const defaultProcess = [
    { step: "1", title: "Описание заказа", desc: "Вы присылаете референсы и ТЗ" },
    { step: "2", title: "Скетч", desc: "Утверждаем композицию" },
    { step: "3", title: "Лайн + цвет", desc: "Промежуточные правки" },
    { step: "4", title: "Финал", desc: "Готовая работа + исходник" },
  ];

  const processSteps = rulesByCategory["process"]
    ? rulesByCategory["process"].map((text, i) => ({
      step: String(i + 1),
      title: text.split(" — ")[0] || text,
      desc: text.split(" — ")[1] || "",
    }))
    : defaultProcess;

  return (
    <>
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" onClick={() => setLightbox(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
          <div className="relative z-10 max-w-[90vw] max-h-[90vh] animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} className="absolute -top-12 right-0 text-white/80 hover:text-white text-3xl transition-colors">
              <i className="fas fa-times" />
            </button>
            <img src={lightbox.image} alt={lightbox.name} className="max-w-full max-h-[85vh] w-auto h-auto rounded-2xl shadow-2xl object-contain" />
            {lightbox.name && <p className="text-center text-white/90 mt-3 text-lg font-semibold">{lightbox.name}</p>}
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="deco-star absolute top-20 left-10 text-6xl text-purple-300 opacity-30 animate-float">✦</div>
        <div className="deco-star absolute top-40 right-20 text-5xl text-pink-300 opacity-30 animate-float-delayed">✧</div>
        <div className="deco-star absolute bottom-40 left-20 text-4xl text-purple-400 opacity-20 animate-float-slow">✦</div>
        <div className="deco-star absolute bottom-20 right-10 text-6xl text-purple-300 opacity-25 animate-float">✧</div>
        <div className="deco-star absolute top-1/3 left-1/4 text-3xl text-pink-200 opacity-20 animate-float-slow">♥</div>
        <div className="deco-star absolute top-2/3 right-1/3 text-4xl text-purple-300 opacity-20 animate-float-delayed">♥</div>
      </div>

      <div id="particles" className="fixed inset-0 pointer-events-none overflow-hidden z-0" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="glass-strong sticky top-0 z-50 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => setActiveTab("home")} className="group">
              <span className="text-2xl font-bold text-purple-700 group-hover:text-purple-900 transition-colors" style={{ fontFamily: "Caveat, cursive" }}>
                {config.nickname || "rinne"}
              </span>
            </button>
            <div className="flex items-center gap-6">
              {["home", "price", "tos"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`nav-link text-sm font-semibold transition-colors ${activeTab === tab ? "text-purple-800 active" : "text-purple-600 hover:text-purple-900"}`}>
                  {tab === "home" ? "Home" : tab === "price" ? "Price" : "TOS"}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="flex-1 flex items-start justify-center px-4 py-8">
          <div className={`w-full max-w-3xl transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

            {activeTab === "home" && (
              <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl animate-scale-in">
                <div className="text-center mb-8">
                  <h1 className="text-5xl md:text-6xl font-bold text-purple-800 mb-2 animate-fade-in-up" style={{ fontFamily: "Caveat, cursive" }}>
                    {config.nickname || "rinne"}
                  </h1>
                  <p className="text-lg text-purple-600 font-light tracking-widest uppercase animate-fade-in-up delay-100">
                    {config.title || "Illustrator"}
                  </p>
                </div>

                <div className="flex justify-center mb-8 animate-fade-in-up delay-200">
                  <div className="avatar-glow">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl animate-pulse-glow">
                      <img src={config.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=rinne&backgroundColor=e9d5ff"} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8 animate-fade-in-up delay-300">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${isOpen ? "bg-green-500 status-dot" : "bg-red-500 status-dot closed"}`} />
                      <span className={`text-lg font-bold ${isOpen ? "text-green-600" : "text-red-500"}`}>
                        {isOpen ? "Commissions Open!" : "Commissions Closed"}
                      </span>
                    </div>
                    {isOpen && <span className="text-sm text-purple-500">{availableSlots}/{slotsTotal} slots available</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-4 max-w-md mx-auto mb-10 animate-fade-in-up delay-400">
                  <button onClick={() => setActiveTab("price")} className="btn-shine group w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-purple-300/50 hover:-translate-y-1 transition-all duration-300">
                    <span className="flex items-center justify-between">
                      <span className="flex items-center gap-3"><i className="fas fa-tag text-purple-100" />PRICE LIST</span>
                      <i className="fas fa-chevron-right group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button onClick={() => setActiveTab("tos")} className="btn-shine group w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-300 to-purple-300 text-white font-bold text-lg shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 transition-all duration-300">
                    <span className="flex items-center justify-between">
                      <span className="flex items-center gap-3"><i className="fas fa-scroll text-pink-100" />TOS</span>
                      <i className="fas fa-chevron-right group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>

                <div className="animate-fade-in-up delay-500">
                  <div className="flex items-center gap-4 justify-center mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-300" />
                    <span className="text-sm text-purple-500 font-medium">Find me here</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-300" />
                  </div>
                  <div className="flex justify-center gap-5 flex-wrap">
                    {socials.length > 0 ? socials.map((social, i) => (
                      <a key={i} href={social.url || "#"} target="_blank" rel="noopener noreferrer"
                        className={`social-icon w-12 h-12 rounded-2xl glass-strong flex items-center justify-center text-purple-600 ${socialColors[social.color] || socialColors.default} hover:text-white shadow-md`}
                        title={social.name}>
                        {social.image ? (
                          <img
                            src={social.image}
                            alt={social.name}
                            className="w-6 h-6 object-contain social-img"
                          />
                        ) : (
                          <i className={`${social.icon} text-xl`} />
                        )}
                      </a>
                    )) : (
                      <>
                        <a href="#" className="social-icon w-12 h-12 rounded-2xl glass-strong flex items-center justify-center text-purple-600 hover:text-white hover:bg-blue-600 shadow-md"><i className="fab fa-vk text-xl" /></a>
                        <a href="#" className="social-icon w-12 h-12 rounded-2xl glass-strong flex items-center justify-center text-purple-600 hover:text-white hover:bg-sky-500 shadow-md"><i className="fab fa-telegram text-xl" /></a>
                        <a href="#" className="social-icon w-12 h-12 rounded-2xl glass-strong flex items-center justify-center text-purple-600 hover:text-white hover:bg-black shadow-md"><i className="fab fa-x-twitter text-xl" /></a>
                        <a href="#" className="social-icon w-12 h-12 rounded-2xl glass-strong flex items-center justify-center text-purple-600 hover:text-white hover:bg-orange-500 shadow-md"><i className="text-xl" /></a>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-center mt-8 pt-6 border-t border-purple-200/50">
                  <p className="text-xs text-purple-400">{config.footer_text || "Made with"} <i className="fas fa-heart text-pink-400 animate-heartbeat" /></p>
                </div>
              </div>
            )}

            {activeTab === "price" && (
              <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="text-center mb-10">
                  <button onClick={() => setActiveTab("home")} className="text-purple-500 hover:text-purple-700 transition-colors mb-4 inline-flex items-center gap-2 text-sm">
                    <i className="fas fa-arrow-left" /> Back
                  </button>
                  <h2 className="text-4xl md:text-5xl font-bold text-purple-800 mb-2" style={{ fontFamily: "Caveat, cursive" }}>✦ Price List ✦</h2>
                </div>

                {prices.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {prices.map((price, i) => (
                      <div key={i} className={`price-card glass-strong rounded-2xl p-6 text-center relative overflow-hidden ${price.popular ? "ring-2 ring-purple-300" : ""}`}>
                        {price.popular && <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-50" />
                        <div className="text-4xl mb-3">{price.icon}</div>
                        <h3 className="text-xl font-bold text-purple-800 mb-2">{price.name}</h3>
                        <div className="text-3xl font-bold text-purple-600 mb-4">{price.price}</div>
                        {price.description && <p className="text-sm text-purple-600 mb-4">{price.description}</p>}
                        {price.extra && <div className="text-xs text-purple-400">{price.extra}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="price-card glass-strong rounded-2xl p-6 text-center"><div className="text-4xl mb-3">✏️</div><h3 className="text-xl font-bold text-purple-800 mb-2">Sketch</h3><div className="text-3xl font-bold text-purple-600">$15</div></div>
                    <div className="price-card glass-strong rounded-2xl p-6 text-center ring-2 ring-purple-300 relative"><div className="absolute top-3 right-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div><div className="text-4xl mb-3">🎨</div><h3 className="text-xl font-bold text-purple-800 mb-2">Full Color</h3><div className="text-3xl font-bold text-purple-600">$45</div></div>
                    <div className="price-card glass-strong rounded-2xl p-6 text-center"><div className="text-4xl mb-3">🌸</div><h3 className="text-xl font-bold text-purple-800 mb-2">Chibi</h3><div className="text-3xl font-bold text-purple-600">$25</div></div>
                  </div>
                )}

                {extras.length > 0 && (
                  <div className="glass-strong rounded-2xl p-6 mb-10">
                    <h3 className="text-2xl font-bold text-purple-800 mb-4 text-center" style={{ fontFamily: "Caveat, cursive" }}>✧ Extras ✧</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {extras.map((extra, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/40">
                          <span className="text-purple-700"><i className="fas fa-plus-circle mr-2 text-purple-400" />{extra.name}</span>
                          <span className="font-bold text-purple-600">{extra.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {portfolio.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center" style={{ fontFamily: "Caveat, cursive" }}>✦ Examples ✦</h3>
                    <div className="flex flex-col gap-6">
                      {portfolio.map((art, i) => (
                        <div key={i} className="artwork-item relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg" onClick={() => setLightbox({ image: art.image, name: art.name })}>
                          <img src={art.image} alt={art.name} className="w-full h-auto object-contain" loading="lazy" />
                          <div className="artwork-overlay absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 transition-opacity flex items-end p-6">
                            <span className="text-white font-semibold text-lg">{art.name}</span>
                          </div>
                          <div className="absolute top-4 right-4 bg-black/40 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <i className="fas fa-expand mr-1" /> Enlarge
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "tos" && (
              <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="text-center mb-10">
                  <button onClick={() => setActiveTab("home")} className="text-purple-500 hover:text-purple-700 transition-colors mb-4 inline-flex items-center gap-2 text-sm">
                    <i className="fas fa-arrow-left" /> Back
                  </button>
                  <h2 className="text-4xl md:text-5xl font-bold text-purple-800 mb-2" style={{ fontFamily: "Caveat, cursive" }}>✦ Terms of Service ✦</h2>
                </div>

                <div className="space-y-6">
                  {Object.entries(rulesByCategory).filter(([cat]) => !["will_draw", "wont_draw", "process"].includes(cat)).map(([cat, items]) => {
                    const meta = categoryMeta[cat] || { icon: "fa-circle", title: cat, color: "text-purple-800" };
                    return (
                      <div key={cat} className="tos-section pl-6 py-4 rounded-r-xl">
                        <h3 className={`text-xl font-bold mb-3 flex items-center gap-2 ${meta.color}`}><i className={`fas ${meta.icon} text-purple-500`} />{meta.title}</h3>
                        <ul className="space-y-2 text-purple-700">
                          {items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span><span>{item}</span></li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}

                  <div className="glass-strong rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-purple-800 mb-4 text-center" style={{ fontFamily: "Caveat, cursive" }}>✧ The work process ✧</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {processSteps.map((step, i) => (
                        <div key={i} className="text-center p-4 rounded-xl bg-white/40 hover:bg-white/60 transition-colors">
                          <div className="w-10 h-10 mx-auto rounded-full bg-purple-400 text-white flex items-center justify-center font-bold mb-2 shadow-lg">{step.step}</div>
                          <p className="text-sm text-purple-700 font-semibold">{step.title}</p>
                          {step.desc && <p className="text-xs text-purple-500 mt-1">{step.desc}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {(rulesByCategory["will_draw"] || rulesByCategory["wont_draw"]) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {rulesByCategory["will_draw"] && (
                        <div className="glass-strong rounded-xl p-6 border-l-4 border-green-400 hover:shadow-lg transition-shadow">
                          <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2"><i className="fas fa-check-circle" />I draw</h3>
                          <ul className="space-y-2 text-sm text-purple-700">
                            {rulesByCategory["will_draw"].map((item, i) => (
                              <li key={i} className="flex items-start gap-2"><span className="text-green-400 mt-1">•</span><span>{item}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {rulesByCategory["wont_draw"] && (
                        <div className="glass-strong rounded-xl p-6 border-l-4 border-red-400 hover:shadow-lg transition-shadow">
                          <h3 className="text-lg font-bold text-red-500 mb-3 flex items-center gap-2"><i className="fas fa-times-circle" />I do not draw</h3>
                          <ul className="space-y-2 text-sm text-purple-700">
                            {rulesByCategory["wont_draw"].map((item, i) => (
                              <li key={i} className="flex items-start gap-2"><span className="text-red-400 mt-1">•</span><span>{item}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
