document.addEventListener("DOMContentLoaded", () => {
  const processBtn = document.querySelector(".process-btn");
  const outputDiv = document.getElementById("analysis-output");

  if (processBtn) {
    processBtn.addEventListener("click", async function () {
      const fileInput = document.getElementById("resume");
      const jobDesc = document.getElementById("job-description").value;

      if (!fileInput.files.length) {
        alert("Please select a PDF file.");
        return;
      }

      if (!jobDesc.trim()) {
        alert("Please enter a job description.");
        return;
      }

      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
      formData.append("job_desc", jobDesc);

      outputDiv.innerHTML = `<div class="card loading">Processing...</div>`;

      try {
        // 1. Upload resume & job desc
        const uploadRes = await fetch("https://resumexpert-dev.onrender.com/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();

        // 2. Analyze
        const analyzeRes = await fetch("https://resumexpert-dev.onrender.com/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadData),
        });
        const analysis = await analyzeRes.json();
        const bestMatchTitle = analysis.career_recommendations?.best_match?.title;

        // Save job title to sessionStorage to use later on jobListing.html
        sessionStorage.setItem("best_match_title", bestMatchTitle);

        // 3. Render Results
        renderAnalysisResults(analysis, outputDiv);
      } catch (err) {
        outputDiv.innerHTML = `<div class="card error">Error: ${err.message}</div>`;
      }
    });
  }

  // On jobListing.html – check if we're on job listing page and load jobs
  const jobListContainer = document.getElementById("job-listings");
  if (jobListContainer) {
    loadJobListings(jobListContainer);
  }
});

// Renders the analysis results UI
function renderAnalysisResults(data, outputDiv) {
  const bestMatch = data.career_recommendations?.best_match;
  const otherCareers = data.career_recommendations?.other_careers || [];
  const improvements = data.suggested_improvements || [];
  const missing = data.missing_keywords || [];
  const extra = data.extra_keywords_to_add || [];

  outputDiv.innerHTML = `
    <div class="card result-card">
      <h2 class="section-title">Analyzed result</h2>

      <div class="result-grid">
        <div class="score-card">
          <p>Match Score</p>
          <div class="score-value">${data.match_score ?? 'N/A'}%</div>
          <div class="score-bar">
            <div class="fill" style="width: ${data.match_score || 0}%;"></div>
          </div>

          <div class="keyword-box">
            <h4>Missing Keywords</h4>
            <div class="tag-list">
              ${missing.map(k => `<span class="tag">${k}</span>`).join("") || '<em>None</em>'}
            </div>
          </div>

          <div class="keyword-box">
            <h4>Keywords to Add</h4>
            <div class="tag-list">
              ${extra.map(k => `<span class="tag">${k}</span>`).join("") || '<em>None</em>'}
            </div>
          </div>
        </div>

        <div class="text-card">
          <h4>Suggested Improvements</h4>
          <ul>
            ${improvements.map(i => `
              <li><strong>${i.issue}</strong>: ${i.suggestion}</li>
            `).join("") || "<li>No suggestions</li>"}
          </ul>
        </div>

        <div class="text-card">
          <h4>Careers</h4>
          <p><strong>Best Match:</strong> ${bestMatch?.title || "N/A"}</p>
          <p><strong>Reason:</strong> ${bestMatch?.reason || "N/A"}</p>
          <p><strong>Other Careers:</strong></p>
          <ul>
            ${otherCareers.map(c => `
              <li><strong>${c.title}</strong>: ${c.reason}</li>
            `).join("")}
          </ul>
        </div>
      </div>

      <div class="job-button-container">
        <a href="jobListing.html" class="cta-button">View Job Listings</a>
      </div>
    </div>
  `;
}

// Loads job data using the best_match_title from sessionStorage
async function loadJobListings(container) {
  const title = sessionStorage.getItem("best_match_title") || "IT Developer";

  try {
    const res = await fetch("https://resumexpert-dev.onrender.com/job-matching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_title: title }),
    });
    const jobData = await res.json();
    const jobs = jobData.apply_options || [];

    if (!jobs.length) {
      container.innerHTML = "<p>No jobs found.</p>";
      return;
    }

    container.innerHTML = "";
    jobs.forEach(job => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between;">
          <h3>${job.job_title || 'Job Title'}</h3>
          <div class="location">${job.location || 'Unknown'}</div>
        </div>
        <div class="company">${job.company || job.publisher || 'Company'}</div>
        <div class="description">${job.description || 'No description available'}</div>
        <div class="job-links">
          <a href="${job.apply_link}" target="_blank">${job.publisher || 'Apply'}</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<p class="error">Error loading jobs: ${err.message}</p>`;
  }
}
