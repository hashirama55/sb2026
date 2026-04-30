# Scam-Detection Prototype: Test Samples

Use these samples to test the effectiveness of the ScamGuard AI prototype.

## 1. Text Analysis Samples

### Sample A: The "Emergency Relative" Scam
**Status:** 🚨 SCAM
**Text:** 
"Mom, it's me. I'm using a friend's phone. I've been involved in a minor accident and the police are holding my car until I pay a fine of $500. Please don't tell Dad yet, he'll be furious. Can you please Zelle the money to my friend's account? His handle is @QuickPay99. I need it urgently or I might have to stay at the station overnight."

### Sample B: The "Remote Job" Scam
**Status:** 🚨 SCAM
**Text:**
"Dear Candidate, We have reviewed your profile on LinkedIn and are pleased to offer you a position as a Data Entry Specialist at Global Logistics Corp. This is a fully remote position paying $45/hour. No interview is required as we are impressed by your credentials. To begin, you must purchase your home-office equipment from our certified vendor. We will send you a check for $2,000 to cover this cost; you just need to deposit it and wire the funds to the vendor immediately."

### Sample C: A Genuine Business Inquiry
**Status:** ✅ SAFE
**Text:**
"Hi Sarah, this is Mike from the local library. I'm calling to let you know that the book you reserved, 'The Great Gatsby', is now available for pickup. Our hours are 9 AM to 6 PM tomorrow. No action is needed online; you can just bring your library card when you come in. Have a great day!"

---

## 2. Audio Analysis Samples (Scripts)
*Note: To test these, you can use a Text-to-Speech (TTS) tool or record yourself reading them. For "Scam" samples, using a robotic or monotone TTS voice will help test the deepfake detection markers.*

### Sample D: The "Bank Fraud" Deepfake
**Status:** 🚨 SCAM / DEEPFAKE
**Script:**
"Hello, this is the Security Department at Chase Bank. We have detected an unauthorized transaction of one-thousand-four-hundred dollars on your account ending in four-two-zero-zero. To stop this payment, you must verify your identity. Please state your full social security number and the PIN for your debit card after the beep."
**Deepfake Characteristics to watch for:** Flat intonation, perfect but slightly robotic pronunciation, lack of natural background office noise.

### Sample E: The "Grandchild in Jail" Scam
**Status:** 🚨 SCAM
**Script:**
"(Crying sounds) Grandma? It's me. I'm in so much trouble. I'm in jail in Mexico and the lawyer says I need three thousand dollars for bail right now or I'll be stuck here for months. Please help me. Don't call my parents, they can't find out. A man is going to get on the phone now to tell you where to send the Bitcoin."
**Scam Characteristics:** Extreme emotional pressure, secrecy, request for non-traceable currency (Bitcoin).

### Sample F: A Genuine Appointment Reminder
**Status:** ✅ SAFE
**Script:**
"Hello, this is a reminder from Central Dental. You have an appointment with Dr. Arther tomorrow, Thursday at 2:00 PM. Please arrive 10 minutes early to update your paperwork. If you need to reschedule, please call our office at 555-0199. We look forward to seeing you."
**Safe Characteristics:** Specific details (doctor name, time), no request for money or sensitive data, provides a clear call-back number.
