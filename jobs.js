const container = document.getElementById("job-listings");

// Function to fetch job listings from the backend
async function fetchAndDisplayJobs(jobTitle, jobLocation) {
  try {
    const response = await fetch("https://resumexpert-dev.onrender.com/job-matching", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ job_title: jobTitle, job_location: jobLocation })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jobListings = await response.json();

    // Clear existing listings (if any)
    container.innerHTML = '';

    // Populate the container with fetched job listings
    jobListings.forEach(job => {
      const card = document.createElement("div");
      card.className = "job-card";

      const linksHtml = job.apply_options.map(link => `<a href="${link.apply_link}">${link.publisher}</a>`).join("");

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between;">
          <h3>${job.title}</h3>
          <div class="location">${job.location}</div>
        </div>
        <div class="company">${job.company}</div>
        <div class="description">${job.description}</div>
        <div class="job-links">
          ${linksHtml}
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching job listings:", error);
    // Display an error message to the user
    container.innerHTML = '<p>Failed to load job listings. Please try again later.</p>';
  }
}

// Call the function to fetch and display jobs when the page loads
// Retrieve analysis result from localStorage
const analysisResult = localStorage.getItem('analysisResult');

let jobTitle = null; // Start with null
let jobLocation = "New York"; // Keep hardcoded location for now

if (analysisResult) {
  try {
    const analysisData = JSON.parse(analysisResult);
    // Check if the analysis data and the required properties exist
    if (analysisData && analysisData.career_recommendations && analysisData.career_recommendations.best_match && analysisData.career_recommendations.best_match.title) {
      jobTitle = analysisData.career_recommendations.best_match.title;
    } else {
      // Data structure not as expected
      console.error("Analysis result structure is not as expected.");
    }
  } catch (e) {
    // Error parsing JSON
    console.error("Error parsing analysisResult from localStorage:", e);
  }
}

// Only fetch and display jobs if a job title was successfully retrieved
if (jobTitle) {
  fetchAndDisplayJobs(jobTitle, jobLocation);
} else {
  // If no job title was retrieved, display an error message
  const container = document.getElementById("job-listings");
  if (container) {
    container.innerHTML = '<p>Failed to process your request. Please go back to the upload page and try again.</p>';
  } else {
    console.error("Job listings container not found.");
  }
}
