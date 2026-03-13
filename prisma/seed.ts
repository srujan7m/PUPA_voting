
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

const teamData: { name: string; description: string; members: string }[] = [
  // AI/ML (24 teams)
  { name: 'NeuralTrace', description: 'Deep learning platform that detects anomalies in industrial IoT sensor streams in real-time, reducing equipment downtime by 60%.', members: 'Aisha Patel, Connor Walsh, Mei Zhang' },
  { name: 'VisionHarvest', description: 'Computer vision system for automated crop disease detection using drone imagery and convolutional neural networks.', members: 'Ravi Kumar, Sofia Alvarez, James Okon' },
  { name: 'ChurnGuard', description: 'Predictive analytics engine that identifies at-risk customers 90 days before churn with 85% accuracy using behavioral signals.', members: 'Linda Chen, Omar Hassan, Priya Nair' },
  { name: 'DocuMind', description: 'NLP-powered document intelligence platform that automates extraction and classification of legal contracts at scale.', members: 'Ethan Brooks, Fatima Ali, Yuki Tanaka' },
  { name: 'SpeakEasy AI', description: 'Real-time multilingual speech translation model with sub-150ms latency, supporting 42 languages for live conferences.', members: 'Carlos Reyes, Nadia Osei, Samuel Park' },
  { name: 'FraudLens', description: 'Graph neural network system for financial fraud detection that processes 2M transactions per second with near-zero false positives.', members: 'Anika Müller, Tobias Johansson, Layla Ahmad' },
  { name: 'PathfinderAI', description: 'Reinforcement learning agent that optimizes warehouse pick-and-pack routes, increasing throughput by 45%.', members: 'Noah Williams, Rin Sato, Amara Diallo' },
  { name: 'SentinelMed', description: 'AI-powered radiology assistant that flags abnormalities in chest X-rays, achieving radiologist-level sensitivity.', members: 'Dr. Elena Voss, Jake Turner, Preethi Rajan' },
  { name: 'ContextBot', description: 'Fine-tuned LLM framework for enterprise customer support that reduces ticket resolution time from 48h to under 4h.', members: 'Marcus Lee, Ingrid Bergmann, Tolu Adeyemi' },
  { name: 'GridPredict', description: 'Time-series forecasting model for electricity demand prediction, enabling utilities to reduce reserve margin costs by 20%.', members: 'Sven Larsson, Chioma Eze, Arjun Gupta' },
  { name: 'MotionSense', description: 'On-device gesture recognition engine for AR/VR headsets with 98.7% accuracy at 3mW power consumption.', members: 'Hana Kim, Diego Morales, Beatrice Owens' },
  { name: 'ResumeRank', description: 'Bias-aware AI recruiting tool that scores candidates on skills and competencies while flagging demographic disparities.', members: 'Mia Thompson, Kwame Acheampong, Zara Shah' },
  { name: 'AudioScope', description: 'Self-supervised audio analysis platform for predictive maintenance of rotating machinery, requiring zero labeled data.', members: 'Luca Ferrari, Ayasha Running Bear, Jin Ho Park' },
  { name: 'AlphaCode Assistant', description: 'Automated code review LLM trained on 50M pull requests, catching security vulnerabilities before merge.', members: 'Theo Bennett, Naledi Dlamini, Ivan Petrov' },
  { name: 'ClimateNet', description: 'Ensemble deep learning model that downscales climate simulations from 100km to 1km resolution for local risk assessment.', members: 'Rosa Fernandez, Hiroshi Yamamoto, Amina Diallo' },
  { name: 'PriceOracle', description: 'Dynamic pricing recommendation engine for e-commerce that optimizes margin vs. conversion using contextual bandits.', members: 'Brendan O\'Neill, Shreya Kapoor, Olga Sokolova' },
  { name: 'SoilScan AI', description: 'Hyperspectral imaging AI that predicts soil nutrient content from satellite data, guiding precision fertilization.', members: 'Kofi Mensah, Valentina Romano, Ray Hutchins' },
  { name: 'SemanticSearch Pro', description: 'Vector-based enterprise search engine that understands intent, returning 3x more relevant results than keyword search.', members: 'Yusuf Adebayo, Charlotte Baker, Nikhil Sharma' },
  { name: 'DriveAssist AI', description: 'Pedestrian behavior prediction model for autonomous vehicles trained on 10M video clips from 50 global cities.', members: 'Li Wei, Fatou Diallo, Patrick Sullivan' },
  { name: 'AgroYield', description: 'Crop yield prediction model combining satellite, weather, and soil datasets to advise farmers on optimal harvest windows.', members: 'Ayaan Khan, Chidinma Obi, Lars Nielsen' },
  { name: 'LegalEagle AI', description: 'Contract risk scoring AI that identifies unfavorable clauses and benchmarks them against industry standards.', members: 'Isabella Costa, Mikhail Volkov, Asel Nurlanovna' },
  { name: 'RetailVision', description: 'In-store customer journey analytics using overhead cameras and pose estimation to optimize shelf layout and staffing.', members: 'Caleb Hudson, Binta Camara, Ananya Roy' },
  { name: 'ToxiFilter', description: 'Real-time content moderation model that detects hate speech in 60 languages with 99.1% precision for social platforms.', members: 'Miriam Goldstein, Daisuke Nakamura, Folake Oduya' },
  { name: 'HeartBeat AI', description: 'Wearable ECG anomaly detection model that alerts users to arrhythmias 30 minutes before clinical symptoms appear.', members: 'Dr. Amira Hassan, Tom Langley, Soo-Jin Park' },
  { name: 'BrainMap AI', description: 'fMRI-based neural activity mapping platform that correlates cognitive task performance with brain region activation for neuroscience research.', members: 'Dr. Emeka Obi, Sari Nieminen, Leo Tanaka' },
  { name: 'SwarmOptima', description: 'Multi-agent reinforcement learning system that solves large-scale combinatorial logistics problems 100x faster than classical solvers.', members: 'Bolu Adesanya, Karin Lindgren, Yusuke Morita' },

  // Sustainability (26 teams)
  { name: 'CarbonLedger', description: 'Blockchain-anchored carbon footprint tracker for supply chains that provides immutable Scope 3 emissions reporting.', members: 'Nina Schmidt, Emeka Okafor, Cleo Martinez' },
  { name: 'OceanLoop', description: 'Biodegradable bioplastic made from red algae that decomposes in seawater within 30 days, replacing single-use packaging.', members: 'Finn Eriksen, Maya Patel, Seun Adeleye' },
  { name: 'UrbanForest', description: 'AI-driven urban tree canopy planning tool that maximizes cooling effect and biodiversity per square meter of green space.', members: 'Zoe Clarke, Raphael Bello, Ingrid Svensson' },
  { name: 'WasteSortr', description: 'Smart recycling bin with computer vision that auto-sorts waste streams and reports contamination rates to municipalities.', members: 'Yemi Adeyinka, Grace Otieno, Bart De Vries' },
  { name: 'RainHarvest Pro', description: 'Modular IoT rainwater harvesting system for residential buildings that integrates with local weather forecasts for optimal collection.', members: 'Arjuna Pereira, Tsehaye Haile, Lucía Gómez' },
  { name: 'GreenByte', description: 'Software-defined power management for data centers that reduces PUE to 1.1 using workload-aware cooling and server consolidation.', members: 'Felix Wagner, Adaeze Nwosu, Erik Lindström' },
  { name: 'SolarDrape', description: 'Flexible perovskite solar panels printed on textile substrate for integration into building facades and awnings.', members: 'Sunita Rao, Kieran Murphy, Oluwaseun Bello' },
  { name: 'FoodSavr', description: 'Predictive spoilage detection for grocery chains using near-infrared sensors and ML, cutting food waste by 35%.', members: 'Hanna Müller, DeShawn Carter, Priti Verma' },
  { name: 'BioChar Pro', description: 'Pyrolysis system that converts agricultural waste into biochar and syngas, sequestering carbon and improving soil fertility.', members: 'Kwabena Asante, Yuki Ito, Sara Lindqvist' },
  { name: 'TextileLoop', description: 'Enzymatic recycling process that depolymerizes blended cotton-polyester garments into virgin-quality feedstock.', members: 'Camille Dupont, Obi Okonkwo, Anisah Rahman' },
  { name: 'FloodGuard', description: 'Community-level flood resilience platform combining hydrological modeling and crowd-sourced sensor data for early warning.', members: 'Renzo Bianchi, Adwoa Mensah, Tran Thi Mai' },
  { name: 'ElectroReclaim', description: 'Hydrometallurgical process for recovering lithium and cobalt from EV batteries at 95% efficiency without hazardous acids.', members: 'Klara Hoffmann, Babajide Oladipo, Nils Hansson' },
  { name: 'AquaSync', description: 'Precision irrigation controller that slashes agricultural water usage by 50% using real-time soil moisture and ET data.', members: 'Aditya Menon, Lina Sørensen, Thandiwe Mokoena' },
  { name: 'EcoScore', description: 'Life cycle assessment SaaS that gives products a comparable eco-score, helping consumers make informed purchasing decisions.', members: 'Haruto Suzuki, Nneka Ibe, Viktor Novak' },
  { name: 'VerdantRoof', description: 'Modular living roof system with automated irrigation, insulation monitoring, and biodiversity tracking for commercial buildings.', members: 'Beatriz Oliveira, Chukwudi Eze, Petra Hansen' },
  { name: 'PlasticMine', description: 'Mechanical-chemical plastic upcycling process that converts ocean plastic into high-strength composite construction panels.', members: 'Andile Sithole, Fumiko Watanabe, Tom Gallagher' },
  { name: 'CleanCement', description: 'Geopolymer concrete formulation using industrial slag and fly ash, reducing embodied carbon by 80% vs. Portland cement.', members: 'Santiago Herrera, Miriam Olu, Piotr Kowalski' },
  { name: 'NetZero Dash', description: 'Real-time organizational carbon dashboard pulling data from ERP, travel, and utilities to project net-zero pathways.', members: 'Ailsa Murray, Tunde Obi, Martina Kovačević' },
  { name: 'SunStore', description: 'Compressed air energy storage system co-located with community solar farms, providing 24h dispatchable renewable power.', members: 'Liam O\'Brien, Farida Haidari, Denzel Osei' },
  { name: 'MangroveMap', description: 'Satellite-based mangrove health monitoring platform for conservation orgs, detecting degradation weeks before visible die-off.', members: 'Ana Souza, Rashid Khalid, Hilde Bergqvist' },
  { name: 'CircularMFG', description: 'Industrial symbiosis marketplace connecting factories to trade waste streams as inputs, creating zero-waste industrial clusters.', members: 'Joshua Egan, Comfort Asante, Torbjørn Lie' },
  { name: 'MicroGrid Hub', description: 'Peer-to-peer energy trading platform for neighborhood microgrids that balances supply-demand in real time using token incentives.', members: 'Mei-Lin Wu, Chukwuemeka Diala, Petra Virtanen' },
  { name: 'ResinRevive', description: 'Chemical depolymerization of epoxy resin composites from wind turbine blades, enabling true end-of-life recycling.', members: 'Bogdan Ionescu, Yewande Adeyemo, Sigrid Larsen' },
  { name: 'CoolPave', description: 'High-albedo cool pavement coating that reduces urban heat island effect by 4°C and cuts stormwater runoff by 30%.', members: 'Mariam Coulibaly, Eoin Brennan, Yuki Kato' },
  { name: 'TerraBloom', description: 'Mycelium-based packaging grown from agricultural residues that fully composites in 45 days, replacing expanded polystyrene.', members: 'Adaeze Nko, Finn Christensen, Naoko Sato' },
  { name: 'AquaPure Grid', description: 'Solar-powered atmospheric water generation network for off-grid villages, producing 500L/day from humidity with zero infrastructure.', members: 'Nana Asante, Björn Holm, Priya Sharma' },

  // Healthcare (26 teams)
  { name: 'VeinView', description: 'Near-infrared vein visualization device that reduces IV insertion failure rates by 70% in pediatric and elderly patients.', members: 'Dr. Sophie Carter, Jamal Robinson, Anita Krishnamurthy' },
  { name: 'DermAI', description: 'Smartphone-based skin cancer screening AI achieving dermatologist-level AUC of 0.94 for melanoma detection.', members: 'Hugo Brandt, Chisom Okafor, Leila Rostami' },
  { name: 'PillPal', description: 'Smart pill dispenser with facial recognition and IoT connectivity that improves medication adherence for chronic disease patients to 96%.', members: 'Esi Owusu, Marco Ricci, Danielle Fontaine' },
  { name: 'NeuroCoach', description: 'Digital therapy platform for post-stroke motor rehab using gamified exercises and EMG biofeedback, accelerating recovery by 40%.', members: 'Dr. Yi Chen, Ben Omalley, Amara Sesay' },
  { name: 'InfantGuard', description: 'Wearable patch for neonatal ICU patients that continuously monitors oxygen saturation, heart rate, and temperature without wires.', members: 'Emma Walsh, Taiwo Adeleke, Parvati Singh' },
  { name: 'GutCheck AI', description: 'AI analysis of gut microbiome sequencing data to predict IBD flares 3 weeks in advance and recommend dietary interventions.', members: 'Kenji Mori, Blessing Nwachukwu, Astrid Erikson' },
  { name: 'SightsAhead', description: 'AI-powered retinal screening device for detecting diabetic retinopathy in low-resource settings with no ophthalmologist required.', members: 'Dr. Kwame Darko, Nora Heinemann, Rizwan Malik' },
  { name: 'SurgiSim', description: 'Photorealistic surgical simulation platform using patient-specific 3D models for pre-operative planning and resident training.', members: 'Dr. Asel Abenova, Dmitri Volkov, Chiara Murino' },
  { name: 'MindBridge', description: 'AI mental health companion that detects crisis signals in user messages and routes high-risk users to crisis counselors in <2 minutes.', members: 'Samira Haddad, Josh Prentice, Yemi Ojo' },
  { name: 'BioSensor Band', description: 'Continuous glucose monitoring wristband using photoacoustic spectroscopy, eliminating finger-prick tests for diabetics.', members: 'Wei Huang, Amelia Santos, Remy Moreau' },
  { name: 'OncoPrint', description: '3D-bioprinted patient-specific tumor organoids for drug sensitivity testing, enabling personalized chemotherapy in 72 hours.', members: 'Dr. Yara Al-Farsi, Colin O\'Sullivan, Ayesha Bajwa' },
  { name: 'AirCheck', description: 'Portable spirometer with AI analysis that detects early COPD and asthma exacerbations via breath pattern changes.', members: 'Roberta Esposito, Fiifi Mensah, Charlotte Dumont' },
  { name: 'WoundWatch', description: 'Smartphone app using polarized light imaging and ML to track chronic wound healing progress and predict infection risk.', members: 'Dr. Olumide Adeyemi, Kaisa Leinonen, Ravi Pandit' },
  { name: 'CancerPredictX', description: 'Multi-modal AI that fuses genomics, proteomics, and clinical data to predict cancer recurrence post-surgery with 89% accuracy.', members: 'Dr. Sarah Jung, Bernard Otieno, Francesca Giordano' },
  { name: 'SeizureShield', description: 'Predictive EEG-based wearable that alerts caregivers 30 minutes before a seizure onset for epilepsy patients.', members: 'Tobi Adesanya, Linh Nguyen, Pavel Horák' },
  { name: 'LumenPath', description: 'Capsule endoscopy AI that auto-annotates GI bleeding sites and polyps, reducing gastroenterologist review time by 80%.', members: 'Dr. Ana Kovačić, Samuel Boateng, Iris Bakker' },
  { name: 'SilentMigraine', description: 'Migraine prediction app using sleep, HRV, and barometric data, correctly anticipating 78% of episodic migraine attacks.', members: 'Claire Beaumont, Taiwo Olawale, Matteo Visconti' },
  { name: 'GeneGuide', description: 'Consumer genetic report platform with clinician-reviewed BRCA/Lynch syndrome risk interpretation and actionable care pathways.', members: 'Dr. Rebecca Wu, Adaeze Obiora, Stefan Krämer' },
  { name: 'RehabRobot', description: 'Affordable upper-limb exoskeleton for stroke rehabilitation that uses adaptive impedance control to guide movement recovery.', members: 'Dr. Ahmed Siddiqui, Awa Diallo, Henning Andersen' },
  { name: 'SafeBirth', description: 'Low-cost partograph app for community midwives in LMICs that uses AI to detect obstructed labor before complications arise.', members: 'Dr. Grace Achebe, Mikael Lindström, Phoebe Asante' },
  { name: 'PharmaTrace', description: 'Blockchain-based pharmaceutical supply chain tracker that verifies drug authenticity at point-of-dispensing via QR scan.', members: 'Nnamdi Ekwueme, Hana Novotná, Marcus Andile' },
  { name: 'AllerAlert', description: 'Restaurant allergy management SaaS with real-time menu scanning and epinephrine auto-injector location mapping.', members: 'Lily Park, Obafemi Olanrewaju, Petra Simons' },
  { name: 'PsyScore', description: 'Digital biomarker platform that passively detects depression onset from smartphone usage patterns with clinical-grade sensitivity.', members: 'Dr. Muna Al-Jabri, Carlos Silva, Annika Holm' },
  { name: 'CareCircle', description: 'Family-centered elderly care coordination app with medication reminders, telehealth booking, and fall-detection integration.', members: 'Joanna Laurent, Babatunde Okeye, Seo-Yeon Han' },
  { name: 'NutriScan', description: 'Smartphone spectrometer attachment that detects nutrient content and pesticide residue in fresh produce at the point of purchase.', members: 'Adaeze Eze, Mikael Borg, Yui Kimura' },
  { name: 'BreathEasy', description: 'Wearable air quality wristband that tracks personal pollution exposure and recommends route changes for asthma and COPD patients.', members: 'Chinyere Obi, Lars Gustafsson, Sakura Nakamura' },

  // Mobility (26 teams)
  { name: 'FluxCharge', description: 'Dynamic wireless EV charging embedded in highway rumble strips, enabling charge-while-driving for long-haul electric trucks.', members: 'Anders Poulsen, Chidinma Aneke, Rafael Torres' },
  { name: 'AeroHop', description: 'Hydrogen fuel cell eVTOL for urban air mobility with 200km range and autonomous obstacle avoidance certified to EASA UC3.', members: 'Elan Nakamura, Damilola Afolabi, Marta Kovacs' },
  { name: 'CycloSafe', description: 'AI-powered cycling safety platform with blind-spot detection using radar attached to the handlebar and smart helmet display.', members: 'Petra Jónsson, Emre Demir, Nkechinyere Eze' },
  { name: 'CargoBot', description: 'Autonomous last-mile delivery robot for pedestrian zones operating on sidewalks with 6-hour endurance and 50kg payload.', members: 'Sven Martens, Olamide Oduntan, Yuki Nishida' },
  { name: 'TransitIQ', description: 'Real-time public transport optimization engine that adjusts bus frequency based on demand prediction, reducing headway by 30%.', members: 'Adaeze Ejiofor, Alistair MacLeod, Bianca Ferreira' },
  { name: 'SafeSchool Ride', description: 'School bus fleet management system with AI occupancy counting, route optimization, and parent live-tracking app.', members: 'Charlotte Mills, Abdullahi Sule, Jana Procházková' },
  { name: 'VeloShare', description: 'Dockless e-bike sharing system with predictive rebalancing algorithm that ensures 95% bike availability at top stations.', members: 'Hugo Leclerc, Chiamaka Obi, Bent Sørensen' },
  { name: 'AnchorPark', description: 'Underground automated parking carousel for dense urban areas that triples parking density on the same footprint.', members: 'Jorge Castellanos, Hera Johansdóttir, Kolade Adeyemo' },
  { name: 'SafePassage', description: 'Pedestrian crossing monitoring system using edge AI cameras that extends crossing time for elderly and disabled users automatically.', members: 'Mia Kristiansen, Temitope Bakare, Ngo Thi Lan' },
  { name: 'LoadXpress', description: 'Digital freight marketplace for Africa connecting SME shippers with verified truck operators, reducing empty-leg rates by 55%.', members: 'Emeka Nwosu, Elena Bogdanova, Luuk Van Der Berg' },
  { name: 'HyperTunnel', description: 'Ground-penetrating robot swarm for hyper-accurate underground utility mapping, preventing 90% of accidental strikes during excavation.', members: 'Dr. Niall Crowley, Ama Owusu, Igor Petrov' },
  { name: 'DronePath', description: 'UTM (unmanned traffic management) platform for coordinating 1000+ simultaneous drone deliveries in urban airspace safely.', members: 'Fatimah Sultan, Tunde Bello, Lars Hoffmann' },
  { name: 'KinetiDrive', description: 'Regenerative hydraulic suspension system for trucks that captures energy from road vibrations, improving fuel efficiency by 8%.', members: 'Pablo Hernández, Chisom Okonkwo, Ingriður Sigurðardóttir' },
  { name: 'MaaS Connect', description: 'Mobility-as-a-Service platform integrating rail, bus, bike-share, and ride-hailing into a single subscription pass for commuters.', members: 'Ayesha Chaudhry, Rodrigo Cardoso, Sigrid Bakke' },
  { name: 'SaltRoute', description: 'Winter road safety platform using ML to predict ice formation hotspots and dispatch gritters 2 hours before freezing events.', members: 'Olaf Andersson, Ngozi Dike, Damian Lewandowski' },
  { name: 'AccessRide', description: 'On-demand wheelchair-accessible vehicle dispatch system with 15-minute guaranteed response time for para-transit users.', members: 'Zainab Musa, Finn Madsen, Yewande Ogunleye' },
  { name: 'SpeedSense', description: 'In-road piezoelectric speed trap that harvests energy from passing vehicles while enforcing speed limits with photographic evidence.', members: 'Mina Takahashi, Obinna Udeh, Mikael Nyström' },
  { name: 'TireIQ', description: 'AI tire health monitoring system using accelerometers and acoustic sensors to predict blowouts 500km before they occur.', members: 'Adaora Nwoke, Thibault Laurent, Won-Jae Kim' },
  { name: 'OmniPort', description: 'Autonomous port container terminal software reducing vessel turnaround time by 40% through AI crane and yard optimization.', members: 'Efua Mensah, Jochen Keller, Shruti Agarwal' },
  { name: 'AquaFreight', description: 'Electric autonomous inland waterway barge with solar assist for zero-emission bulk cargo transport on European canal networks.', members: 'Daan Van Houten, Chinenye Obi, Aarav Mehta' },
  { name: 'CrossGuard AI', description: 'Smart intersection management system using V2X communication to reduce junction accidents by 65% and cut idle time by 25%.', members: 'Selma Andersson, Obafemi Lagos, Hideo Matsumoto' },
  { name: 'FlightMaint', description: 'Predictive maintenance platform for commercial aircraft using vibration and thermal sensor fusion, cutting unscheduled AOG events by 50%.', members: 'Adebimpe Osakwe, Kjetil Sørby, Yuki Fujimoto' },
  { name: 'SonicRail', description: 'Acoustic rail defect detection system mounted on inspection drones that identifies cracks before they lead to derailments.', members: 'Olumide Ojo, Astrid Lindberg, Prakash Iyer' },
  { name: 'ScootSafe', description: 'E-scooter geofencing and speed management platform that enforces safe zones automatically and reduces pedestrian incidents by 80%.', members: 'Tolu Adegoke, Hanna Virtanen, Guillaume Pelletier' },
  { name: 'PortaFerry', description: 'Electric hydrofoil passenger ferry for island communities achieving 40-knot speeds with 120nm range on a single charge.', members: 'Emeka Dike, Ingvar Halldórsson, Rin Iwamoto' },
  { name: 'ParkSense', description: 'Underground ultrasonic parking availability network feeding a real-time city-wide map, reducing parking search time by 70%.', members: 'Folake Adeyemi, Steen Christiansen, Yuka Tanaka' },

  // Education (26 teams)
  { name: 'TutorFlow', description: 'AI personalized tutoring platform that adapts lesson plans to each student\'s learning speed, improving STEM test scores by 28%.', members: 'Amara Jallow, Ryan O\'Connell, Mei Nakamura' },
  { name: 'CodeFirst', description: 'Gamified coding curriculum for ages 8-14 using visual block programming that transitions to Python, engaging 98% class completion.', members: 'Fatima Diallo, Nico Baumann, Priya Srivastava' },
  { name: 'SignLearn', description: 'AR-based sign language learning app that uses hand-tracking to give real-time feedback on ASL/BSL sign accuracy.', members: 'Destiny Osei, Thomas Eriksen, Aiko Yamamoto' },
  { name: 'LitPath', description: 'Adaptive reading comprehension app for K-3 students with dyslexia support, phonics scaffolding, and parent progress dashboards.', members: 'Clara Nielsen, Tobi Disu, Aditi Kapoor' },
  { name: 'LabSim 3D', description: 'Immersive VR science lab for high schools, enabling safe chemistry and biology experiments without expensive consumables.', members: 'Yaw Darko, Simona Rossi, Jake Beaumont' },
  { name: 'MathMentis', description: 'Socratic AI math tutor that never gives answers directly but guides students to solutions through carefully crafted questions.', members: 'Deepa Menon, Samuel Osei, Hanna Bjornsdottir' },
  { name: 'TeachAssist', description: 'AI grading co-pilot that provides rubric-aligned feedback on 30 student essays in 10 minutes, reducing teacher burnout.', members: 'Amaka Okonkwo, Florian Weber, Yuna Park' },
  { name: 'GlobalLingo', description: 'Immersive language exchange platform pairing learners worldwide via video, with AI conversation partner fallback during off-hours.', members: 'Emilio Vega, Chiamaka Nwachukwu, Lars Andersen' },
  { name: 'SkillBridge', description: 'Micro-credential marketplace connecting employers with learners, offering bite-sized industry-verified courses with job-placement guarantees.', members: 'Bolu Olusanya, Monika Wieczorek, Nguyen Duc' },
  { name: 'NeuroLearn', description: 'EEG-based attention monitoring tool for classrooms that alerts teachers when student focus drops, enabling timely intervention.', members: 'Dr. Tom Harrington, Nadia Osei, Yuki Suzuki' },
  { name: 'SafeSpace EDU', description: 'Anti-bullying early warning system for schools that detects patterns of social exclusion before incidents escalate to intervention.', members: 'Ife Adeyemi, Carolina Gomez, Mikkel Larsen' },
  { name: 'PeerTutor AI', description: 'Intelligent matching platform connecting university students for peer tutoring sessions based on learning style and subject proficiency.', members: 'Adaeze Obi, Ethan Walsh, Mana Tanaka' },
  { name: 'MinoritySTEM', description: 'Mentorship and scholarship platform specifically for underrepresented groups in STEM, with industry partner sponsorships.', members: 'Abiodun Akinola, Rosa Casanova, Freya Hansen' },
  { name: 'StorySpark', description: 'AI story generation tool for primary school teachers that creates culturally relevant local-language reading materials in 5 minutes.', members: 'Efua Aidoo, Jakub Novák, Aisha Usman' },
  { name: 'ExamShield', description: 'AI-powered proctoring system using behavioral analysis and environment detection, reducing online exam cheating by 94%.', members: 'Chukwudi Ngozi, Lara Johansson, Kenji Nakamura' },
  { name: 'FinLit Junior', description: 'Financial literacy game for teenagers that simulates real budgeting, investing, and debt scenarios, improving financial decision-making.', members: 'Adunola Olasukanmi, Piotr Wiśniewski, Yona Shimizu' },
  { name: 'CareerCanvas', description: 'AI career guidance platform for high school students that maps strengths to emerging job roles and plots personalized learning paths.', members: 'Olumide Taiwo, Karin Blom, Neha Joshi' },
  { name: 'AccessEDU', description: 'Offline-first mobile learning platform for students in low-connectivity regions, syncing progress when internet is available.', members: 'Akosua Asante, Mattias Ekberg, Rina Mehta' },
  { name: 'HapticBraille', description: 'Refreshable haptic braille display combined with a reading assistant AI for visually impaired students in mainstream classrooms.', members: 'Dr. Sena Amankwah, Leo Fontaine, Parisa Sadeghi' },
  { name: 'ChromaChem', description: 'Color-coded interactive periodic table AR experience bridging the gap between abstract chemistry concepts and visual learners.', members: 'Ade Olatunji, Freija Niinimäki, Takeshi Kimura' },
  { name: 'ParentPulse', description: 'Parent engagement portal with AI insights connecting home learning behaviors to classroom performance for K-8 teachers.', members: 'Chinwe Obiora, Arnar Sigurdsson, Piya Sharma' },
  { name: 'GameTeach', description: 'History and geography curriculum delivered through Minecraft-style immersive world-building, engaging kinesthetic learners.', members: 'Babajide Oladele, Lieselotte Becker, Saki Watanabe' },
  { name: 'SpeechStar', description: 'AI speech therapy app for children with articulation disorders that provides 30-minute daily exercises with real-time feedback.', members: 'Dr. Amina B. Keita, Magnus Johansson, Sunita Reddy' },
  { name: 'SchoolShield', description: 'School safety platform integrating visitor management, lockdown communication, and drill simulation for administrators.', members: 'Emeka Ike, Mathilde Dumont, Yuki Ogawa' },
  { name: 'MindMap EDU', description: 'AI-generated concept map builder that visualizes knowledge gaps across a syllabus and creates personalised revision schedules.', members: 'Adunola Bello, Kristoffer Hansen, Sae Yoshida' },
  { name: 'RoboClass', description: 'Affordable tabletop robotics kit with curriculum-aligned STEM challenges that teaches coding, engineering, and teamwork for grades 4-8.', members: 'Nkechi Olu, Johan Lindberg, Arisa Watanabe' },

  // Energy (26 teams)
  { name: 'FusionMini', description: 'Compact inertial confinement fusion reactor design targeting net energy gain at the megawatt scale for distributed power.', members: 'Dr. Nadia Petrov, Solomon Asante, Erik Strand' },
  { name: 'ThermoHarvest', description: 'Solid-state thermoelectric generator that extracts electricity from industrial waste heat at efficiencies of 18% using nanostructured materials.', members: 'Yemi Adeleke, Liselotte Svensson, Ravi Chandra' },
  { name: 'WindFloat', description: 'Offshore floating vertical-axis wind turbine rated for 15MW in water depths exceeding 200m, opening new deep-sea wind resources.', members: 'Espen Thorvaldsen, Adaeze Achebe, Lin Wei' },
  { name: 'IronFlow', description: 'Iron-air flow battery for grid storage with 100-hour discharge, using earth-abundant materials and no lithium or cobalt.', members: 'Kwaku Asante, Charlotte Lindqvist, Arjun Bhat' },
  { name: 'SolarSwarm', description: 'Autonomous drone swarm system for cleaning utility-scale solar PV panels, recovering 15% lost yield from soiling without water.', members: 'Taiwo Bankole, Pia Andersson, Jae-Won Kim' },
  { name: 'Pyro2Power', description: 'Waste-to-energy pyrolysis plant design achieving net energy output from mixed municipal solid waste with zero landfill residual.', members: 'Nnamdi Chibuike, Elsa Magnusson, Vikram Nair' },
  { name: 'HeatPumpOS', description: 'AI heat pump controller that optimizes COP dynamically based on weather forecasts, occupancy, and grid pricing, cutting bills by 35%.', members: 'Ifeoma Chukwu, Bengt Larsen, Keito Yamamoto' },
  { name: 'OrcaWave', description: 'Oscillating surge wave energy converter rated for 2MW per unit, deployable in 30-50m coastal waters for island grids.', members: 'Aoife Murphy, Samuel Kwofie, Mikhail Sorokin' },
  { name: 'NanoSolar', description: 'Quantum dot solar cell achieving 42% efficiency in lab conditions via multi-exciton generation, targeting 35% in commercial panels by 2027.', members: 'Dr. Hiro Fujita, Amara Conteh, Elena Drăghici' },
  { name: 'SmartSubstation', description: 'AI-powered digital substation management system reducing grid switching time from minutes to milliseconds, improving resilience.', members: 'Kelechi Okonkwo, Birgit Hoffmann, Anand Rao' },
  { name: 'GeoLoop', description: 'Enhanced geothermal system using advanced closed-loop borehole arrays to tap geothermal energy anywhere without aquifer access.', members: 'Tunde Olaniyan, Sigríður Björnsdóttir, Prashant Kulkarni' },
  { name: 'AmmoniaPower', description: 'Green ammonia fuel cell stack for marine vessels with 2MW output, enabling zero-emission ocean freight with existing ammonia infrastructure.', members: 'Oluwafemi Adeyemo, Siri Thorsen, Karim Mansour' },
  { name: 'LithioMax', description: 'AI-optimized lithium extraction from geothermal brine using selective sorbent technology, with zero freshwater consumption.', members: 'Adesola Ogundimu, Marta Wasilewski, Jae-Hyun Kim' },
  { name: 'GridEdge', description: 'Distributed energy resource management system (DERMS) that aggregates rooftop solar and home batteries into virtual power plants.', members: 'Chukwuemeka Ikenna, Elisabetta Valenti, Ryo Tanaka' },
  { name: 'BioGas Pro', description: 'Modular anaerobic digestion unit for food waste from supermarkets, generating biogas and biofertilizer on site.', members: 'Ngozi Eze, Håkon Mathisen, Priya Kakkar' },
  { name: 'VolcanicPower', description: 'Magma energy tapping research project drilling into eruptible magma chambers to access 600°C heat for next-gen geothermal.', members: 'Dr. Eir Magnúsdóttir, Oluwasegun Adeyemi, Takuya Kato' },
  { name: 'ElectroCat', description: 'Novel transition metal dichalcogenide electrocatalyst for green hydrogen production achieving 92% Faradaic efficiency at scale.', members: 'Adaeze Okereke, Otto Nielsen, Haruki Ishikawa' },
  { name: 'StorAgri', description: 'Gravity energy storage system using excess renewable electricity to lift heavy agricultural equipment, releasing it on demand.', members: 'Afolabi Oluwatobi, Astrid Magnusson, Dhruv Kapoor' },
  { name: 'TidalEdge', description: 'Tidal stream turbine with variable blade pitch achieving 45% capacity factor in estuaries, competitive with offshore wind LCOE.', members: 'Seye Afolabi, Malin Lindström, Kartik Singh' },
  { name: 'BlazeBattery', description: 'Sodium-ion battery pack for residential storage outperforming LFP on cycle life and safety with 30% lower material cost.', members: 'Amara Touré, Leif Andersen, Rina Yoshida' },
  { name: 'ZoneEnergy', description: 'Hyperlocal energy zone management for industrial parks, matching on-site renewable generation to industrial loads in real time.', members: 'Taiwo Ogundele, Karin Strömberg, Neel Patel' },
  { name: 'MethaneTrap', description: 'Mobile methane capture unit deployable at landfills and wastewater plants to convert fugitive emissions into pipeline-quality gas.', members: 'Chinyere Oduya, Palle Jensen, Takahiro Watanabe' },
  { name: 'CrystalCell', description: 'Perovskite-silicon tandem solar module exceeding 33% efficiency in standardized test conditions using low-temperature solution processing.', members: 'Oluwakemi Adeyemo, Mikael Bergström, Sumit Bose' },
  { name: 'ThermalBank', description: 'Industrial-scale molten salt thermal energy storage system storing excess renewable heat for 12-hour industrial process supply.', members: 'Ifeoluwa Ogundipe, Pernille Madsen, Hiroki Sato' },
  { name: 'CopperSun', description: 'Concentrated solar power plant using liquid copper as heat transfer fluid to achieve temperatures of 1200°C for industrial decarbonisation.', members: 'Akin Olayinka, Sigrún Magnúsdóttir, Takashi Morita' },
  { name: 'EcoHydrogen', description: 'Photoelectrochemical water-splitting device achieving solar-to-hydrogen efficiency of 20% using earth-abundant bismuth vanadate catalysts.', members: 'Chiamaka Okeke, Nils Abrahamsson, Ren Fujimoto' },

  // Web3 (24 teams — makes up 180 total)
  { name: 'DecentralID', description: 'Self-sovereign identity protocol on Ethereum allowing users to own and share verifiable credentials without centralized authorities.', members: 'Adaeze Obi, Erik Lindqvist, Zhang Wei' },
  { name: 'ChainVote', description: 'Blockchain-based e-voting platform with zero-knowledge proofs ensuring ballot privacy and verifiable outcome integrity.', members: 'Segun Afolabi, Maja Kovačević, Taro Yoshida' },
  { name: 'NFT Health', description: 'Patient-controlled health record system storing encrypted data on IPFS with NFT-gated access tokens for healthcare providers.', members: 'Nkechi Eze, Bruno Dubois, Ananya Iyer' },
  { name: 'DeFi Trade', description: 'Decentralized cross-chain DEX aggregator using intent-based trading to achieve best execution across 15 blockchains.', members: 'Temi Adesanya, Arvo Kivisik, Keiko Fujiwara' },
  { name: 'DAO Pulse', description: 'Governance analytics platform for DAOs that tracks voter participation, proposal quality, and treasury health with actionable insights.', members: 'Emmanuel Osei, Alma Mäkinen, Shota Nishimura' },
  { name: 'GreenToken', description: 'Tokenized carbon credit marketplace on Polygon that enables fractional ownership and transparent retirement tracking.', members: 'Adunola Adeyemi, Pieter De Boer, Hayato Tanaka' },
  { name: 'MusicNFT', description: 'Music rights management protocol using smart contracts to automate royalty splits in real time for all streaming platforms.', members: 'Kolade Bello, Sigurður Jónsson, Mika Inaba' },
  { name: 'DataFair', description: 'Decentralized data marketplace where individuals monetize their own personal data with granular consent and blockchain audit trails.', members: 'Amaka Chukwu, Olaf Svensson, Kaito Yamamoto' },
  { name: 'LandChain', description: 'Blockchain-based land registry system piloted in sub-Saharan Africa to prevent title fraud and enable collateral-backed microloans.', members: 'Adeyemi Olawale, Ingrid Christiansen, Ryusei Kobayashi' },
  { name: 'GameFi Arena', description: 'Play-to-earn gaming protocol with cross-game asset portability using ERC-6551 token-bound accounts for true item ownership.', members: 'Chidubem Okonkwo, Sofía Mendoza, Haruto Ito' },
  { name: 'ZK Payroll', description: 'Privacy-preserving payroll protocol using ZKPs to prove salary ranges for renting or lending without revealing exact figures.', members: 'Oluwatobi Ade, Karin Nilsson, Tsubasa Ogawa' },
  { name: 'InsureChain', description: 'Parametric smart contract insurance platform for smallholder farmers paying out automatically based on weather oracle data.', members: 'Emeka Uchenna, Birgitta Larsson, Kazuya Fujii' },
  { name: 'ReputeLink', description: 'On-chain professional reputation protocol enabling portable, tamper-proof work history with stake-based endorsement incentives.', members: 'Oladipo Fadara, Hanne Eriksen, Daisuke Nishimura' },
  { name: 'AidChain', description: 'Transparent humanitarian aid distribution system using stablecoins and smart contracts to ensure funds reach intended beneficiaries.', members: 'Bisi Adewale, Magnus Thorvaldsson, Miyu Kato' },
  { name: 'DePin Grid', description: 'Decentralized physical infrastructure network for deploying and monetizing community-owned LoRaWAN IoT hotspots globally.', members: 'Adeyinka Ojo, Rasmus Pedersen, Rin Nakamura' },
  { name: 'SocialGraph', description: 'Decentralized social graph protocol allowing users to migrate their followers and content between Web3 social apps seamlessly.', members: 'Olamide Akintunde, Erika Lindgren, Ken Watanabe' },
  { name: 'ZeroFee Rail', description: 'Layer-2 zkEVM rollup optimized for micropayments enabling sub-cent transaction fees for emerging market mobile payment apps.', members: 'Ayo Akinola, Sigrid Hoffman, Sota Yamada' },
  { name: 'TrueSupply', description: 'End-to-end supply chain provenance tracker on Hyperledger Fabric for luxury goods, curbing counterfeit products at customs.', members: 'Uche Okafor, Ebba Strand, Hiroshi Okamoto' },
  { name: 'EduCredential', description: 'W3C Verifiable Credentials framework for academic institutions to issue tamper-proof digital diplomas and transcripts globally.', members: 'Adaeze Nwogu, Stine Andersen, Kohei Matsumoto' },
  { name: 'FractRE', description: 'Fractional real estate tokenization platform on Base allowing retail investors to own fractions of rental properties from $100.', members: 'Olumide Ogunyemi, Solveig Bergström, Naoto Fujita' },
  { name: 'DeFi Shield', description: 'On-chain protocol insurance pool offering coverage against smart contract exploits via community underwriting and AI risk models.', members: 'Temitayo Badmus, Lena Johansson, Akira Hayashi' },
  { name: 'MetaCommerce', description: 'Open standard for Web3 e-commerce enabling persistent shopping carts and loyalty points across metaverse platforms.', members: 'Chikaodi Ozo, Ulrika Svensson, Shinji Yamamoto' },
  { name: 'BioVerify', description: 'Decentralized biometric identity layer using zero-knowledge proofs to enable KYC compliance without exposing personal data to any third party.', members: 'Adeola Ojo, Sven Kristoffersen, Haruka Miyamoto' },
  { name: 'SmartEstate', description: 'Smart contract platform for automating inheritance and estate transfers with on-chain will execution and multi-party beneficiary verification.', members: 'Emeka Okonkwo, Katrin Bergström, Ryota Endo' },
];

async function main() {
  console.log('Seeding 180 teams...');

  // Clear all voting/test data so production starts clean.
  await prisma.vote.deleteMany();
  await prisma.pendingVote.deleteMany();
  await prisma.voter.deleteMany();

  // Recreate teams from scratch.
  await prisma.project.deleteMany();

  const inserts = Array.from({ length: teamData.length }, (_, i) =>
    prisma.project.create({
      data: {
        teamNumber: i + 1,
        name: `Stall #${i + 1}`,
        voteCount: 0,
      },
    })
  );

  await prisma.$transaction(inserts);

  const count = await prisma.project.count();
  console.log(`✅ Seeded ${count} teams successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
