import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'te' | 'ta' | 'kn' | 'ml';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.membership': 'Membership',
    'nav.positions': 'Positions',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.joinNow': 'Join Now',
    
    // Common Actions
    'joinNow': 'Join Now',
    'becomeMember': 'Become a Member',
    'applyForPosition': 'Apply for Position',
    
    // Hero Section
    'hero.tagline': 'India\'s Premier Land Development Association',
    'hero.title1': 'Empowering Land',
    'hero.title2': 'Developers',
    'hero.title3': 'Across India',
    'hero.description': 'Join thousands of land developers, property owners, and industry professionals in India\'s most influential association. Connect with your local community, access exclusive benefits, and shape the future of land development.',
    
    // Location Section
    'location.findCommunity': 'Find Your Local Community',
    'location.description': 'Discover members, committee representatives, and events in your area through our hierarchical location search',
    
    // Membership Section
    'membership.title': 'Membership Options',
    'membership.description': 'Choose the membership that best fits your needs and unlock exclusive benefits',
    'membership.applyNow': 'Apply Now',
    
    // About Section
    'about.title': 'About LDOAI',
    'about.description': 'Land Developers & Owners Association of India (LDOAI) is a national organization dedicated to uniting land developers, property owners, and stakeholders across India.',
    'about.vision.title': 'Our Vision',
    'about.vision.content': 'To unify and empower land developers and property owners across India by fostering transparent development practices and strengthening institutional collaboration.',
    'about.mission.title': 'Our Mission',
    'about.mission.content': 'Standardizing development practices, amplifying member voices, and driving sustainable growth from village to national level.',
    'about.structure.title': 'Organization Structure',
    'about.structure.content': 'LDOAI operates through a multi-tiered structure from national to village level, ensuring comprehensive representation.',
    'about.learnMore': 'Learn More',
    
    // Contact Section
    'contact.title': 'Contact Us',
    'contact.description': 'Get in touch with LDOAI for inquiries, membership information, or to connect with your local representatives.',
    'contact.office.title': 'Head Office',
    'contact.office.address': 'Mumbai, Maharashtra, India',
    'contact.phone.title': 'Phone',
    'contact.phone.number': '+91-XXXXXXXXXX',
    'contact.email.title': 'Email',
    'contact.email.address': 'info@ldoai.org',
    'contact.getInTouch': 'Get In Touch',
    
    // Positions Section
    'positions.title': 'Leadership Positions',
    'positions.description': 'Take on leadership roles and shape the future of land development in India',
    
    // Position Titles
    'position.chairman': 'Chairman',
    'position.secretary': 'Secretary',
    'position.treasurer': 'Treasurer',
    'position.avcCore': 'Asst Vice Chairman (Core)',
    'position.avcSupport': 'Asst Vice Chairman (Support)',
    'position.advisory': 'Advisory Committee',
    'position.regular': 'Regular Member',
    
    // Position Descriptions
    'positionDesc.chairman': 'Lead the association and represent in government meetings',
    'positionDesc.secretary': 'Manage daily operations and correspondence',
    'positionDesc.treasurer': 'Handle financial matters and budget planning',
    'positionDesc.avcCore': 'Government liaison, membership growth, marketing',
    'positionDesc.avcSupport': 'CA, Advocate, Agriculture expertise',
    'positionDesc.advisory': 'Strategic guidance and expertise',
    'positionDesc.regular': 'Voting rights, networking, events access',
    
    // Footer
    'footer.description': 'Empowering land developers and property owners across India through collaboration, networking, and advocacy.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.contact': 'Contact',
    'footer.copyright': '2024 Land Developers and Owners Association of India. All rights reserved.'
  },
  hi: {
    // Navigation
    'nav.membership': 'सदस्यता',
    'nav.positions': 'पद',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    'nav.joinNow': 'अभी शामिल हों',
    
    // Common Actions
    'joinNow': 'अभी शामिल हों',
    'becomeMember': 'सदस्य बनें',
    'applyForPosition': 'पद के लिए आवेदन करें',
    
    // Hero Section
    'hero.tagline': 'भारत की प्रमुख भूमि विकास संस्था',
    'hero.title1': 'भूमि का सशक्तिकरण',
    'hero.title2': 'डेवलपर्स',
    'hero.title3': 'पूरे भारत में',
    'hero.description': 'भारत की सबसे प्रभावशाली संस्था में हजारों भूमि डेवलपर्स, संपत्ति मालिकों और उद्योग पेशेवरों के साथ जुड़ें। अपने स्थानीय समुदाय से जुड़ें, विशेष लाभ प्राप्त करें, और भूमि विकास के भविष्य को आकार दें।',
    
    // Location Section
    'location.findCommunity': 'अपना स्थानीय समुदाय खोजें',
    'location.description': 'हमारी पदानुक्रमित स्थान खोज के माध्यम से अपने क्षेत्र में सदस्यों, समिति प्रतिनिधियों और कार्यक्रमों की खोज करें',
    
    // Membership Section
    'membership.title': 'सदस्यता विकल्प',
    'membership.description': 'वह सदस्यता चुनें जो आपकी आवश्यकताओं के लिए सबसे उपयुक्त हो और विशेष लाभों को अनलॉक करें',
    'membership.applyNow': 'अभी आवेदन करें',
    
    // About Section
    'about.title': 'LDOAI के बारे में',
    'about.description': 'भूमि डेवलपर्स और मालिक संघ भारत (LDOAI) एक राष्ट्रीय संगठन है जो भारत भर में भूमि डेवलपर्स, संपत्ति मालिकों और हितधारकों को एकजुट करने के लिए समर्पित है।',
    'about.vision.title': 'हमारा दृष्टिकोण',
    'about.vision.content': 'पारदर्शी विकास प्रथाओं को बढ़ावा देकर और संस्थागत सहयोग को मजबूत करके भारत भर में भूमि डेवलपर्स और संपत्ति मालिकों को एकजुट और सशक्त बनाना।',
    'about.mission.title': 'हमारा मिशन',
    'about.mission.content': 'विकास प्रथाओं का मानकीकरण, सदस्य आवाजों का विस्तार, और गांव से राष्ट्रीय स्तर तक सतत विकास को प्रेरित करना।',
    'about.structure.title': 'संगठन संरचना',
    'about.structure.content': 'LDOAI राष्ट्रीय से गांव स्तर तक एक बहु-स्तरीय संरचना के माध्यम से काम करता है, व्यापक प्रतिनिधित्व सुनिश्चित करता है।',
    'about.learnMore': 'और जानें',
    
    // Contact Section
    'contact.title': 'संपर्क करें',
    'contact.description': 'पूछताछ, सदस्यता की जानकारी या अपने स्थानीय प्रतिनिधियों से जुड़ने के लिए LDOAI से संपर्क करें।',
    'contact.office.title': 'मुख्य कार्यालय',
    'contact.office.address': 'मुंबई, महाराष्ट्र, भारत',
    'contact.phone.title': 'फोन',
    'contact.phone.number': '+91-XXXXXXXXXX',
    'contact.email.title': 'ईमेल',
    'contact.email.address': 'info@ldoai.org',
    'contact.getInTouch': 'संपर्क करें',
    
    // Positions Section
    'positions.title': 'नेतृत्व पद',
    'positions.description': 'नेतृत्व की भूमिका निभाएं और भारत में भूमि विकास के भविष्य को आकार दें',
    
    // Position Titles
    'position.chairman': 'अध्यक्ष',
    'position.secretary': 'सचिव',
    'position.treasurer': 'कोषाध्यक्ष',
    'position.avcCore': 'सहायक उपाध्यक्ष (मुख्य)',
    'position.avcSupport': 'सहायक उपाध्यक्ष (सहायक)',
    'position.advisory': 'सलाहकार समिति',
    'position.regular': 'नियमित सदस्य',
    
    // Position Descriptions
    'positionDesc.chairman': 'संस्था का नेतृत्व करें और सरकारी बैठकों में प्रतिनिधित्व करें',
    'positionDesc.secretary': 'दैनिक संचालन और पत्राचार का प्रबंधन करें',
    'positionDesc.treasurer': 'वित्तीय मामलों और बजट योजना को संभालें',
    'positionDesc.avcCore': 'सरकारी संपर्क, सदस्यता वृद्धि, विपणन',
    'positionDesc.avcSupport': 'सीए, वकील, कृषि विशेषज्ञता',
    'positionDesc.advisory': 'रणनीतिक मार्गदर्शन और विशेषज्ञता',
    'positionDesc.regular': 'मतदान अधिकार, नेटवर्किंग, कार्यक्रम पहुंच',
    
    // Footer
    'footer.description': 'सहयोग, नेटवर्किंग और वकालत के माध्यम से पूरे भारत में भूमि डेवलपर्स और संपत्ति मालिकों का सशक्तिकरण।',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.services': 'सेवाएं',
    'footer.contact': 'संपर्क',
    'footer.copyright': '2024 भारतीय भूमि डेवलपर्स और मालिक संघ। सभी अधिकार सुरक्षित।'
  },
  mr: {
    // Navigation
    'nav.membership': 'सदस्यत्व',
    'nav.positions': 'पदे',
    'nav.about': 'आमच्याबद्दल',
    'nav.contact': 'संपर्क',
    'nav.joinNow': 'आता सामील व्हा',
    
    // Common Actions
    'joinNow': 'आता सामील व्हा',
    'becomeMember': 'सदस्य बना',
    'applyForPosition': 'पदासाठी अर्ज करा',
    
    // Hero Section
    'hero.tagline': 'भारताची प्रमुख भूमि विकास संस्था',
    'hero.title1': 'भूमि सक्षमीकरण',
    'hero.title2': 'विकासकर्ते',
    'hero.title3': 'संपूर्ण भारतात',
    'hero.description': 'भारतातील सर्वात प्रभावशाली संघटनेत हजारो भूमि विकासकर्ते, मालमत्ता मालक आणि उद्योग व्यावसायिकांसोबत सामील व्हा। तुमच्या स्थानिक समुदायाशी जोडला जा, विशेष फायदे मिळवा आणि भूमि विकासाच्या भविष्याला आकार द्या।',
    
    // Location Section
    'location.findCommunity': 'तुमचा स्थानिक समुदाय शोधा',
    'location.description': 'आमच्या श्रेणीबद्ध स्थान शोधाद्वारे तुमच्या क्षेत्रातील सदस्य, समिती प्रतिनिधी आणि कार्यक्रम शोधा',
    
    // Membership Section
    'membership.title': 'सदस्यत्व पर्याय',
    'membership.description': 'तुमच्या गरजेनुसार सदस्यत्व निवडा आणि विशेष फायदे मिळवा',
    'membership.applyNow': 'आता अर्ज करा',
    
    // About Section
    'about.title': 'LDOAI बद्दल',
    'about.description': 'भूमि विकासकर्ते आणि मालक संघटना भारत (LDOAI) ही एक राष्ट्रीय संस्था आहे जी भारतभरातील भूमि विकासकर्ते, मालमत्ता मालक आणि हितधारकांना एकत्र आणण्यासाठी समर्पित आहे।',
    'about.vision.title': 'आमची दृष्टी',
    'about.vision.content': 'पारदर्शक विकास पद्धतींना प्रोत्साहन देऊन आणि संस्थात्मक सहकार्याला बळकट करून भारतभरातील भूमि विकासकर्ते आणि मालमत्ता मालकांना एकत्र आणणे आणि सशक्त करणे।',
    'about.mission.title': 'आमचे ध्येय',
    'about.mission.content': 'विकास पद्धतींचे मानकीकरण, सदस्यांच्या आवाजाचा विस्तार, आणि गाव ते राष्ट्रीय स्तरापर्यंत शाश्वत विकासाला प्रेरणा देणे।',
    'about.structure.title': 'संघटना रचना',
    'about.structure.content': 'LDOAI राष्ट्रीय ते गाव स्तरापर्यंत बहु-स्तरीय रचनेद्वारे कार्य करते, व्यापक प्रतिनिधित्व सुनिश्चित करते।',
    'about.learnMore': 'अधिक जाणून घ्या',
    
    // Contact Section
    'contact.title': 'संपर्क करा',
    'contact.description': 'चौकशी, सदस्यत्व माहिती किंवा तुमच्या स्थानिक प्रतिनिधींशी जोडण्यासाठी LDOAI शी संपर्क करा।',
    'contact.office.title': 'मुख्य कार्यालय',
    'contact.office.address': 'मुंबई, महाराष्ट्र, भारत',
    'contact.phone.title': 'फोन',
    'contact.phone.number': '+91-XXXXXXXXXX',
    'contact.email.title': 'ईमेल',
    'contact.email.address': 'info@ldoai.org',
    'contact.getInTouch': 'संपर्कात रहा'
  },
  gu: {
    // Navigation
    'nav.membership': 'સદસ્યતા',
    'nav.positions': 'હોદ્દા',
    'nav.about': 'અમારા વિશે',
    'nav.contact': 'સંપર્ક',
    'nav.joinNow': 'અત્યારે જોડાઓ',
    
    // Common Actions
    'joinNow': 'અત્યારે જોડાઓ',
    'becomeMember': 'સભ્ય બનો',
    'applyForPosition': 'હોદ્દા માટે અરજી કરો',
    
    // Hero Section
    'hero.tagline': 'ભારતની પ્રમુખ જમીન વિકાસ સંસ્થા',
    'hero.title1': 'જમીન સશક્તિકરણ',
    'hero.title2': 'વિકાસકર્તાઓ',
    'hero.title3': 'સમગ્ર ભારતમાં',
    'hero.description': 'ભારતના સૌથી પ્રભાવશાળી સંઘમાં હજારો જમીન વિકાસકર્તાઓ, મિલકત માલિકો અને ઉદ્યોગ વ્યાવસાયિકો સાથે જોડાઓ। તમારા સ્થાનિક સમુદાય સાથે જોડાઓ, વિશેષ લાભો મેળવો અને જમીન વિકાસના ભવિષ્યને આકાર આપો।',
    
    // Location Section
    'location.findCommunity': 'તમારો સ્થાનિક સમુદાય શોધો',
    'location.description': 'અમારી શ્રેણીબદ્ધ સ્થાન શોધ દ્વારા તમારા વિસ્તારમાં સભ્યો, સમિતિ પ્રતિનિધિઓ અને ઇવેન્ટ્સ શોધો',
    
    // Membership Section
    'membership.title': 'સભ્યતા વિકલ્પો',
    'membership.description': 'તમારી જરૂરિયાતોને બંધબેસતી સભ્યતા પસંદ કરો અને વિશેષ લાભો મેળવો',
    'membership.applyNow': 'હવે અરજી કરો',
    
    // About Section
    'about.title': 'LDOAI વિશે',
    'about.description': 'લેન્ડ ડેવલપર્સ અને ઓનર્સ એસોસિએશન ઓફ ઇન્ડિયા (LDOAI) એ એક રાષ્ટ્રીય સંસ્થા છે જે ભારતભરના જમીન વિકાસકર્તાઓ, મિલકત માલિકો અને હિતધારકોને એકસાથે લાવવા માટે સમર્પિત છે।',
    'about.vision.title': 'અમારું વિઝન',
    'about.vision.content': 'પારદર્શક વિકાસ પ્રથાઓને પ્રોત્સાહન આપીને અને સંસ્થાકીય સહયોગને મજબૂત બનાવીને ભારતભરના જમીન વિકાસકર્તાઓ અને મિલકત માલિકોને એકસાથે લાવવા અને સશક્ત બનાવવા।',
    'about.mission.title': 'અમારું મિશન',
    'about.mission.content': 'વિકાસ પ્રથાઓનું માનકીકરણ, સભ્યોના અવાજોનો વિસ્તાર, અને ગામથી રાષ્ટ્રીય સ્તર સુધી ટકાઉ વિકાસને પ્રેરણા આપવી।',
    'about.structure.title': 'સંસ્થા માળખું',
    'about.structure.content': 'LDOAI રાષ્ટ્રીયથી ગામ સ્તર સુધી બહુ-સ્તરીય માળખા દ્વારા કાર્ય કરે છે, વ્યાપક પ્રતિનિધિત્વ સુનિશ્ચિત કરે છે।',
    'about.learnMore': 'વધુ જાણો'
  },
  te: {
    // Navigation
    'nav.membership': 'సభ్యత్వం',
    'nav.positions': 'పదవులు',
    'nav.about': 'మా గురించి',
    'nav.contact': 'సంప్రదింపు',
    'nav.joinNow': 'ఇప్పుడే చేరండి',
    
    // Common Actions
    'joinNow': 'ఇప్పుడే చేరండి',
    'becomeMember': 'సభ్యుడు అవ్వండి',
    'applyForPosition': 'పదవికి దరఖాస్తు చేయండి',
    
    // Hero Section
    'hero.tagline': 'భారతదేశపు ప్రధాన భూమి అభివృద్ధి సంస్థ',
    'hero.title1': 'భూమి సశక్తీకరణ',
    'hero.title2': 'అభివృద్ధికారులు',
    'hero.title3': 'భారతదేశం అంతటా',
    'hero.description': 'భారతదేశంలోని అత్యంత ప్రభావవంతమైన సంఘంలో వేలాది భూమి అభివృద్ధికారులు, ఆస్తి యజమానులు మరియు పరిశ్రమ నిపుణులతో చేరండి। మీ స్థానిక కమ్యూనిటీతో అనుసంధానించండి, ప్రత్యేక ప్రయోజనాలను పొందండి మరియు భూమి అభివృద్ధి భవిష్యత్తును రూపొందించండి।',
    
    // Location Section
    'location.findCommunity': 'మీ స్థానిక కమ్యూనిటీని కనుగొనండి',
    'location.description': 'మా క్రమానుగత స్థాన శోధన ద్వారా మీ ప్రాంతంలోని సభ్యులు, కమిటీ ప్రతినిధులు మరియు ఈవెంట్లను కనుగొనండి',
    
    // Membership Section
    'membership.title': 'సభ్యత్వ ఎంపికలు',
    'membership.description': 'మీ అవసరాలకు సరిపోయే సభ్యత్వాన్ని ఎంచుకోండి మరియు ప్రత్యేక ప్రయోజనాలను అన్లాక్ చేయండి',
    'membership.applyNow': 'ఇప్పుడే దరఖాస్తు చేయండి',
    
    // About Section
    'about.title': 'LDOAI గురించి',
    'about.description': 'లాండ్ డెవలపర్స్ & ఓనర్స్ అసోసియేషన్ ఆఫ్ ఇండియా (LDOAI) అనేది భారతదేశంలోని భూమి అభివృద్ధికారులు, ఆస్తి యజమానులు మరియు వాటాదారులను ఏకం చేయడానికి అంకితమైన జాతీయ సంస్థ.',
    'about.vision.title': 'మా దృష్టి',
    'about.vision.content': 'పారదర్శక అభివృద్ధి పద్ధతులను ప్రోత్సహించడం మరియు సంస్థాగత సహకారాన్ని బలోపేతం చేయడం ద్వారా భారతదేశవ్యాప్తంగా భూమి అభివృద్ధికారులు మరియు ఆస్తి యజమానులను ఏకం చేయడం మరియు శక్తివంతం చేయడం.',
    'about.mission.title': 'మా లక్ష్యం',
    'about.mission.content': 'అభివృద్ధి పద్ధతుల ప్రమాణీకరణ, సభ్యుల స్వరాలను విస్తరించడం, మరియు గ్రామం నుండి జాతీయ స్థాయి వరకు సుస్థిర అభివృద్ధిని ప్రేరేపించడం.',
    'about.structure.title': 'సంస్థ నిర్మాణం',
    'about.structure.content': 'LDOAI జాతీయ నుండి గ్రామ స్థాయి వరకు బహుళ-స్థాయి నిర్మాణం ద్వారా పనిచేస్తుంది, సమగ్ర ప్రాతినిధ్యాన్ని నిర్ధారిస్తుంది.',
    'about.learnMore': 'మరింత తెలుసుకోండి'
  },
  ta: {
    // Navigation
    'nav.membership': 'உறுப்பினர்',
    'nav.positions': 'பதவிகள்',
    'nav.about': 'எங்களைப் பற்றி',
    'nav.contact': 'தொடர்பு',
    'nav.joinNow': 'இப்போது சேரவும்',
    
    // Common Actions
    'joinNow': 'இப்போது சேரவும்',
    'becomeMember': 'உறுப்பினராகவும்',
    'applyForPosition': 'பதவிக்கு விண்ணப்பிக்கவும்',
    
    // Hero Section
    'hero.tagline': 'இந்தியாவின் முன்னணி நில அபிவிருத்தி சங்கம்',
    'hero.title1': 'நில சக்திவாய்ந்ததாக்கல்',
    'hero.title2': 'அபிவிருத்தியாளர்கள்',
    'hero.title3': 'இந்தியா முழுவதும்',
    'hero.description': 'இந்தியாவின் மிகவும் செல்வாக்குமிக்க சங்கத்தில் ஆயிரக்கணக்கான நில அபிவிருத்தியாளர்கள், சொத்து உரிமையாளர்கள் மற்றும் தொழில்துறை நிபுணர்களுடன் இணையுங்கள்। உங்கள் உள்ளூர் சமூகத்துடன் இணைக்கவும், பிரத்யேக நன்மைகளை அணுகவும், நில அபிவிருத்தியின் எதிர்காலத்தை வடிவமைக்கவும்।',
    
    // Location Section
    'location.findCommunity': 'உங்கள் உள்ளூர் சமூகத்தைக் கண்டறியவும்',
    'location.description': 'எங்கள் படிநிலை இடம் தேடல் மூலம் உங்கள் பகுதியில் உறுப்பினர்கள், குழு பிரதிநிதிகள் மற்றும் நிகழ்வுகளைக் கண்டறியவும்'
  },
  kn: {
    // Navigation
    'nav.membership': 'ಸದಸ್ಯತ್ವ',
    'nav.positions': 'ಸ್ಥಾನಗಳು',
    'nav.about': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'nav.contact': 'ಸಂಪರ್ಕ',
    'nav.joinNow': 'ಈಗ ಸೇರಿ',
    
    // Common Actions
    'joinNow': 'ಈಗ ಸೇರಿ',
    'becomeMember': 'ಸದಸ್ಯರಾಗಿ',
    'applyForPosition': 'ಸ್ಥಾನಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    
    // Hero Section
    'hero.tagline': 'ಭಾರತದ ಪ್ರಮುಖ ಭೂಮಿ ಅಭಿವೃದ್ಧಿ ಸಂಘ',
    'hero.title1': 'ಭೂಮಿ ಸಬಲೀಕರಣ',
    'hero.title2': 'ಅಭಿವೃದ್ಧಿದಾರರು',
    'hero.title3': 'ಭಾರತದಾದ್ಯಂತ',
    'hero.description': 'ಭಾರತದ ಅತ್ಯಂತ ಪ್ರಭಾವಶಾಲಿ ಸಂಘದಲ್ಲಿ ಸಾವಿರಾರು ಭೂಮಿ ಅಭಿವೃದ್ಧಿದಾರರು, ಆಸ್ತಿ ಮಾಲೀಕರು ಮತ್ತು ಉದ್ಯಮ ವೃತ್ತಿಪರರೊಂದಿಗೆ ಸೇರಿ। ನಿಮ್ಮ ಸ್ಥಳೀಯ ಸಮುದಾಯದೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ, ವಿಶೇಷ ಪ್ರಯೋಜನಗಳನ್ನು ಪ್ರವೇಶಿಸಿ ಮತ್ತು ಭೂಮಿ ಅಭಿವೃದ್ಧಿಯ ಭವಿಷ್ಯವನ್ನು ರೂಪಿಸಿ।',
    
    // Location Section
    'location.findCommunity': 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಸಮುದಾಯವನ್ನು ಹುಡುಕಿ',
    'location.description': 'ನಮ್ಮ ಶ್ರೇಣಿಬದ್ಧ ಸ್ಥಳ ಹುಡುಕಾಟದ ಮೂಲಕ ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಸದಸ್ಯರು, ಸಮಿತಿ ಪ್ರತಿನಿಧಿಗಳು ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ'
  },
  ml: {
    // Navigation
    'nav.membership': 'അംഗത്വം',
    'nav.positions': 'തസ്തികകൾ',
    'nav.about': 'ഞങ്ങളെക്കുറിച്ച്',
    'nav.contact': 'ബന്ധപ്പെടുക',
    'nav.joinNow': 'ഇപ്പോൾ ചേരുക',
    
    // Common Actions
    'joinNow': 'ഇപ്പോൾ ചേരുക',
    'becomeMember': 'അംഗമാകുക',
    'applyForPosition': 'സ്ഥാനത്തിനായി അപേക്ഷിക്കുക',
    
    // Hero Section
    'hero.tagline': 'ഇന്ത്യയിലെ പ്രമുഖ ഭൂമി വികസന അസോസിയേഷൻ',
    'hero.title1': 'ഭൂമി ശാക്തീകരണം',
    'hero.title2': 'ഡെവലപ്പർമാർ',
    'hero.title3': 'ഇന്ത്യയിലുടനീളം',
    'hero.description': 'ഇന്ത്യയിലെ ഏറ്റവും സ്വാധീനമുള്ള അസോസിയേഷനിൽ ആയിരക്കണക്കിന് ഭൂമി ഡെവലപ്പർമാർ, പ്രോപ്പർട്ടി ഉടമകൾ, വ്യവസായ പ്രൊഫഷണലുകൾ എന്നിവരോടൊപ്പം ചേരുക। നിങ്ങളുടെ പ്രാദേശിക കമ്മ്യൂണിറ്റിയുമായി ബന്ധപ്പെടുക, പ്രത്യേക ആനുകൂല്യങ്ങൾ ആക്സസ് ചെയ്യുക, ഭൂമി വികസനത്തിന്റെ ഭാവി രൂപപ്പെടുത്തുക।',
    
    // Location Section
    'location.findCommunity': 'നിങ്ങളുടെ പ്രാദേശിക കമ്മ്യൂണിറ്റിയെ കണ്ടെത്തുക',
    'location.description': 'ഞങ്ങളുടെ ശ്രേണിബദ്ധമായ ലൊക്കേഷൻ സെർച്ച് വഴി നിങ്ങളുടെ പ്രദേശത്തെ അംഗങ്ങൾ, കമ്മിറ്റി പ്രതിനിധികൾ, ഇവന്റുകൾ എന്നിവ കണ്ടെത്തുക'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
