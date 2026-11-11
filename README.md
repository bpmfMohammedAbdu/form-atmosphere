# Form & Atmosphere

Act as an expert Front-End Web Developer, UI/UX Designer, and Creative Technologist specializing in immersive web experiences. Your task is to build a modern, high-performance, fully responsive, and visually stunning architectural portfolio website using Next.js (App Router), Tailwind CSS, Three.js / React Three Fiber (R3F), and Framer Motion. 

The website must be exceptionally polished, feature-rich, and optimized for seamless cross-device performance (desktop, tablet, and mobile).

---

### 1. Global Layout & Theme System

* **Color Palette:** A sophisticated dark-mode architectural palette combining deep charcoal / slate backgrounds (#0B0F19, #111827), crisp white typography, and a vibrant, luxurious accent color (such as warm amber gold #F59E0B or sleek architectural cyan #06B6D4) for interactive elements and active states.

* **Background:** An adaptive, dynamic, and unique animated background (e.g., a subtle procedural particle grid or fluid geometric wireframe shader that shifts gently with mouse movement) ensuring high contrast and readability on all screens without lagging performance.

* **Sound Effects / Background Audio:** Integrate an ambient, low-volume architectural soundscape or toggleable ambient background audio player with a sleek minimalist mute/unmute UI widget fixed in the corner.

* **Interactive Chatbot:** Include an interactive AI assistant / portfolio chatbot widget fixed at the bottom right corner (expandable chat drawer) pre-programmed to answer visitor questions about background, projects, architectural philosophy, and contact details.

---

### 2. Section Breakdown & Requirements

#### A. Hero Section (3D Immersive)

* **Visuals:** An interactive 3D architectural model or parametric structure rendered via Three.js / React Three Fiber that responds dynamically to cursor movement (parallax/rotation effect).

* **Typography:** Bold, clean modern typography with a clear value proposition statement, introductory tagline, and magnetic/smooth-scrolling call-to-action buttons ("Explore Projects" and "Get in Touch").

#### B. About Section (Comprehensive Profile)

* **Layout:** A clean, multi-column grid layout that includes:

  * **Profile Image:** A high-resolution, professionally styled portrait frame with subtle hover effects.

  * **Biography:** A compelling summary highlighting architectural philosophy, design ethos, and creative direction.

  * **Education & Credentials:** Formatted academic timeline detailing degrees, institutions, and honors.

  * **Interactive Skill Set:** Categorized lists of technical and design skills (e.g., CAD, Rhino, Revit, Blender, Three.js, UI/UX, Parametric Design).

* **Skills Animation:** Implement a smooth, infinite horizontal marquee/move animation for secondary skill badges and software proficiencies.

#### C. 3D Image Exhibition / Gallery Explorer

* **Functionality:** An interactive 3D gallery space or spatial slider where visitors can rotate, inspect, and click through featured architectural renderings, concept sketches, and spatial diagrams in a virtual exhibition environment.

#### D. Selected Projects Section

* **Grid / Showcase:** Display a curated list of top architectural and design projects.

* **Project Detail Modal / Page:** Each project card must open a rich detail view containing:

  * **Image Gallery:** At least 4 to 7 high-resolution related images, renders, floor plans, and elevation views per project (arranged in an interactive masonry or slider layout with lightbox zoom).

  * **Project Metadata:** Client, location, year, structural typology, and core design narrative.

#### E. Contact Section & Footer

* **Contact Form:** A fully validated, modern input form (Name, Email, Subject, Message) with success/error states and smooth submission animations.

* **Social Links & Footer:** Clean copyright notice, direct email, location details, and animated social media profile links (LinkedIn, GitHub, Instagram, Behance).

---

### 3. Technical Constraints & Quality Standards

* **Performance:** Ensure 60 FPS performance by optimizing Three.js geometries, textures, and canvas rendering. Implement lazy loading for images and 3D models.

* **Responsiveness:** Fluid typography (using Tailwind `clamp()` or responsive sizing) and flexible CSS Grid/Flexbox layouts that scale down gracefully on mobile devices.

* **Animations:** Use Framer Motion for scroll-triggered reveals, page transitions, and smooth hover micro-interactions.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7b537f4e-4e28-55ad-a68e-dd6cd7995281).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
