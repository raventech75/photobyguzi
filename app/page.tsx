'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Camera, Heart, Baby, Users, Star, ArrowRight, Check, Sparkles, Trophy, Clock, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, Play, X } from 'lucide-react'

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  // Statistiques temps réel (simulées)
  const [stats, setStats] = useState({
    sessionsMonth: 127,
    averageRating: 4.9,
    totalReviews: 234
  })

  // Rotation automatique des témoignages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Simulation de mise à jour des stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        sessionsMonth: prev.sessionsMonth + Math.floor(Math.random() * 2)
      }))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Sophie L.",
      rating: 5,
      text: "Photos magnifiques de ma grossesse ! Le configurateur m'a permis d'avoir exactement ce que je voulais.",
      config: "Pack Medium personnalisé",
      image: "/images/testimonials/sophie.jpg",
      fallback: "👩‍🦱"
    },
    {
      name: "Marie & Pierre",
      rating: 5,
      text: "Séance famille parfaite, les enfants étaient à l'aise. Économisé 45€ avec l'à la carte !",
      config: "Configuration sur mesure",
      image: "/images/testimonials/marie.jpg",
      fallback: "👨‍👩‍👧‍👦"
    },
    {
      name: "Amélie R.",
      rating: 5,
      text: "Photos nouveau-né sublimes ! Service professionnel et prix transparent.",
      config: "Pack Small + options",
      image: "/images/testimonials/amelie.jpg",
      fallback: "👶"
    }
  ]

  const galleryImages = [
    { 
      type: "Maternité", 
      beforeImg: "/images/gallery/maternite/maternite-avant-1.jpg",
      afterImg: "/images/gallery/maternite/maternite-apres-1.jpg", 
      description: "Retouche professionnelle - Éclairage et teint parfaits",
      category: "maternity"
    },
    { 
      type: "Nouveau-né", 
      beforeImg: "/images/gallery/newborn/newborn-avant-1.jpg",
      afterImg: "/images/gallery/newborn/newborn-apres-1.jpg", 
      description: "Douceur et sécurité - Couleurs naturelles",
      category: "newborn"
    },
    { 
      type: "Famille", 
      beforeImg: "/images/gallery/famille/famille-avant-1.jpg",
      afterImg: "/images/gallery/famille/famille-apres-1.jpg", 
      description: "Harmonie des couleurs - Expressions naturelles",
      category: "family"
    },
    { 
      type: "Smash Cake", 
      beforeImg: "/images/gallery/smash-cake/smash-avant-1.jpg",
      afterImg: "/images/gallery/smash-cake/smash-apres-1.jpg", 
      description: "Joie et couleurs - Moments magiques",
      category: "smash"
    }
  ]

  const faqData = [
    {
      question: "Que se passe-t-il si bébé pleure pendant la séance ?",
      answer: "Pas de panique ! Je suis habituée aux nouveau-nés. Nous prenons tout le temps nécessaire, avec des pauses pour nourrir, changer et consoler bébé. La séance peut durer jusqu'à 3h si besoin."
    },
    {
      question: "Puis-je reporter ma séance ?",
      answer: "Absolument ! Jusqu'à 48h avant la séance sans frais. Pour les nouveau-nés, nous restons flexibles car on ne peut pas prévoir l'arrivée de bébé."
    },
    {
      question: "Les tenues sont-elles fournies ?",
      answer: "Oui ! J'ai une garde-robe complète pour futures mamans (tailles 34 à 48) et tous les accessoires pour nouveau-nés. Vous pouvez aussi apporter vos tenues personnelles."
    },
    {
      question: "Combien de temps pour recevoir les photos ?",
      answer: "Les photos retouchées sont livrées sous 7-10 jours par galerie en ligne sécurisée. Les aperçus sont disponibles 24h après la séance."
    },
    {
      question: "Puis-je annuler ma commande ?",
      answer: "Vous avez 14 jours pour annuler selon la loi. Pour les séances à domicile, l'annulation est possible jusqu'à 24h avant."
    }
  ]

  const ChatBot = () => (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${showChat ? 'scale-100' : 'scale-0'}`}>
      <div className="bg-white rounded-2xl shadow-2xl w-80 max-h-96 overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold">Guzi</div>
                <div className="text-xs opacity-90">En ligne • Répond en 2min</div>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-800">👋 Salut ! Je suis là pour t'aider avec ta séance photo.</p>
          </div>
          <div className="space-y-2">
            {['❓ Questions sur les tarifs', '📅 Disponibilités', '🎁 Codes promo actuels', '📸 Voir le portfolio'].map((option, i) => (
              <button key={i} className="w-full text-left p-2 text-sm bg-pink-50 hover:bg-pink-100 rounded transition-colors">
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <input
            type="text"
            placeholder="Écris ton message..."
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </div>
    </div>
  )

  const ContactForm = () => (
    <div className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-all duration-300 ${showContactForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 transform transition-transform duration-300" style={{ transform: showContactForm ? 'scale(1)' : 'scale(0.9)' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Recevoir un devis personnalisé</h3>
          <button onClick={() => setShowContactForm(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input type="tel" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de séance</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400">
              <option>Maternité</option>
              <option>Nouveau-né</option>
              <option>Famille</option>
              <option>Smash the Cake</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée</label>
            <input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400" />
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">🎁 <strong>Offre spéciale :</strong> -15€ sur votre première séance avec le code <strong>DEVIS15</strong></p>
          </div>
          
          <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all">
            Recevoir mon devis gratuit
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Navigation sophistiquée */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Camera className="w-10 h-10 text-pink-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  PhotobyGuzi
                </span>
                <div className="text-xs text-gray-500 font-medium">Studio Photo Professionnel</div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="#services" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Services
              </Link>
              <Link href="#galerie" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Galerie
              </Link>
              <Link href="#tarifs" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
                Tarifs
              </Link>
              <button 
                onClick={() => setShowContactForm(true)}
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Contact
              </button>
              <Link 
                href="/configurateur"
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-3 rounded-full hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
              >
                Configurateur
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section avec stats live */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-pink-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"></div>
        </div>
        
        {/* Stats live en haut */}
        <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>⏰ {stats.sessionsMonth} séances réservées ce mois</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                <span>⭐ {stats.averageRating}/5 ({stats.totalReviews} avis)</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                <span>🏆 89% choisissent à la carte</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border border-pink-200 mb-8">
              <Sparkles className="w-5 h-5 text-pink-600 mr-2" />
              <span className="text-pink-700 font-semibold">🎉 Nouveau : Configurateur avec codes promo</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Séances Photo
              <span className="block bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                sur Mesure
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Créez votre séance photo parfaite avec notre configurateur intelligent. 
              <span className="font-semibold text-gray-800">Transparence totale, économies garanties</span> 
              et qualité professionnelle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Link 
                href="/configurateur"
                className="group bg-gradient-to-r from-pink-600 to-rose-600 text-white text-lg font-bold px-10 py-5 rounded-full hover:from-pink-700 hover:to-rose-700 transition-all shadow-2xl hover:shadow-pink-500/25 transform hover:-translate-y-1 flex items-center"
              >
                🎨 Créer ma séance parfaite
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => setShowContactForm(true)}
                className="flex items-center text-gray-700 hover:text-pink-600 transition-colors font-semibold"
              >
                <Phone className="w-5 h-5 mr-2" />
                Être rappelé(e) gratuitement
              </button>
            </div>
            
            <div className="inline-flex items-center bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">À partir de 79€</div>
                <div className="text-sm text-gray-500">Séance + photos incluses</div>
              </div>
              <div className="ml-6 pl-6 border-l border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">Jusqu'à -54€</div>
                <div className="text-sm text-gray-500">vs packs traditionnels</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie avant/après avec vraies photos */}
      <section id="galerie" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Avant / Après Retouches
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez la magie de la retouche professionnelle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((item, index) => (
              <div 
                key={index}
                className="group cursor-pointer relative overflow-hidden rounded-2xl"
                onClick={() => {setSelectedImage(index); setShowGallery(true)}}
              >
                <div className="relative bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-700 transition-all transform hover:scale-105">
                  
                  {/* Image Avant/Après avec effet hover */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 flex">
                      {/* Image Avant */}
                      <div className="w-1/2 relative overflow-hidden">
                        <img 
                          src={item.beforeImg} 
                          alt={`${item.type} - Avant retouche`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback si l'image n'existe pas
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        {/* Fallback emoji */}
                        <div className="hidden w-full h-full bg-gray-700 items-center justify-center text-4xl">
                          📸
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Avant
                        </div>
                      </div>
                      
                      {/* Image Après */}
                      <div className="w-1/2 relative overflow-hidden">
                        <img 
                          src={item.afterImg} 
                          alt={`${item.type} - Après retouche`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback si l'image n'existe pas
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        {/* Fallback emoji */}
                        <div className="hidden w-full h-full bg-gray-600 items-center justify-center text-4xl">
                          ✨
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Après
                        </div>
                      </div>
                    </div>
                    
                    {/* Séparateur central */}
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/30 transform -translate-x-0.5"></div>
                  </div>
                  
                  {/* Infos */}
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg mb-2">{item.type}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    <div className="bg-pink-600 text-white px-4 py-2 rounded-lg inline-flex items-center group-hover:bg-pink-500 transition-colors">
                      <Play className="w-4 h-4 mr-2" />
                      Voir en grand
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton pour voir plus */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-full hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg font-semibold">
              📸 Voir tout le portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Témoignages dynamiques avec photos */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Ils ont choisi à la carte
            </h2>
            <p className="text-xl text-gray-600">Témoignages de nos clientes ravies</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center relative">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                <img 
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full bg-gray-200 items-center justify-center text-2xl">
                  {testimonials[currentTestimonial].fallback}
                </div>
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 italic mb-6">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
              <div className="text-sm text-pink-600">{testimonials[currentTestimonial].config}</div>
              
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-pink-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types de séances */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Nos Spécialités</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque moment de votre vie mérite d'être immortalisé avec expertise et passion
            </p>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all">
              <div className="bg-pink-100 p-4 rounded-2xl mb-6 inline-block">
                <Heart className="w-12 h-12 text-pink-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Maternité</h3>
              <p className="text-gray-600 mb-4">Immortalisez cette période magique de l'attente</p>
              <div className="text-2xl font-bold text-pink-600 mb-6">À partir de 79€</div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Séance en studio
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Tenues fournies
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Retouches incluses
                </li>
              </ul>
              <Link 
                href="/configurateur"
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all inline-block text-center"
              >
                Configurer ma séance
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all">
              <div className="bg-blue-100 p-4 rounded-2xl mb-6 inline-block">
                <Baby className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Nouveau-né</h3>
              <p className="text-gray-600 mb-4">Les premiers instants précieux de votre bébé</p>
              <div className="text-2xl font-bold text-blue-600 mb-6">À partir de 140€</div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Props inclus
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Sécurité garantie
                </li>
              </ul>
              <Link 
                href="/configurateur"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all inline-block text-center"
              >
                Configurer ma séance
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all">
              <div className="bg-green-100 p-4 rounded-2xl mb-6 inline-block">
                <Users className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Famille</h3>
              <p className="text-gray-600 mb-4">Moments complices et souvenirs partagés</p>
              <div className="text-2xl font-bold text-green-600 mb-6">À partir de 150€</div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Tous âges
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Extérieur/Studio
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Ambiance naturelle
                </li>
              </ul>
              <Link 
                href="/configurateur"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all inline-block text-center"
              >
                Configurer ma séance
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all">
              <div className="bg-purple-100 p-4 rounded-2xl mb-6 inline-block">
                <Camera className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smash the Cake</h3>
              <p className="text-gray-600 mb-4">Célébrez le premier anniversaire en beauté</p>
              <div className="text-2xl font-bold text-purple-600 mb-6">À partir de 100€</div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Gâteau fourni
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Décor personnalisé
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Nettoyage inclus
                </li>
              </ul>
              <Link 
                href="/configurateur"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all inline-block text-center"
              >
                Configurer ma séance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages à la carte */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi choisir à la carte ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une approche révolutionnaire qui met le contrôle entre vos mains
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-yellow-100 p-6 rounded-3xl mb-8 inline-block">
                <Star className="w-16 h-16 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Flexibilité totale</h3>
              <p className="text-lg text-gray-600">Construisez votre séance exactement selon vos besoins. Aucune contrainte, aucun supplément caché.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-6 rounded-3xl mb-8 inline-block">
                <Trophy className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Économies garanties</h3>
              <p className="text-lg text-gray-600">Prix dégressifs automatiques et comparaison en temps réel avec nos packs traditionnels.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-6 rounded-3xl mb-8 inline-block">
                <Clock className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparence totale</h3>
              <p className="text-lg text-gray-600">Chaque euro est justifié. Voyez en direct le détail de votre devis personnalisé.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Interactive */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-gray-600">Tout ce que vous devez savoir</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => setShowChat(true)}
              className="inline-flex items-center bg-pink-600 text-white px-8 py-4 rounded-full hover:bg-pink-700 transition-all font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              D'autres questions ? Chattez avec nous !
            </button>
          </div>
        </div>
      </section>

      {/* Exemples d'économies */}
      <section id="tarifs" className="py-20 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-green-900 mb-6">
              Vos Économies Réelles
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Découvrez combien vous économisez avec notre système à la carte
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-100 hover:border-green-200 transition-all group hover:scale-105">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">54€</div>
                <div className="text-sm text-gray-500 mb-4">d'économie moyenne</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Configuration Essentielle</h3>
                <p className="text-gray-600 mb-4">vs Pack Small traditionnel</p>
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  Séance + 3 photos retouchées
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-100 hover:border-blue-200 transition-all group hover:scale-105">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">Flexible</div>
                <div className="text-sm text-gray-500 mb-4">selon vos besoins</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Configuration Moyenne</h3>
                <p className="text-gray-600 mb-4">Adaptée à vos besoins exacts</p>
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  Aucun surplus, que l'utile
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-100 hover:border-purple-200 transition-all group hover:scale-105">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">31€</div>
                <div className="text-sm text-gray-500 mb-4">d'économie moyenne</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Configuration Complète</h3>
                <p className="text-gray-600 mb-4">vs Pack Golden traditionnel</p>
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  Séance + 15 photos + album
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/configurateur"
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xl font-bold px-12 py-6 rounded-full hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1"
            >
              💰 Calculer mes économies maintenant
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à créer votre séance parfaite ?
          </h2>
          <p className="text-xl text-pink-100 mb-10 max-w-3xl mx-auto">
            Rejoignez {stats.sessionsMonth}+ familles qui ont choisi la transparence et les économies ce mois
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link 
              href="/configurateur"
              className="inline-flex items-center bg-white text-pink-600 text-xl font-bold px-12 py-6 rounded-full hover:bg-gray-50 transition-all shadow-2xl transform hover:-translate-y-1"
            >
              ✨ Commencer mon configurateur
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
            <button 
              onClick={() => setShowContactForm(true)}
              className="inline-flex items-center border-2 border-white text-white text-xl font-bold px-12 py-6 rounded-full hover:bg-white hover:text-pink-600 transition-all"
            >
              <Phone className="w-6 h-6 mr-3" />
              Consultation gratuite
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-pink-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5min</div>
              <div className="text-sm">pour configurer votre séance parfaite</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">-43€</div>
              <div className="text-sm">d'économie moyenne vs packs traditionnels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">4.9★</div>
              <div className="text-sm">Note moyenne de nos {stats.totalReviews} clientes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Camera className="w-10 h-10 text-pink-500" />
                <span className="text-3xl font-bold">PhotobyGuzi</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Studio photo professionnel spécialisé dans la maternité, les nouveau-nés et les familles. 
                Une approche moderne et transparente pour immortaliser vos moments précieux.
              </p>
              <div className="flex space-x-4">
                <div className="bg-pink-600 p-3 rounded-full">
                  <span className="text-xl">📘</span>
                </div>
                <div className="bg-pink-600 p-3 rounded-full">
                  <span className="text-xl">📷</span>
                </div>
                <div className="bg-pink-600 p-3 rounded-full">
                  <span className="text-xl">🎥</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Services</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/configurateur" className="hover:text-white transition-colors">Configurateur à la carte</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Séances maternité</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Photos nouveau-né</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Séances famille</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Smash the Cake</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  hello@photobyguzi.com
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +33 6 49 78 55 02
                </li>
                <li className="flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  Studio sur Montreuil
                </li>
              </ul>
              <button 
                onClick={() => setShowContactForm(true)}
                className="mt-4 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold"
              >
                Devis gratuit
              </button>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 PhotobyGuzi. Tous droits réservés. 
              <span className="text-pink-500 ml-2">Créé avec passion ❤️</span>
            </p>
            <div className="mt-4 text-sm text-gray-500">
              CGV • Mentions légales • Politique de confidentialité
            </div>
          </div>
        </div>
      </footer>

      {/* Chat bubble fixe */}
      <button 
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-pink-500/25 flex items-center justify-center transform hover:scale-110 transition-all z-40"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
          !
        </div>
      </button>

      {/* Composants modaux */}
      <ChatBot />
      <ContactForm />

      {/* Modal galerie améliorée avec vraies photos */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-white">
                {galleryImages[selectedImage].type} - Avant / Après
              </h3>
              <button 
                onClick={() => setShowGallery(false)} 
                className="text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Avant */}
              <div className="text-center">
                <div className="relative rounded-2xl overflow-hidden mb-4 group">
                  <img 
                    src={galleryImages[selectedImage].beforeImg} 
                    alt="Avant retouche"
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback */}
                  <div className="hidden w-full h-96 bg-gray-700 items-center justify-center text-6xl rounded-2xl">
                    📸
                  </div>
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold">
                    AVANT
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Photo originale</h4>
                <p className="text-gray-300">Directement sortie de l'appareil photo</p>
              </div>
              
              {/* Image Après */}
              <div className="text-center">
                <div className="relative rounded-2xl overflow-hidden mb-4 group">
                  <img 
                    src={galleryImages[selectedImage].afterImg} 
                    alt="Après retouche"
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback */}
                  <div className="hidden w-full h-96 bg-gray-600 items-center justify-center text-6xl rounded-2xl">
                    ✨
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-semibold">
                    APRÈS
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Retouche professionnelle</h4>
                <p className="text-gray-300">{galleryImages[selectedImage].description}</p>
              </div>
            </div>
            
            {/* Navigation entre images */}
            <div className="flex justify-center mt-8 space-x-4">
              <button 
                onClick={() => setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                ← Précédent
              </button>
              <button 
                onClick={() => setSelectedImage((prev) => (prev + 1) % galleryImages.length)}
                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                Suivant →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}