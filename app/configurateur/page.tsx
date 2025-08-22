'use client'
import React, { useState } from 'react';
import { Plus, Minus, Check, Star, Camera, Image, Users, Baby, Heart, ArrowLeft, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';

export default function ConfigurateurPage() {
  const [config, setConfig] = useState({
    baseSession: false,
    photoCount: 0,
    retouching: 0,
    familyPhotos: false,
    rawGallery: false,
    usbKey: false,
    album20x30: false,
    album18x24: false,
    dressingSessions: 0,
    outfitLoan: false,
    themes: 0
  });

  const [sessionType, setSessionType] = useState('maternity');

  // États pour le code promo
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [showChat, setShowChat] = useState(false);

  // Codes promo disponibles
  const promoCodes = {
    'BIENVENUE': { discount: 20, description: 'Code de bienvenue' },
    'FAMILLE': { discount: 30, description: 'Réduction famille' },
    'NEWBORN': { discount: 25, description: 'Spécial nouveau-né' },
    'MATERNITE': { discount: 15, description: 'Réduction maternité' },
    'INSTAGRAM': { discount: 10, description: 'Code Instagram' },
    'PREMIERE20': { discount: 20, description: 'Première séance' },
    'DEVIS15': { discount: 15, description: 'Code devis gratuit' }
  };

  // Fonction pour appliquer le code promo
  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      setPromoError('Veuillez entrer un code promo');
      return;
    }
    
    if (promoCodes[code as keyof typeof promoCodes]) {
      const discount = promoCodes[code as keyof typeof promoCodes].discount;
      setPromoDiscount(discount);
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setPromoError('Code promo invalide');
      setPromoDiscount(0);
      setAppliedPromo('');
    }
  };

  // Fonction pour supprimer le code promo
  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoError('');
    setAppliedPromo('');
  };

  // Prix de base selon le type de séance
  const basePrices = {
    maternity: {
      name: "Séance Maternité",
      basePrice: 79,
      icon: <Heart className="w-5 h-5" />
    },
    newborn: {
      name: "Séance Nouveau-né",
      basePrice: 140,
      icon: <Baby className="w-5 h-5" />
    },
    family: {
      name: "Séance Famille", 
      basePrice: 150,
      icon: <Users className="w-5 h-5" />
    },
    smash: {
      name: "Smash the Cake",
      basePrice: 100,
      icon: <Camera className="w-5 h-5" />
    }
  };

  // Prix dégressifs pour les photos
  const getPhotoPrice = (count: number) => {
    if (count === 0) return 0;
    if (count <= 5) return 29;
    if (count <= 10) return 25;
    if (count <= 15) return 22;
    return 19;
  };

  const options = {
    retouching: { price: 35, name: "Retouche photo supplémentaire" },
    familyPhotos: { price: 50, name: "Photos de famille incluses" },
    rawGallery: { price: 60, name: "Téléchargement galerie brute" },
    usbKey: { price: 20, name: "Clé USB" },
    album20x30: { price: 150, name: "Album 20x30" },
    album18x24: { price: 90, name: "Album 18x24" },
    dressingSession: { price: 80, name: "Séance dressing (1h30)" },
    outfitLoan: { price: 70, name: "Prêt de robe maman" },
    theme: { price: 60, name: "Thème supplémentaire" }
  };

  const calculateTotal = () => {
    let total = 0;
    
    if (config.baseSession) {
      total += basePrices[sessionType as keyof typeof basePrices].basePrice;
    }
    
    total += config.photoCount * getPhotoPrice(config.photoCount);
    total += config.retouching * options.retouching.price;
    
    if (config.familyPhotos) total += options.familyPhotos.price;
    if (config.rawGallery) total += options.rawGallery.price;
    if (config.usbKey) total += options.usbKey.price;
    if (config.album20x30) total += options.album20x30.price;
    if (config.album18x24) total += options.album18x24.price;
    if (config.outfitLoan) total += options.outfitLoan.price;
    
    total += config.dressingSessions * options.dressingSession.price;
    total += config.themes * options.theme.price;

    // Appliquer la réduction du code promo
    total = Math.max(0, total - promoDiscount);

    return total;
  };

  const getBestPackEquivalent = () => {
    const totalBeforePromo = calculateTotal() + promoDiscount;
    const photoCount = config.photoCount;
    
    if (photoCount <= 3) return { pack: "Pack Small", savings: 220 - totalBeforePromo, color: totalBeforePromo < 220 ? "text-green-600" : "text-red-600" };
    if (photoCount <= 8) return { pack: "Pack Medium", savings: 350 - totalBeforePromo, color: totalBeforePromo < 350 ? "text-green-600" : "text-red-600" };
    if (photoCount <= 12) return { pack: "Pack Premium", savings: 450 - totalBeforePromo, color: totalBeforePromo < 450 ? "text-green-600" : "text-red-600" };
    return { pack: "Pack Golden", savings: 590 - totalBeforePromo, color: totalBeforePromo < 590 ? "text-green-600" : "text-red-600" };
  };

  const equivalent = getBestPackEquivalent();

  const ChatBot = () => (
    <div className={`fixed bottom-20 right-4 z-50 transition-all duration-300 ${showChat ? 'scale-100' : 'scale-0'}`}>
      <div className="bg-white rounded-2xl shadow-2xl w-80 max-h-96 overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold">Guzi Assistant</div>
                <div className="text-xs opacity-90">En ligne • Répond instantanément</div>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-800">👋 Besoin d'aide avec votre configuration ?</p>
          </div>
          <div className="space-y-2">
            {[
              '💰 Codes promo disponibles',
              '📅 Vérifier les disponibilités', 
              '🎨 Conseils personnalisation',
              '📞 Parler à un conseiller'
            ].map((option, i) => (
              <button key={i} className="w-full text-left p-2 text-sm bg-pink-50 hover:bg-pink-100 rounded transition-colors">
                {option}
              </button>
            ))}
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-yellow-800">🎁 <strong>Astuce :</strong> Utilisez PREMIERE20 pour -20€ !</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Configurateur à la Carte</h1>
            <p className="text-gray-600">Créez votre séance photo sur mesure et découvrez vos économies</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            {/* Type de séance */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-pink-500" />
                Type de séance
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(basePrices).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setSessionType(key)}
                    className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center font-medium ${
                      sessionType === key 
                        ? 'border-pink-500 bg-pink-50 text-pink-700' 
                        : 'border-gray-300 bg-gray-50 text-gray-800 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {value.icon}
                      <span className="ml-2 text-sm">{value.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Séance de base */}
            <div className="mb-6">
              <label className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg border border-pink-200 cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.baseSession}
                    onChange={(e) => setConfig({...config, baseSession: e.target.checked})}
                    className="w-5 h-5 text-pink-600 rounded"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">{basePrices[sessionType as keyof typeof basePrices].name}</p>
                    <p className="text-sm text-gray-600">Séance photo professionnelle</p>
                  </div>
                </div>
                <span className="font-bold text-pink-600">{basePrices[sessionType as keyof typeof basePrices].basePrice}€</span>
              </label>
            </div>

            {/* Photos retouchées */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center">
                <Image className="w-4 h-4 mr-2 text-pink-500" />
                Photos retouchées numériques
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700 font-medium">Nombre de photos</span>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setConfig({...config, photoCount: Math.max(0, config.photoCount - 1)})}
                      className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-gray-800">{config.photoCount}</span>
                    <button 
                      onClick={() => setConfig({...config, photoCount: config.photoCount + 1})}
                      className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-2 font-medium">
                  Prix unitaire: <span className="font-bold text-gray-800">{getPhotoPrice(config.photoCount)}€/photo</span>
                  {config.photoCount > 5 && <span className="text-green-600 ml-2 font-semibold">🎉 Prix dégressif appliqué !</span>}
                </div>
                <div className="text-right">
                  <span className="font-bold text-xl text-gray-800">{config.photoCount * getPhotoPrice(config.photoCount)}€</span>
                </div>
              </div>
            </div>

            {/* Options supplémentaires */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Options supplémentaires
              </h4>
              
              {/* Options booléennes */}
              {[
                { key: 'familyPhotos', ...options.familyPhotos },
                { key: 'rawGallery', ...options.rawGallery },
                { key: 'usbKey', ...options.usbKey },
                { key: 'album20x30', ...options.album20x30 },
                { key: 'album18x24', ...options.album18x24 },
                { key: 'outfitLoan', ...options.outfitLoan }
              ].map((option) => (
                <label key={option.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-gray-25">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config[option.key as keyof typeof config] as boolean}
                      onChange={(e) => setConfig({...config, [option.key]: e.target.checked})}
                      className="w-4 h-4 text-pink-600 rounded"
                    />
                    <span className="ml-3 font-medium text-gray-800">{option.name}</span>
                  </div>
                  <span className="font-bold text-gray-800">{option.price}€</span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-4">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Votre Devis</h3>
            
            {/* Prix total */}
            <div className="text-center mb-6">
              {promoDiscount > 0 && (
                <div className="text-lg text-gray-500 line-through mb-1">
                  {calculateTotal() + promoDiscount}€
                </div>
              )}
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {calculateTotal()}€
              </div>
              {promoDiscount > 0 && (
                <div className="text-sm text-green-600 font-semibold mb-2">
                  Économie code promo : -{promoDiscount}€
                </div>
              )}
              {equivalent.savings !== 0 && (
                <div className={`text-lg font-semibold ${equivalent.color}`}>
                  {equivalent.savings > 0 ? (
                    <>🎉 Vous économisez {equivalent.savings}€</>
                  ) : (
                    <>Supplément de {Math.abs(equivalent.savings)}€</>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    vs {equivalent.pack}
                  </div>
                </div>
              )}
            </div>

            {/* Section Code Promo */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <span className="text-lg">🎟️</span>
                  </div>
                  <h4 className="font-bold text-gray-800">Code Promo</h4>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Entrez votre code promo"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <button
                    onClick={applyPromoCode}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                  >
                    Appliquer
                  </button>
                </div>
                
                {promoError && (
                  <p className="text-red-600 text-sm mt-2 font-medium">{promoError}</p>
                )}
                
                {promoDiscount > 0 && (
                  <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-green-800 font-semibold flex items-center">
                      ✅ Code "{appliedPromo}" appliqué ! 
                      <button
                        onClick={removePromoCode}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ❌
                      </button>
                    </p>
                    <p className="text-green-700 text-sm">Réduction de {promoDiscount}€</p>
                  </div>
                )}
                
                <div className="mt-3 text-xs text-gray-600">
                  💡 <strong>Codes disponibles :</strong> BIENVENUE (-20€), FAMILLE (-30€), NEWBORN (-25€)
                </div>
              </div>
            </div>

            {/* Comparaison avec les packs */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <Check className="w-4 h-4 mr-1" />
                Avantage à la carte
              </h4>
              <p className="text-sm text-green-700">
                Vous ne payez que ce dont vous avez besoin ! 
                {config.photoCount > 0 && ` Prix photo: ${getPhotoPrice(config.photoCount)}€/unité`}
                {config.photoCount > 5 && ` (prix dégressif activé !)`}
              </p>
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all">
              🎉 Réserver pour {calculateTotal()}€
            </button>
          </div>
        </div>
      </div>

      {/* Chat bubble */}
      <button 
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-pink-500/25 flex items-center justify-center transform hover:scale-110 transition-all z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
}