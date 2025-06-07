document.addEventListener("DOMContentLoaded", () => {
    const gridElement = document.getElementById("grid");
    const loadingElement = document.getElementById("loading");
    const refreshButton = document.getElementById("refresh");
    const helpBtn = document.getElementById("helpBtn");
    const helpModal = document.getElementById("helpModal");
    const closeBtn = document.querySelector(".close-btn");

    // Modal functionality
    helpBtn.addEventListener("click", () => {
        helpModal.classList.remove("hidden");
    });

    closeBtn.addEventListener("click", () => {
        helpModal.classList.add("hidden");
    });

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === helpModal) {
            helpModal.classList.add("hidden");
        }
    });

    // Number of faces to fetch
    const totalFaces = 20;

    async function fetchFaces() {
        const faces = [];
        try {
            // Multiple APIs to ensure variety and reliability
            for (let i = 0; i < totalFaces; i++) {
                // Add cache-busting parameter
                const cacheBuster = `cache=${new Date().getTime()}-${i}-${Math.random()}`;

                // API: 100k Faces - AI-generated faces
                const randomId = Math.floor(Math.random() * 99999) + 1;
                let faceUrl = `https://100k-faces.glitch.me/random-image?${cacheBuster}`;
                faces.push(faceUrl);
            }
        } catch (error) {
            console.error("Error fetching faces:", error);
        }
        return faces;
    }

    // Function to fetch random first names from API
    async function fetchNames() {
        try {
            const response = await fetch("https://randomuser.me/api/?results=" + totalFaces);
            const data = await response.json();

            // Extract first names from the response
            return data.results.map((person) => person.name.first);
        } catch (error) {
            console.error("Error fetching names:", error);
            // Fallback: generate placeholder names
            return Array(totalFaces)
                .fill()
                .map((_, i) => `Person ${i + 1}`);
        }
    }

    // Function to create the face grid
    async function createFaceGrid() {
        try {
            gridElement.innerHTML = "";
            loadingElement.classList.remove("hidden");
            gridElement.classList.add("hidden");
            refreshButton.classList.add("hidden");

            // Generate cache-busting query string
            const cacheBuster = `cache=${new Date().getTime()}`;

            // Fetch faces and names in parallel
            const [faceUrls, names] = await Promise.all([fetchFaces(), fetchNames()]);

            // Create face cards
            faceUrls.forEach((faceUrl, index) => {
                const name = names[index];

                const card = document.createElement("div");
                card.className = "face-card";

                // Create image element with error handling
                const img = document.createElement("img");
                img.className = "face-img";
                img.alt = "AI Generated Face";
                img.loading = "lazy";
                img.src = faceUrl;

                // Add error handling for images
                img.onerror = () => {
                    // If image fails to load, use a fallback
                    img.src = `https://api.dicebear.com/7.x/personas/svg?seed=${name}${index}`;
                };

                const nameDiv = document.createElement("div");
                nameDiv.className = "face-name";
                nameDiv.textContent = name;

                const coverDiv = document.createElement("div");
                coverDiv.className = "cover";
                coverDiv.innerHTML = '<div class="cover-icon">🙈</div>';

                card.appendChild(img);
                card.appendChild(nameDiv);
                card.appendChild(coverDiv);

                // Add click event to toggle visibility
                card.addEventListener("click", () => {
                    card.classList.toggle("covered");
                });

                gridElement.appendChild(card);
            });

            // Hide loading and show grid
            loadingElement.classList.add("hidden");
            gridElement.classList.remove("hidden");
            refreshButton.classList.remove("hidden");
        } catch (error) {
            console.error("Error creating face grid:", error);
            loadingElement.textContent = "Error loading faces. Please try again later.";
        }
    }

    // Initial load
    createFaceGrid();

    // Refresh button
    refreshButton.addEventListener("click", createFaceGrid);
});
