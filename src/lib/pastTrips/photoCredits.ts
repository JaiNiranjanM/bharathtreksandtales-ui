import type { PhotoCredit } from "../completedTrips";

/**
 * Real photos from Wikimedia Commons, by trip slug (cover first, then the three gallery photos).
 * The browser loads them straight from Wikimedia; the credit lines are shown on each trip page.
 * To use your own photos instead, delete a slug here and add files under public/.
 */
export const photoCredits: Record<string, PhotoCredit[]> = {
  "saduragiri-trekking-2025": [
    {
      "title": "Western Ghats Rajapalayam Aug24 A7CR 02067",
      "author": "Timothy A. Gonsalves",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Western_Ghats_Rajapalayam_Aug24_A7CR_02067.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Western_Ghats_Rajapalayam_Aug24_A7CR_02067.jpg/1280px-Western_Ghats_Rajapalayam_Aug24_A7CR_02067.jpg"
    },
    {
      "title": "Srivilliputhur Andal temple (37)",
      "author": "Ssriram mt",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Srivilliputhur_Andal_temple_(37).jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Srivilliputhur_Andal_temple_%2837%29.jpg/960px-Srivilliputhur_Andal_temple_%2837%29.jpg"
    },
    {
      "title": "Sathuragiri Sundara Mahalingam Temple (18358)",
      "author": "Dr.J.Mahendran",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Sathuragiri_Sundara_Mahalingam_Temple_(18358).jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Sathuragiri_Sundara_Mahalingam_Temple_%2818358%29.jpg/960px-Sathuragiri_Sundara_Mahalingam_Temple_%2818358%29.jpg"
    },
    {
      "title": "Sathuragiri Sundara Mahalingam Temple",
      "author": "Dr.J.Mahendran",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Sathuragiri_Sundara_Mahalingam_Temple.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sathuragiri_Sundara_Mahalingam_Temple.jpg/960px-Sathuragiri_Sundara_Mahalingam_Temple.jpg"
    }
  ],
  "kathuvumalai-trekking-thandikudi-2025": [
    {
      "title": "Palani Hills from Kodai, India",
      "author": "Bikash Das",
      "license": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Palani_Hills_from_Kodai,_India.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Palani_Hills_from_Kodai%2C_India.jpg/1280px-Palani_Hills_from_Kodai%2C_India.jpg"
    },
    {
      "title": "Balamurugan Temple, Thandikudi 12",
      "author": "A.Logananth",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Balamurugan_Temple,_Thandikudi_12.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Balamurugan_Temple%2C_Thandikudi_12.jpg/960px-Balamurugan_Temple%2C_Thandikudi_12.jpg"
    },
    {
      "title": "Outer view of the fort",
      "author": "Arivukkadal",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Outer_view_of_the_fort.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Outer_view_of_the_fort.jpg/960px-Outer_view_of_the_fort.jpg"
    },
    {
      "title": "Kodaikanal Hills as seen from Roadside",
      "author": "KARTY JazZ",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Kodaikanal_Hills_as_seen_from_Roadside.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Kodaikanal_Hills_as_seen_from_Roadside.jpg/960px-Kodaikanal_Hills_as_seen_from_Roadside.jpg"
    }
  ],
  "narasimha-darshan-jharni-warangal-2025": [
    {
      "title": "Kakatiya kala thoranam in Warangal fort",
      "author": "KINNERA ARAVIND",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Kakatiya_kala_thoranam_in_Warangal_fort.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Kakatiya_kala_thoranam_in_Warangal_fort.jpg/1280px-Kakatiya_kala_thoranam_in_Warangal_fort.jpg"
    },
    {
      "title": "Narasimha Jharni temple Entry",
      "author": "Batthini Vinay Kumar Goud",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Narasimha_Jharni_temple_Entry.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Narasimha_Jharni_temple_Entry.jpg/960px-Narasimha_Jharni_temple_Entry.jpg"
    },
    {
      "title": "Charminar-Hyderabad-Monument",
      "author": "Rashid Jorvee",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Charminar-Hyderabad-Monument.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Charminar-Hyderabad-Monument.jpg/960px-Charminar-Hyderabad-Monument.jpg"
    },
    {
      "title": "Sculpture of Yali at Warangal, Telangana",
      "author": "Harshil Mehta",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Sculpture_of_Yali_at_Warangal,_Telangana.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Sculpture_of_Yali_at_Warangal%2C_Telangana.jpg/960px-Sculpture_of_Yali_at_Warangal%2C_Telangana.jpg"
    }
  ],
  "siva-darshanam-thoppaiswamy-iyer-malai-2025": [
    {
      "title": "Rock Fortress - Tiruchirappalli - India",
      "author": "Adam Jones Adam63",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Rock_Fortress_-_Tiruchirappalli_-_India.JPG",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Rock_Fortress_-_Tiruchirappalli_-_India.JPG/1280px-Rock_Fortress_-_Tiruchirappalli_-_India.JPG"
    },
    {
      "title": "Closer look of Entrance of Shri Ranganathaswamy Temple in Srirangam,near Tiruchirappali DSCN8625-1",
      "author": "Sumita Roy Dutta",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Closer_look_of_Entrance_of_Shri_Ranganathaswamy_Temple_in_Srirangam,near_Tiruchirappali_DSCN8625-1.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Closer_look_of_Entrance_of_Shri_Ranganathaswamy_Temple_in_Srirangam%2Cnear_Tiruchirappali_DSCN8625-1.jpg/960px-Closer_look_of_Entrance_of_Shri_Ranganathaswamy_Temple_in_Srirangam%2Cnear_Tiruchirappali_DSCN8625-1.jpg"
    },
    {
      "title": "Dindigul fort view from back",
      "author": "Nandhakumar790",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dindigul_fort_view_from_back.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Dindigul_fort_view_from_back.jpg/960px-Dindigul_fort_view_from_back.jpg"
    },
    {
      "title": "Dindigul Rock Ford",
      "author": "Balamurugan",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Dindigul_Rock_Ford.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Dindigul_Rock_Ford.jpg/960px-Dindigul_Rock_Ford.jpg"
    }
  ],
  "jyotirlinga-yatra-kasi-prayagraj-deoghar-2025": [
    {
      "title": "Varanasi Munshi Ghat3",
      "author": "Marcin Białek",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Varanasi_Munshi_Ghat3.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Varanasi_Munshi_Ghat3.jpg/1280px-Varanasi_Munshi_Ghat3.jpg"
    },
    {
      "title": "Boat Pilgrims Triveni Sangam Allahabad Jan24 A7C 08513",
      "author": "Timothy A. Gonsalves",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Boat_Pilgrims_Triveni_Sangam_Allahabad_Jan24_A7C_08513.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Boat_Pilgrims_Triveni_Sangam_Allahabad_Jan24_A7C_08513.jpg/960px-Boat_Pilgrims_Triveni_Sangam_Allahabad_Jan24_A7C_08513.jpg"
    },
    {
      "title": "Shri Kashi Vishwanath Temple 7",
      "author": "Gannu03",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Shri_Kashi_Vishwanath_Temple_7.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Shri_Kashi_Vishwanath_Temple_7.jpg/960px-Shri_Kashi_Vishwanath_Temple_7.jpg"
    },
    {
      "title": "Sacred Pond - Baidyanath Dham Temple Complex - Deoghar",
      "author": "Shivsh0336 at hi.wikipedia",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Sacred_Pond_-_Baidyanath_Dham_Temple_Complex_-_Deoghar.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Sacred_Pond_-_Baidyanath_Dham_Temple_Complex_-_Deoghar.jpg/960px-Sacred_Pond_-_Baidyanath_Dham_Temple_Complex_-_Deoghar.jpg"
    }
  ],
  "chennai-one-day-temple-trail-2025": [
    {
      "title": "Bird flock in vedanthangal",
      "author": "Vinoth Chandar",
      "license": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Bird_flock_in_vedanthangal.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Bird_flock_in_vedanthangal.jpg/960px-Bird_flock_in_vedanthangal.jpg"
    },
    {
      "title": "Vaikunta Perumal, Uthiramerur1",
      "author": "Ssriram mt",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Vaikunta_Perumal,_Uthiramerur1.JPG",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Vaikunta_Perumal%2C_Uthiramerur1.JPG/960px-Vaikunta_Perumal%2C_Uthiramerur1.JPG"
    },
    {
      "title": "Indian Pond Heron at sunset, Vedanthangal, Tamil Nadu Dec21 D72 22032",
      "author": "Timothy A. Gonsalves",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Indian_Pond_Heron_at_sunset,_Vedanthangal,_Tamil_Nadu_Dec21_D72_22032.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Indian_Pond_Heron_at_sunset%2C_Vedanthangal%2C_Tamil_Nadu_Dec21_D72_22032.jpg/960px-Indian_Pond_Heron_at_sunset%2C_Vedanthangal%2C_Tamil_Nadu_Dec21_D72_22032.jpg"
    },
    {
      "title": "BIRDS NESTS",
      "author": "JOSHEELA RANJINI P",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:BIRDS_NESTS.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/BIRDS_NESTS.jpg/960px-BIRDS_NESTS.jpg"
    }
  ],
  "melmudi-puratasi-special-2025": [
    {
      "title": "Sunset at Melmudi Hills",
      "author": "Antonysamy Xavier",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Sunset_at_Melmudi_Hills.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sunset_at_Melmudi_Hills.jpg/1280px-Sunset_at_Melmudi_Hills.jpg"
    },
    {
      "title": "Marudhamalai Murugan Temple, Coimbatore",
      "author": "Kamesh kumar",
      "license": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Marudhamalai_Murugan_Temple,_Coimbatore.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Marudhamalai_Murugan_Temple%2C_Coimbatore.jpg/960px-Marudhamalai_Murugan_Temple%2C_Coimbatore.jpg"
    },
    {
      "title": "Siruvani Falls bathing area",
      "author": "VasuVR",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Siruvani_Falls_bathing_area.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Siruvani_Falls_bathing_area.jpg/960px-Siruvani_Falls_bathing_area.jpg"
    },
    {
      "title": "Panoramic View of Coimbatore from Atop Marudhamalai Temple",
      "author": "Vibrantv",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Panoramic_View_of_Coimbatore_from_Atop_Marudhamalai_Temple.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Panoramic_View_of_Coimbatore_from_Atop_Marudhamalai_Temple.jpg/960px-Panoramic_View_of_Coimbatore_from_Atop_Marudhamalai_Temple.jpg"
    }
  ],
  "naimisharanya-ayodhya-kasi-2025": [
    {
      "title": "Ganga Aarti in evening at Dashashwamedh ghat, Varanasi",
      "author": "Sujay25",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Ganga_Aarti_in_evening_at_Dashashwamedh_ghat,_Varanasi.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Ganga_Aarti_in_evening_at_Dashashwamedh_ghat%2C_Varanasi.jpg/1280px-Ganga_Aarti_in_evening_at_Dashashwamedh_ghat%2C_Varanasi.jpg"
    },
    {
      "title": "Hanuman Garhi Temple-20",
      "author": "Immanuelle",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Hanuman_Garhi_Temple-20.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Hanuman_Garhi_Temple-20.jpg/960px-Hanuman_Garhi_Temple-20.jpg"
    },
    {
      "title": "Ayodhya Ram Mandir line-1",
      "author": "Immanuelle",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Ayodhya_Ram_Mandir_line-1.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ayodhya_Ram_Mandir_line-1.jpg/960px-Ayodhya_Ram_Mandir_line-1.jpg"
    },
    {
      "title": "Naimisharanya ksetra 3",
      "author": "Lusifor ,manoj shrestha",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Naimisharanya_ksetra_3.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Naimisharanya_ksetra_3.jpg/960px-Naimisharanya_ksetra_3.jpg"
    }
  ],
  "kollimalai-trek-2025": [
    {
      "title": "Aagai Gangai Falls 1",
      "author": "Rangan Datta Wiki",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Aagai_Gangai_Falls_1.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Aagai_Gangai_Falls_1.jpg/1280px-Aagai_Gangai_Falls_1.jpg"
    },
    {
      "title": "Aagai Gangai Approach 1",
      "author": "Rangan Datta Wiki",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Aagai_Gangai_Approach_1.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Aagai_Gangai_Approach_1.jpg/960px-Aagai_Gangai_Approach_1.jpg"
    },
    {
      "title": "Kolli hills forest",
      "author": "Docku",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Kolli_hills_forest.JPG",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Kolli_hills_forest.JPG/960px-Kolli_hills_forest.JPG"
    },
    {
      "title": "Kolli Hills Road view",
      "author": "Amara Bharathy",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Kolli_Hills_Road_view.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kolli_Hills_Road_view.jpg/960px-Kolli_Hills_Road_view.jpg"
    }
  ],
  "ahobilam-yaganti-2025": [
    {
      "title": "Trek to Ugra stambham at Ahobilam",
      "author": "Gopal Venkatesan",
      "license": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Trek_to_Ugra_stambham_at_Ahobilam.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Trek_to_Ugra_stambham_at_Ahobilam.jpg/1280px-Trek_to_Ugra_stambham_at_Ahobilam.jpg"
    },
    {
      "title": "Karanja Narasimha Temple at Ahobilam -1",
      "author": "Chaduvari",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Karanja_Narasimha_Temple_at_Ahobilam_-1.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Karanja_Narasimha_Temple_at_Ahobilam_-1.jpg/960px-Karanja_Narasimha_Temple_at_Ahobilam_-1.jpg"
    },
    {
      "title": "15th century Yaganti Umamahesvara temple, Andhra Pradesh India - 186",
      "author": "P. Madhusudan",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:15th_century_Yaganti_Umamahesvara_temple,_Andhra_Pradesh_India_-_186.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/15th_century_Yaganti_Umamahesvara_temple%2C_Andhra_Pradesh_India_-_186.jpg/960px-15th_century_Yaganti_Umamahesvara_temple%2C_Andhra_Pradesh_India_-_186.jpg"
    },
    {
      "title": "Ahobala trip 053",
      "author": "Pantaa",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Ahobala_trip_053.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Ahobala_trip_053.jpg/960px-Ahobala_trip_053.jpg"
    }
  ],
  "mantralayam-somasila-srisailam-2026": [
    {
      "title": "Shri Raghavendra Math 04",
      "author": "Harvinder Chandigarh",
      "license": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Shri_Raghavendra_Math_04.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Shri_Raghavendra_Math_04.jpg/1280px-Shri_Raghavendra_Math_04.jpg"
    },
    {
      "title": "Srisailam-temple-entrance",
      "author": "Chintohere",
      "license": "Public domain",
      "url": "https://commons.wikimedia.org/wiki/File:Srisailam-temple-entrance.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Srisailam-temple-entrance.jpg/960px-Srisailam-temple-entrance.jpg"
    },
    {
      "title": "Somasila Dam - September 2018 (2)",
      "author": "Rehman Abubakr",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Somasila_Dam_-_September_2018_(2).jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Somasila_Dam_-_September_2018_%282%29.jpg/960px-Somasila_Dam_-_September_2018_%282%29.jpg"
    },
    {
      "title": "Jogulamba temple gopuram alampur",
      "author": "రహ్మానుద్దీన్",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Jogulamba_temple_gopuram_alampur.JPG",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Jogulamba_temple_gopuram_alampur.JPG/960px-Jogulamba_temple_gopuram_alampur.JPG"
    }
  ],
  "shivagange-nandi-hills-skandagiri-kailasagiri-2026": [
    {
      "title": "Sun rising over a blanket of clouds, Nandi Hills, Karnataka (edit)",
      "author": "Original: Sri Chakra Pranav Derivative work: UnpetitproleX",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Sun_rising_over_a_blanket_of_clouds,_Nandi_Hills,_Karnataka_(edit).jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Sun_rising_over_a_blanket_of_clouds%2C_Nandi_Hills%2C_Karnataka_%28edit%29.jpg/1280px-Sun_rising_over_a_blanket_of_clouds%2C_Nandi_Hills%2C_Karnataka_%28edit%29.jpg"
    },
    {
      "title": "Shivagange From Foot Hills",
      "author": "Manjeshpv",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Shivagange_From_Foot_Hills.JPG",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Shivagange_From_Foot_Hills.JPG/960px-Shivagange_From_Foot_Hills.JPG"
    },
    {
      "title": "Skandagiri hills top in Chikkaballapur district -2",
      "author": "Photos Worldwide",
      "license": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Skandagiri_hills_top_in_Chikkaballapur_district_-2.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Skandagiri_hills_top_in_Chikkaballapur_district_-2.jpg/960px-Skandagiri_hills_top_in_Chikkaballapur_district_-2.jpg"
    },
    {
      "title": "Skandagiri",
      "author": "Vijets at English Wikipedia",
      "license": "Public domain",
      "url": "https://commons.wikimedia.org/wiki/File:Skandagiri.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Skandagiri.jpg/960px-Skandagiri.jpg"
    }
  ],
  "vellingiri-trek-2026": [
    {
      "title": "Velliangiri Mountains",
      "author": "Silvershocky",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Velliangiri_Mountains.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Velliangiri_Mountains.jpg/1280px-Velliangiri_Mountains.jpg"
    },
    {
      "title": "Velliangiri 6th hill sunrise",
      "author": "Wormholexx",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Velliangiri_6th_hill_sunrise.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Velliangiri_6th_hill_sunrise.jpg/960px-Velliangiri_6th_hill_sunrise.jpg"
    },
    {
      "title": "Velliangiri hill trekking 2",
      "author": "Mahadurai",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Velliangiri_hill_trekking_2.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Velliangiri_hill_trekking_2.jpg/960px-Velliangiri_hill_trekking_2.jpg"
    },
    {
      "title": "Temple after the first hill at Vellingiri",
      "author": "Sar1zxy",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Temple_after_the_first_hill_at_Vellingiri.JPG",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Temple_after_the_first_hill_at_Vellingiri.JPG/960px-Temple_after_the_first_hill_at_Vellingiri.JPG"
    }
  ],
  "agasthyakoodam-trek-2026": [
    {
      "title": "Bonacaud Picket Station Entrance",
      "author": "Pradeep717",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Bonacaud_Picket_Station_Entrance.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Bonacaud_Picket_Station_Entrance.jpg/1280px-Bonacaud_Picket_Station_Entrance.jpg"
    },
    {
      "title": "Suchindram Thanumalayan Temple 2014 (30)",
      "author": "Vinayaraj",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Suchindram_Thanumalayan_Temple_2014_(30).jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Suchindram_Thanumalayan_Temple_2014_%2830%29.jpg/960px-Suchindram_Thanumalayan_Temple_2014_%2830%29.jpg"
    },
    {
      "title": "Padmanabhaswamy Temple (78808)",
      "author": "Manukrishnan80",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Padmanabhaswamy_Temple_(78808).jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Padmanabhaswamy_Temple_%2878808%29.jpg/960px-Padmanabhaswamy_Temple_%2878808%29.jpg"
    },
    {
      "title": "Agasthyarkoodam Trekking 37",
      "author": "Athulvis",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Agasthyarkoodam_Trekking_37.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Agasthyarkoodam_Trekking_37.jpg/960px-Agasthyarkoodam_Trekking_37.jpg"
    }
  ],
  "mangaladevi-kathavumalai-trek-2026": [
    {
      "title": "Periyar National Park-Thekkady Lake - Jalakanyaka-WUS07796",
      "author": "Rainer Halama",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Periyar_National_Park-Thekkady_Lake_-_Jalakanyaka-WUS07796.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Periyar_National_Park-Thekkady_Lake_-_Jalakanyaka-WUS07796.jpg/1280px-Periyar_National_Park-Thekkady_Lake_-_Jalakanyaka-WUS07796.jpg"
    },
    {
      "title": "Mangaladevi temple",
      "author": "Reji Jacob",
      "license": "Public domain",
      "url": "https://commons.wikimedia.org/wiki/File:Mangaladevi_temple.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mangaladevi_temple.jpg/960px-Mangaladevi_temple.jpg"
    },
    {
      "title": "Mangaladevi temple Kumily",
      "author": "Vishnubonam",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Mangaladevi_temple_Kumily.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Mangaladevi_temple_Kumily.jpg/960px-Mangaladevi_temple_Kumily.jpg"
    },
    {
      "title": "Balamurugan Temple, Thandikudi 12",
      "author": "A.Logananth",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Balamurugan_Temple,_Thandikudi_12.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Balamurugan_Temple%2C_Thandikudi_12.jpg/960px-Balamurugan_Temple%2C_Thandikudi_12.jpg"
    }
  ],
  "kondarangi-rengamalai-trek-2026": [
    {
      "title": "View of Western Ghats from Palani-Kodaikanal Road",
      "author": "R.K.PRAGADHEESH",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:View_of_Western_Ghats_from_Palani-Kodaikanal_Road.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/View_of_Western_Ghats_from_Palani-Kodaikanal_Road.jpg/1280px-View_of_Western_Ghats_from_Palani-Kodaikanal_Road.jpg"
    },
    {
      "title": "Palani Hills from Kodai, India",
      "author": "Bikash Das",
      "license": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Palani_Hills_from_Kodai,_India.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Palani_Hills_from_Kodai%2C_India.jpg/960px-Palani_Hills_from_Kodai%2C_India.jpg"
    },
    {
      "title": "Hills of Kodaikanal, India",
      "author": "Bikash Das",
      "license": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Hills_of_Kodaikanal,_India.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Hills_of_Kodaikanal%2C_India.jpg/960px-Hills_of_Kodaikanal%2C_India.jpg"
    },
    {
      "title": "Outer view of the fort",
      "author": "Arivukkadal",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Outer_view_of_the_fort.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Outer_view_of_the_fort.jpg/960px-Outer_view_of_the_fort.jpg"
    }
  ],
  "gudiyam-caves-trek-15-aug-2026": [
    {
      "title": "Gudiyam Cave",
      "author": "Rameshyanthra",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Gudiyam_Cave.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Gudiyam_Cave.jpg/1280px-Gudiyam_Cave.jpg"
    },
    {
      "title": "SurutupalliTemple",
      "author": "రవిచంద్ర",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:SurutupalliTemple.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/SurutupalliTemple.jpg/960px-SurutupalliTemple.jpg"
    },
    {
      "title": "Kudiyam Cave Geo-reform",
      "author": "Rameshyanthra",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Kudiyam_Cave_Geo-reform.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Kudiyam_Cave_Geo-reform.jpg/960px-Kudiyam_Cave_Geo-reform.jpg"
    },
    {
      "title": "Poondi reservoir 03",
      "author": "Shanmugamp7",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Poondi_reservoir_03.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Poondi_reservoir_03.jpg/960px-Poondi_reservoir_03.jpg"
    }
  ],
  "gudiyam-caves-trek-16-aug-2026": [
    {
      "title": "Gudiyam Cave",
      "author": "Rameshyanthra",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Gudiyam_Cave.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Gudiyam_Cave.jpg/1280px-Gudiyam_Cave.jpg"
    },
    {
      "title": "Tiruvallur temple1",
      "author": "Ssriram mt",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Tiruvallur_temple1.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Tiruvallur_temple1.jpg/960px-Tiruvallur_temple1.jpg"
    },
    {
      "title": "Kudiyam Cave Geo-reform",
      "author": "Rameshyanthra",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Kudiyam_Cave_Geo-reform.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Kudiyam_Cave_Geo-reform.jpg/960px-Kudiyam_Cave_Geo-reform.jpg"
    },
    {
      "title": "Pulicat Lake 2024",
      "author": "Ganesh Mohan T",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Pulicat_Lake_2024.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Pulicat_Lake_2024.jpg/960px-Pulicat_Lake_2024.jpg"
    }
  ],
  "adi-kailash-babaji-cave-uttarakhand-2026": [
    {
      "title": "Parvati Kund at Adi-Kailash",
      "author": "Kcsr.ntl",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Parvati_Kund_at_Adi-Kailash.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Parvati_Kund_at_Adi-Kailash.jpg/1280px-Parvati_Kund_at_Adi-Kailash.jpg"
    },
    {
      "title": "Om Parwat",
      "author": "Geet Arts",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Om_Parwat.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Om_Parwat.jpg/960px-Om_Parwat.jpg"
    },
    {
      "title": "Jageshwar temple (6133248823)",
      "author": "Varun Shiv Kapur from New Delhi, India",
      "license": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Jageshwar_temple_(6133248823).jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Jageshwar_temple_%286133248823%29.jpg/960px-Jageshwar_temple_%286133248823%29.jpg"
    },
    {
      "title": "Nainital Lake 07",
      "author": "Slyronit",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Nainital_Lake_07.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Nainital_Lake_07.jpg/960px-Nainital_Lake_07.jpg"
    }
  ],
  "saptha-sthana-trichy-divya-desam-2026": [
    {
      "title": "Brihadisvara Temple during Maha Shivaratri-WUS03611 (edit)",
      "author": "Original: Rainer Halama Derivative work: UnpetitproleX",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_(edit).jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg/1280px-Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg"
    },
    {
      "title": "Thirupazhanam Temple",
      "author": "Krishna Kumar",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Thirupazhanam_Temple.JPG",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Thirupazhanam_Temple.JPG/960px-Thirupazhanam_Temple.JPG"
    },
    {
      "title": "Aiyarappar Temple, Thiruvaiyaru ttkcvrvb122k23iph (166)",
      "author": "Vinayaraj",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Aiyarappar_Temple,_Thiruvaiyaru_ttkcvrvb122k23iph_(166).jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Aiyarappar_Temple%2C_Thiruvaiyaru_ttkcvrvb122k23iph_%28166%29.jpg/960px-Aiyarappar_Temple%2C_Thiruvaiyaru_ttkcvrvb122k23iph_%28166%29.jpg"
    },
    {
      "title": "Closer look of Entrance of Shri Ranganathaswamy Temple in Srirangam,near Tiruchirappali DSCN8625-1",
      "author": "Sumita Roy Dutta",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Closer_look_of_Entrance_of_Shri_Ranganathaswamy_Temple_in_Srirangam,near_Tiruchirappali_DSCN8625-1.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Closer_look_of_Entrance_of_Shri_Ranganathaswamy_Temple_in_Srirangam%2Cnear_Tiruchirappali_DSCN8625-1.jpg/960px-Closer_look_of_Entrance_of_Shri_Ranganathaswamy_Temple_in_Srirangam%2Cnear_Tiruchirappali_DSCN8625-1.jpg"
    }
  ],
  "kudremukh-trek-2026": [
    {
      "title": "Kudremukh Peak Closer",
      "author": "Prashanthmuthyalanaidu",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Kudremukh_Peak_Closer.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Kudremukh_Peak_Closer.jpg/1280px-Kudremukh_Peak_Closer.jpg"
    },
    {
      "title": "Kudremukh peak",
      "author": "Gvarma.biomed",
      "license": "Public domain",
      "url": "https://commons.wikimedia.org/wiki/File:Kudremukh_peak.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Kudremukh_peak.jpg/960px-Kudremukh_peak.jpg"
    },
    {
      "title": "Gangalikal peak - kudremukh range",
      "author": "Keerthi11js",
      "license": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Gangalikal_peak_-_kudremukh_range.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Gangalikal_peak_-_kudremukh_range.jpg/960px-Gangalikal_peak_-_kudremukh_range.jpg"
    },
    {
      "title": "Chennakeshava Temple at Belur",
      "author": "Dineshkannambadi",
      "license": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Chennakeshava_Temple_at_Belur.jpg",
      "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Chennakeshava_Temple_at_Belur.jpg/960px-Chennakeshava_Temple_at_Belur.jpg"
    }
  ]
};
