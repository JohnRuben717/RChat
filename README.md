
###  1:  Basic Project Setup & Authentication

- **Frontend (Next.js)**:  
  - [x] Set up a basic Next.js project structure.
  - [x] Create pages for signup and login.
  
- **Backend (Python + FastAPI)**:
  - [x] Set up a basic FastAPI application.
  - [x] Implement a user registration endpoint (`POST /signup`) and a login endpoint (`POST /login`).
  - [x] Integrate a database (e.g., PostgreSQL) for storing user credentials and profiles.
  - [x] Generate and verify JWT tokens for authenticated requests.
  
**Features Achieved After  1:**
- [x] Users can register with their email/phone.
- [x] Users can log in and receive a JWT token.
- [x] The frontend can store and use this JWT token for authenticated requests.
- [x] Basic infrastructure (frontend + backend + database) is in place.

---

###  2: One-to-One Chat (Text Only, No Encryption Yet)

- **Backend (FastAPI)**:
  - [x] Add a `/ws` WebSocket endpoint for chat.
  - [x] Implement real-time message sending and receiving logic using Python’s asyncio and WebSockets.
  - [x] Store messages in a database keyed by sender_id and receiver_id.
  - [x] Add REST endpoints like `GET /chats/{user_id}` to fetch past messages.
  
- **Frontend (Next.js)**:
  - [x] Create a chat UI page where a logged-in user can:
    - [ ] Select another user from a contact list (you may just seed some test users at this point).
    - [x] Send and receive plain text messages in real-time via WebSocket.
  
**Features Achieved After  2:**
- [x]  Real-time personal chat is functional.
- [x] Users can send and receive text messages.
- [ ] The app persists chat history.

---

###  3: End-to-End Encryption for Personal Chats

- **Encryption Keys (Client-Side)**:
  - [ ] On the frontend, generate a public/private key pair for each user upon signup or login.
  - [ ] Store the private key securely on the client (e.g., IndexedDB), and send the public key to the server.
  
- **Backend (FastAPI)**:
  - [ ] Store each user’s **public key** in the database.
  - [ ] When a message is sent, the backend receives an already-encrypted message body. It only stores this ciphertext; it never decrypts.
  
- **Frontend (Next.js)**:
  - [ ] Before sending a message, the client retrieves the recipient’s public key from the backend.
  - [ ] Use the recipient’s public key to encrypt the message content.
  - [ ] Decrypt incoming messages using the locally stored private key.
  
**Features Achieved After  3:**
- [ ] All personal chat messages are now end-to-end encrypted.
- [ ] The server cannot read the messages; only clients hold the keys for encryption/decryption.
- [ ] Users still have all the features from previous steps, but now with security enhanced.

---

###  4: Group Chats and Broadcast Messages
 
- **Backend (FastAPI)**:
  - [ ] Add a `groups` table to the database with member lists.
  - [ ] Adjust the WebSocket logic: when a message is sent to a group, iterate through each group member and forward the encrypted message.
  - [ ] Add endpoints to create groups and add/remove members.
  
- **Frontend (Next.js)**:
  - [ ] Add a UI page for group chats.
  - [ ] Users can select a group and send messages. The client encrypts the message for each group member’s public key or uses a group key distribution strategy if implemented.
  - [ ] Add a broadcast feature where a user can send a message to a “broadcast” group that includes many recipients.
  
**Features Achieved After  4:**
- [ ] Users can create and join groups.
- [ ] Users can send encrypted messages in group contexts.
- [ ] Broadcast messages to multiple recipients are possible.
- [ ] The application now supports one-to-one and multi-user communication in real-time, all encrypted.

---

###  5: Status Updates (Similar to WhatsApp Stories)
 
- **Backend (FastAPI + Storage)**:
  - [ ] Integrate cloud storage (e.g., AWS S3) for media files.
  - [ ] Implement an endpoint to generate pre-signed URLs (`GET /media/signed_url`) for uploading status images/videos.
  - [ ] Maintain a `status` table to store references to the uploaded media and expiration timestamps.
  
- **Frontend (Next.js)**:
  - [ ] Create a UI for uploading statuses (images/videos).
  - [ ] Fetch other users’ statuses and display them.
  
**Features Achieved After  5:**
- [ ] Users can post short-lived (e.g., 24 hours) statuses with images or videos.
- [ ] Users can view each other’s statuses.
- [ ] This adds a social storytelling aspect to the chat app.

---

###  6: Voice and Video Calls (WebRTC Integration)
 
- **Backend (FastAPI)**:
  - [ ] Use WebSockets for call signaling (exchange of SDP offers/answers and ICE candidates).
  - [ ] Store basic call logs in the relational database (caller_id, callee_id, start_time, end_time).
  
- **Frontend (Next.js + WebRTC)**:
  - [ ] Implement call controls in the UI.
  - [ ] On "Call" button click, create a WebRTC peer connection, send the offer to the backend (via WebSocket), and await the callee’s answer.
  - [ ] Handle ICE candidates and establish a peer-to-peer media connection for voice/video.
  - [ ] On call end, send call logs to the backend.
  
**Features Achieved After  6:**
- [ ] Users can make voice and video calls.
- [ ] The calls are peer-to-peer, with the server only assisting in signaling.
- [ ] A record of calls (call logs) is maintained on the backend for reference.

---

###  7: Enhanced Media Sharing in Chats
 
- **Backend (FastAPI)**:
  - [ ] Provide endpoints for generating pre-signed S3 upload URLs for chat media (images, videos, audio).
  - [ ] Store encrypted references (or keys) to these media in the chat messages so that only recipients can decrypt.
  
- **Frontend (Next.js)**:
  - [ ] Add a file upload button in chat UI.
  - [ ] User selects a file, uploads it using the pre-signed URL.
  - [ ] The client sends the encrypted file reference to the recipient.
  - [ ] The recipient’s client downloads and decrypts the file as needed.
  
**Features Achieved After  7:**
- [ ] Users can share media (images, videos, audio messages) in their personal and group chats.
- [ ] Media are also end-to-end encrypted.
- [ ] The chat platform is now highly feature-rich, including text, statuses, calls, and media sharing.

---

###  8: Performance & Scalability Enhancements
 
- **Backend**:
  - [ ] Introduce caching (Redis) to speed up frequently accessed data (e.g., user profiles, group memberships).
  - [ ] Add pagination and indexing for chat message retrieval.
  - [ ] Consider load balancing and scaling the FastAPI instance behind a reverse proxy (NGINX) or use Kubernetes/ECS for orchestration.
  
- **Frontend**:
  - [ ] Optimize code splitting and use a CDN for static assets.
  - [ ] Implement lazy loading of older messages to reduce initial load times.
  
**Features Achieved After  8:**
- [ ] Faster load times for chats and statuses.
- [ ] Ability to handle more concurrent users and a higher message volume.
- [ ] Improved user experience due to performance optimization.

---

###  9: Polishing, Testing & Security Hardening
 
- **Security**:
  - [ ] Double-check JWT handling, refresh tokens if necessary.
  - [ ] Harden E2EE logic and ensure private keys are never exposed.
  - [ ] Add CSRF protection on sensitive endpoints.
  
- **Testing**:
  - [ ] Integration tests for signup, login, chat sending/receiving.
  - [ ] Automated tests for WebRTC signaling, group chat logic, media uploads.
  
- **UI/UX Improvements**:
  - [ ] Make the frontend responsive, accessible, and intuitive.
  
**Features Achieved After  9:**
- [ ] A more secure, thoroughly tested, and user-friendly application.
- [ ] Confidence in the reliability and security of every feature previously built.
